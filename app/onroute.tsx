import { Image, Text, View, StyleSheet, ImageSourcePropType } from 'react-native';
import { Button } from 'react-native-paper';
import { Stack, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import styles from 'welcom.e.tsx';
import {measure, getMPG, calcResults, CoordData, getAvgCoord} from './functions'

const LOCATION_TASK_NAME = 'background-location-task';
const SECONDS_IN_A_DAY = 86400;

// const getPermissions = async () => {
//   const { status: foregroundStatus } = await Location.getForegroundPermissionsAsync();
//   if (foregroundStatus === 'granted') {
//     const { status: backgroundStatus } = await Location.getBackgroundPermissionsAsync();
//     if (backgroundStatus === 'granted') {
//       await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//         accuracy: Location.Accuracy.Balanced,
//       });
//     }
//   }
// };

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data: { locations }, error }: { data: { locations: Array<Location.LocationObject> }, error: any }) => {
  console.log("Inside task");
  if (error) {
    console.log(error);
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (locations) {
    console.log('Received new locations', locations);

    // const { locations } = data;
    // setTest(JSON.stringify(data));
    // do something with the locations captured in the background

    // const storeData = async () => {
    try {
      locations.forEach((l) => {
        const timestamp = l.timestamp.toString();
        // const obj = ;
        AsyncStorage.mergeItem('locations', JSON.stringify({ [timestamp]: l }))
      });

    } catch (e) {
      AsyncStorage.mergeItem('locations', JSON.stringify({ error: "error" }));
    }
    // };

    // storeData();
  }
});

const requestPermissions = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === 'granted') {
      console.log("starting locaiton updates");
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        // activityType: 2,
        distanceInterval: 0,
        timeInterval: 500,
      });
    }
  }
};

export default function Page() {
  // const [location, setLocation] = useState<Location.LocationObject | null>(null);
  // const [errorMsg, setErrorMsg] = useState<string>("");

  const [status, _] = Location.useBackgroundPermissions();

  const [locationsListPreview, setLocationsListPreview] = useState<string | null>("FFFFFFFF");
  // const [latitude, setLatitude] = useState<string>("LATITUDE: ");
  // const test2 = "This is another test.";



  useEffect(() => {
    (async () => {
      console.log("in first load");
      AsyncStorage.setItem('locations', JSON.stringify({}))
      await requestPermissions();
    })();
  }, []);

  useEffect(() => {

    async function fetchLocation() {
      const locationsAtStorage = await AsyncStorage.getItem("locations");

      // const location = JSON.parse(value);
      // setLatitude(location[0]['coords']['latitude']);
      setLocationsListPreview(locationsAtStorage);
    }
    const interval = setInterval(() => {
      fetchLocation();
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  let permissionText = 'Waiting..';
  if (!status?.granted) {
    permissionText = "denied"
  } else {
    permissionText = status?.status;
  }

  return (
    <View style={styles.page}>
      <Stack.Screen name="" options={{ title: "On Route" }} />
      <OnRouteContent />
      {/* <View >
        <Text>Welcome page</Text>
        <Text>{permissionText}</Text>
        <Text>{locationsListPreview}</Text>


      </View> */}
      <EndRouteButton/>
    </View>
  );
}

interface IconDataProps {
  title: string;
  data: string;
  image: ImageSourcePropType;
}

interface MissionDataProps {
  value: number;
}

function IconData(props: IconDataProps) {
  return (<View style={styles.tripInformationCol}>
    <View>
      {/* <Text>IMG</Text> */}
      <Image style={{ width: 32, height:64, resizeMode: "contain", tintColor: 'white'}} source={props.image} />
    </View>
    <View style={{paddingLeft: 8}}>
      <Text style={{color:"#ffffff", fontWeight: "bold", fontSize: 14}}>{props.title}</Text>
      <Text style={{color:"#ffffff", fontSize: 14}}>{props.data}</Text>
    </View>
  </View>);
};


function secsToTime(seconds: number, meridiem: boolean = false){
  var hours = Math.floor(seconds/3600);
  var minutes = Math.floor(seconds/60) - (hours*60);
  var secs = seconds % 60;
  if (meridiem){
    if (hours == 12){
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} PM`;
    } else if (hours > 12){
      return `${(hours-12).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} PM`;
    } else {
      return `${(hours > 0 ? hours : 12).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} AM`;
    }
  }
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${Math.floor(secs).toString().padStart(2, "0")}`;
}


function QuickStats() {

  var [avgSpeed, setAvgSpeed] = useState<number>(0.0);
  var [distance, setDistance] = useState<number>(0.0);
  var [duration, setDuration] = useState<number>(0.0);

  var [startTime, setStartTime] = useState<number>(0.0);
  var [endTime, setEndTime] = useState<number>(0.0);

  var [carbonEmissions, setCarbonEmissions] = useState<number>(0.0);
  var emissions = 0;

  useEffect(() => {

    async function updateStats() {
      const locationsAtStorage = await AsyncStorage.getItem("locations");

      if (!locationsAtStorage) {
        return;
      }
      var locations: Array<Location.LocationObject> = Object.values(JSON.parse(locationsAtStorage));
      locations.sort((a, b) => b.timestamp - a.timestamp); // descending order  

      var first_timestamp = locations[locations.length-1].timestamp - (1000*3600*5);
      setStartTime(first_timestamp/1000);
      var last_timestamp = locations[0].timestamp - (1000*3600*5);
      setEndTime(last_timestamp/1000);
      setDuration((last_timestamp - first_timestamp)/1000);

      var halfPoint = 8;
      var endPoint = 16;
      if (locations.length < 16) {
        endPoint = locations.length - (locations.length % 2);
        halfPoint = Math.floor(endPoint/2);
      }

      if (halfPoint <= 0){
        return;
      }

      var first_half: CoordData = getAvgCoord(locations, 0, halfPoint);
      var next_half: CoordData = getAvgCoord(locations, halfPoint, endPoint);

      var result = calcResults(first_half, next_half);

      // miles_traveled.push(result.distance_traveled);
      // total_emissions += result.emissions;
      // carbon_emissions.push(total_emissions);

      setAvgSpeed(result.speed);
      
      if(result.emissions > 2)
        emissions += result.emissions;
      setCarbonEmissions(emissions);

      // get distance
      var coords = locations.map(v => [v.coords.latitude, v.coords.longitude, v.coords.altitude]);
      
      var distance = 0;
      for (var i = 0; i < coords.length-1; i++){
        var dm = measure(coords[i+1][0]!, coords[i+1][1]!, coords[i][0]!, coords[i][1]!);
        var altitude_delta = coords[i][2]! - coords[i+1][2]!;
        dm = Math.sqrt((dm**2) + (altitude_delta**2));
        distance += dm;
      }
      distance *= 0.000621371;
      setDistance(distance);
    }
    const interval = setInterval(() => {
      updateStats();
    }, 1000);

    updateStats();

    return () => clearInterval(interval);
  }, []);

  return (<View style={styles.tripInformationBox}>
    <View style={styles.tripInformationSubBox}>
      <View style={styles.tripInformationRow}>
        <View style={styles.tripInformationCol}><IconData image={require('../assets/images/avgSpeed.png')} data={Math.floor(avgSpeed > 5 ? avgSpeed : 0).toFixed(1) + " mph"} title="Average Speed" /></View>
        <View style={styles.tripInformationCol}><IconData image={require('../assets/images/distance.png')} data={distance.toFixed(1) + " mi"} title="Distance" /></View>
        <View style={styles.tripInformationCol}><IconData image={require('../assets/images/duration.png')} data={duration > 0 ? secsToTime(duration) : "--:--:--"} title="Duration" /></View>
      </View>
      <View style={styles.tripInformationRow}>
        <View style={styles.tripInformationCol}><IconData image={require('../assets/images/startTime.png')} data={startTime > 0 ? secsToTime(startTime % SECONDS_IN_A_DAY, true) : "--:--"} title="Start Time" /></View>
        <View style={styles.tripInformationCol}><IconData image={require('../assets/images/endTime.png')} data={endTime > 0 ? secsToTime(endTime % SECONDS_IN_A_DAY, true) : "--:--"} title="End Time" /></View>
      </View>
    </View>
    <View style={{alignItems:"center"}}>
      <View>
        <Text style={{ fontSize: 24, fontWeight:'bold',marginBottom: 15, color:'white'}}>Real-Time Carbon Emissions:</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
        <Text style={{ fontSize: 32, fontWeight:'bold', color:'white'}}>{Math.floor(carbonEmissions/3)} g CO</Text>
        <Text style={{fontSize: 16, fontWeight:'bold' ,lineHeight: 18, color:'white'}}>2</Text>
        <Text style={{ fontSize: 32, fontWeight:'bold', color:'white'}}>e</Text>
      </View>
    </View>
  </View>)
}

function EndRouteButton(){

  return (<View style={{}}>
    <Link style={{marginBottom:"20%"}} href="/summary">
      <Button labelStyle={{alignSelf: "center", justifyContent: "center", fontSize: 30, fontWeight:'bold',lineHeight:30, color:"#ffffff"}}  style={{width: 300, height: 100, borderRadius: 32, display: "flex", justifyContent: "center"}} mode="contained" buttonColor='green'>End Route</Button>
      
    </Link>
  </View>
);
}

export function OnRouteContent() {
  return (
    <View>
      <View style={styles.mainContentContainer}>
        <View>
          <Text style={styles.title}>On Route</Text>
        </View>
        <View>
          <Text style={styles.tripInformationHeader}>Current Trip Information</Text>
          <QuickStats />
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#1E1E1E',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 48,
    fontWeight: 'bold',
    paddingVertical: 30
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },

  mainContentContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  tripInformationHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    paddingBottom: 10

  },
  tripInformationBox: {
    display: "flex",
    alignItems: 'center',
    backgroundColor: 'green',
    color: 'white',
    borderRadius: 20,
    padding: 20
  },
  tripInformationSubBox: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 20
  },
  tripInformationRow: {
    display: "flex",
    flexDirection: "column",
  },
  tripInformationCol: {
    paddingRight: 8,
    fontSize: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
});