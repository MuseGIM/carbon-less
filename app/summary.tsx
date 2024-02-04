import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { LineChart } from "react-native-gifted-charts";
import { useState, useEffect } from 'react'

const GRAMS_CO2_PER_GALLON = 8887;
const LOCATION_TASK_NAME = 'background-location-task';


function measure(lat1: number, lon1: number, lat2: number, lon2: number){  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}

function getMPG(speed: number){
  // -1.004359267664*10^{-9}x^{6}+3.5676720830782*10^{-7}x^{5}-0.0000483156x^{4}+0.00321712x^{3}-0.11989x^{2}+2.68692x
  const x = speed;
  return -1.004359267664*(10^(-9))*(x^6) + 3.5676720830782*(10^(-7))*x^5 - (0.0000483156*x^4) + (0.00321712*x^3) - (0.11989*x^2) + (2.68692*x)
}

async function calculateEmissions(){
  const locationsAtStorage = await AsyncStorage.getItem("locations");
  
  if(!locationsAtStorage){
    return;
  }
  var locations: Array<Location.LocationObject> = Object.values(JSON.parse(locationsAtStorage));
  locations.sort((a, b) => a.timestamp - b.timestamp);  
  var average_speeds = [];
  var carbon_emissions = [];
  var miles_traveled = [];
  var total_emissions = 0.0;
  for(var i = 6; i < locations.length; i += 3){
    if(i - 6 < 0){
      break;
    }
    
    var timestamps = locations.slice(i-6, i).map( v => v.timestamp);
    var latitudes = locations.slice(i-6, i).map( v => v.coords.latitude);
    var longitudes = locations.slice(i-6, i).map( v => v.coords.longitude);
    var altitudes = locations.slice(i-6, i).map( v => v.coords.altitude);

    var first_3_time = timestamps.slice(0, 3).reduce( (a,b) => a + b) / 3.0;
    var first_3_latitude = latitudes.slice(0, 3).reduce( (a,b) => a + b) / 3.0;
    var first_3_longitude = longitudes.slice(0, 3).reduce( (a,b) => a + b) / 3.0;
    var first_3_altitude = null;
    var sum = altitudes.slice(0, 3).reduce( function (a,b) { 
      return (a==null ? 0 : a) + (b == null ? 0 : b);
    });
    if (sum != null){
      first_3_altitude =  sum / 3.0;
    }

    var next_3_time = timestamps.slice(3, 6).reduce( (a,b) => a + b) / 3.0;
    var next_3_latitude = latitudes.slice(3, 6).reduce( (a,b) => a + b) / 3.0;
    var next_3_longitude = longitudes.slice(3, 6).reduce( (a,b) => a + b) / 3.0;
    var next_3_altitude = null;
    var sum = altitudes.slice(3, 6).reduce( function (a,b) { 
      return (a==null ? 0 : a) + (b == null ? 0 : b);
    });
    if (sum != null){
      next_3_altitude =  sum / 3.0;
    }
    
    var time_delta = (next_3_time - first_3_time)/(1000);
    var altitude_delta = 0;
    if(next_3_altitude != null && first_3_altitude != null)
    altitude_delta = next_3_altitude - first_3_altitude;
      
    var dm = measure(first_3_latitude, first_3_longitude, next_3_latitude, next_3_longitude);
    
    var final_distance = Math.sqrt((dm**2) + (altitude_delta**2));

    var speed = final_distance / time_delta; 
    // meters per second -> miles per gallon
    speed *= 2.23694;
    average_speeds.push(speed);
    var GPM = 1/getMPG(speed);
    if (speed < 5 || speed > 130){
      GPM = 0.05;
    }
    var dist_in_miles = final_distance * 0.000621371; // converts meters to miles
    miles_traveled.push(dist_in_miles);
    var gallons_wasted = GPM * dist_in_miles;
    total_emissions += gallons_wasted*GRAMS_CO2_PER_GALLON;
    carbon_emissions.push(total_emissions);
  }

  return {
    speeds:average_speeds, 
    distances:miles_traveled,
    emissions:carbon_emissions
  };
}

function NoData (){
  return <Text style={styles.noData}>No Data Found...</Text>;
}

export default function Page() {

  const [emissionData, setEmissionData] = useState<Array<any>>([{value:0},{value:30},{value:100},{value:50}]);
  const [distanceData, setDistanceData] = useState<Array<any>>([{value:0},{value:30},{value:100},{value:50}]);
  const [speedData, setSpeedData] = useState<Array<any>>([{value:0},{value:10},{value:20},{value:30},{value:100},{value:50}]);
  const [test1, setTest1] = useState<string>("NOTH");
  const [test2, setTest2] = useState<string>("ING");

  const [emissionLoaded, setEmissionLoaded] = useState<boolean>(false);
  const [distanceLoaded, setDistanceLoaded] = useState<boolean>(false);
  const [speedLoaded, setSpeedLoaded] = useState<boolean>(false);


  useEffect(() => {
    TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME).then((val) => {
      if (val){
        Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
    });
    
    
    calculateEmissions().then(function (dict){
      setTest1(JSON.stringify(dict));
      // setTest2(JSON.stringify(dict?.speeds));

      console.log(dict?.speeds);
      console.log(dict?.emissions);

      var dataVals = []
      for(const v of dict?.emissions ?? []){
        dataVals.push({value:v});
      }
      setEmissionData(dataVals);
      setEmissionLoaded(true);
      
      dataVals = [];
      for(const v of dict?.distances ?? []){
        dataVals.push({value:v});
      }
      setDistanceData(dataVals);
      setDistanceLoaded(true);

      dataVals = []
      for(const v of dict?.speeds ?? []){
        dataVals.push({value:v});
      }
      setSpeedData(dataVals);
      setSpeedLoaded(true);
    });
  }, []);
  
  return(
 <View style={styles.container}>
  <Stack.Screen options={{title:"Route Summary"}} />
    <View>
      <Text style={styles.title}>Summary<Text style={{ color: 'green' }}> Page</Text></Text>
    </View>
    
      {(speedData.length + distanceData.length + emissionData.length) > 0 && (speedLoaded && distanceLoaded && emissionLoaded) ? <View style={{flex:1}}><View style={{flex: 1, alignItems:"center", justifyContent: "center"}}>
        {emissionLoaded ?
          ((emissionData.length > 0 ) ? <LineChart data = {emissionData} /> : <NoData/>) :
          <ActivityIndicator animating={true}/>
        }
      </View>

      <View style={{flex: 1, alignItems:"center", justifyContent: "center"}}>
        {speedLoaded ?
          ((speedData.length > 0 ) ? <LineChart data = {speedData} /> : <NoData/>) :
          <ActivityIndicator animating={true}/>
        }
      </View>

      <View style={{flex: 1, alignItems:"center", justifyContent: "center"}}>
        {distanceLoaded ?
          ((distanceData.length > 0 ) ? <LineChart data = {distanceData} /> : <NoData/>) :
          <ActivityIndicator animating={true}/>
        }
      </View>
    </View> : <View style={{flex: 1, alignItems:"center", justifyContent: "center"}}><NoData/></View>}
      
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
  },
  title: {
      color: '#1E1E1E',
      textAlign: 'center',
      justifyContent: 'center',
      fontSize: 48,
      fontWeight: 'bold',
      paddingVertical: 30
  },
  noData: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingBottom: '40%'
  }
  

});