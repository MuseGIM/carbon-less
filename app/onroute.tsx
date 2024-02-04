import { Image, Text, View, StyleSheet, ImageSourcePropType } from 'react-native';
import { Button } from 'react-native-paper';
import { Stack, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import styles from 'welcom.e.tsx';
import {measure, getMPG} from './functions'


const LOCATION_TASK_NAME = 'background-location-task';

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
    AsyncStorage.setItem('location', error.message);
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
        timeInterval: 1000,
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
    <View style={styles.container}>
      <Stack.Screen name="" options={{ title: "On Route" }} />
      <OnRouteContent />
      {/* <View >
        <Text>Welcome page</Text>
        <Text>{permissionText}</Text>
        <Text>{locationsListPreview}</Text>


      </View> */}
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
      <Image style={{ width: 50, resizeMode: "contain" }} source={props.image} />
    </View>
    <View>
      <Text style={{fontWeight: "bold", fontSize: 14}}>{props.title}</Text>
      <Text style={{fontSize: 14}}>{props.data}</Text>
    </View>
  </View>);
};

function EmissionsData(props: MissionDataProps) {
  return (
    <View style={{alignItems:"center"}}>
      <View>
        <Text style={{ fontSize: 24, marginBottom: 15}}>Real-Time Carbon Emissions:</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
        <Text style={{ fontSize: 32 }}>{props.value} g CO</Text>
        <Text style={{fontSize: 16, lineHeight: 18}}>2</Text>
        <Text style={{ fontSize: 32 }}>e</Text>
      </View>
    </View>
  );
}


function QuickStats() {

  var [avgSpeed, setAvgSpeed] = useState<number>(0.0);

  useEffect(() => {

    async function updateStats() {
      const locationsAtStorage = await AsyncStorage.getItem("locations");

      if (!locationsAtStorage) {
        return;
      }
      var locations: Array<Location.LocationObject> = Object.values(JSON.parse(locationsAtStorage));
      locations.sort((a, b) => b.timestamp - a.timestamp); // descending order  
      if (locations.length < 6) {
        return;
      }


      var timestamps = locations.slice(0, 6).map(v => v.timestamp);
      var latitudes = locations.slice(0, 6).map(v => v.coords.latitude);
      var longitudes = locations.slice(0, 6).map(v => v.coords.longitude);
      var altitudes = locations.slice(0, 6).map(v => v.coords.altitude);

      var first_3_time = timestamps.slice(3, 6).reduce((a, b) => a + b) / 3.0;
      var first_3_latitude = latitudes.slice(3, 6).reduce((a, b) => a + b) / 3.0;
      var first_3_longitude = longitudes.slice(3, 6).reduce((a, b) => a + b) / 3.0;
      var first_3_altitude = null;
      var sum = altitudes.slice(3, 6).reduce(function (a, b) {
        return (a == null ? 0 : a) + (b == null ? 0 : b);
      });
      if (sum != null) {
        first_3_altitude = sum / 3.0;
      }

      var next_3_time = timestamps.slice(0, 3).reduce((a, b) => a + b) / 3.0;
      var next_3_latitude = latitudes.slice(0, 3).reduce((a, b) => a + b) / 3.0;
      var next_3_longitude = longitudes.slice(0, 3).reduce((a, b) => a + b) / 3.0;
      var next_3_altitude = null;
      var sum = altitudes.slice(0, 3).reduce(function (a, b) {
        return (a == null ? 0 : a) + (b == null ? 0 : b);
      });
      if (sum != null) {
        next_3_altitude = sum / 3.0;
      }

      var time_delta = (next_3_time - first_3_time) / (1000);
      var altitude_delta = 0;
      if (next_3_altitude != null && first_3_altitude != null)
        altitude_delta = next_3_altitude - first_3_altitude;

      var dm = measure(first_3_latitude, first_3_longitude, next_3_latitude, next_3_longitude);

      var final_distance = Math.sqrt((dm ** 2) + (altitude_delta ** 2));

      var speed = final_distance / time_delta;
    }
    const interval = setInterval(() => {
      updateStats();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (<View style={styles.tripInformationBox}>
    <View style={styles.tripInformationSubBox}>
      <View style={styles.tripInformationRow}>
        <View style={styles.tripInformationCol}><IconData image={require('../assets/images/speed.png')} data={avgSpeed + " km/h"} title="Average Speed" /></View>
        <View style={styles.tripInformationCol}><IconData image={require('../assets/images/favicon.png')} data="10 km/h" title="Distance" /></View>
        <View style={styles.tripInformationCol}><IconData image={require('../assets/images/duration.png')} data="10 km/h" title="Duration" /></View>
      </View>
      <View style={styles.tripInformationRow}>
        <View style={styles.tripInformationCol}><IconData image={require('../assets/images/time.png')} data="10 km/h" title="Start Time" /></View>
        <View style={styles.tripInformationCol}><IconData image={require('../assets/images/time-bigger.png')} data="10 km/h" title="End Time" /></View>
      </View>
    </View>
    <EmissionsData value={10}/>
  </View>)
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
    fontWeight: 'bold'
  },
  tripInformationBox: {
    display: "flex",
    backgroundColor: 'green',
    borderRadius: 8,
    padding: 20
  },
  tripInformationSubBox: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 10,
    paddingBottom: 10
  },
  tripInformationRow: {
    display: "flex",
    flexDirection: "column",
  },
  tripInformationCol: {
    color: 'white',
    display: "flex",
    flexDirection: "row",
  }
});