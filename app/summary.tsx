import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { LineChart } from "react-native-gifted-charts";
import { useState, useEffect } from 'react'
import { measure, getMPG, calcResults, CoordData, getAvgCoord } from './functions';

const LOCATION_TASK_NAME = 'background-location-task';

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

  var halfLength = 3;
  for(var i = locations.length > 6 ? 6 : Math.floor(locations.length/2); i < locations.length; i += halfLength){
    halfLength = 3;
    var endLength = halfLength * 2;
    if(i - 6 < 0){
      halfLength = Math.floor(i / 2);
      endLength = halfLength * 2;
    }
    
    var first_half: CoordData = getAvgCoord(locations, 0, halfLength);
    var next_half: CoordData = getAvgCoord(locations, halfLength, endLength);

    var result = calcResults(first_half, next_half);

    average_speeds.push(result.speed);
    var GPM = 1/getMPG(result.speed);
    if (result.speed < 5 || result.speed > 130){
      GPM = 0.05;
    }
    miles_traveled.push(result.distance_traveled);
    total_emissions += result.emissions;
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

interface StatsChartProps{
  data: Array<any>,
  xAxisTitle: string
}

function StatsChart(props: StatsChartProps){
  return (<View style={{flexDirection: "column", flex: 1}}>
    <LineChart data = {props.data} />
    <Text>{props.xAxisTitle}</Text>
  </View>);
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

  const [globalXChart, setGlobalXChart] = useState<number>(0.0);


  useEffect(() => {
    // TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME).then((val) => {
    //   if (val){
    //     Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    //   }
    // });
    TaskManager.unregisterAllTasksAsync();
    
    
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

  const emissionChart = (<LineChart scrollRef={globalXChart} onScroll={function(index){
    setGlobalXChart(index['nativeEvent']['contentOffset']['x']);
  }} data = {emissionData} />);
  
  return(
 <View style={styles.container}>
  <Stack.Screen options={{title:"Route Summary"}} />
    <View>
      <Text style={styles.title}>Summary<Text> Page</Text></Text>
    </View>
      

      {(speedData.length + distanceData.length + emissionData.length) > 0 && (speedLoaded || distanceLoaded || emissionLoaded) ? <ScrollView style={{flex:1}}>
      <View>
        <Text style={{textAlign: "center", fontSize: 24}}>Total Emissions: {Math.floor(emissionData[emissionData.length-1].value).toFixed(0)} g CO</Text>
        <Text style={{fontSize: 16, fontWeight:'bold', lineHeight: 18}}>2</Text>
      </View>
      <View style={{flex: 1, alignItems:"center", justifyContent: "center"}}>
        {emissionLoaded ?
          ((emissionData.length > 0 ) ? <LineChart onScroll={function(index){
            setGlobalXChart(index['nativeEvent']['contentOffset']['x']);
          }} data = {emissionData} /> : <NoData/>) :
          <ActivityIndicator animating={true}/>
        }
      </View>
      <Text style={{textAlign: "center", fontSize: 20}}>Emissions</Text>

      <View>
        <Text style={{textAlign: "center", fontSize: 24}}>Average Speed: {Math.floor(speedData.map(a => a.value).reduce((partialSum, a) => partialSum + a, 0) / speedData.length).toFixed(0)} mph</Text>
        <Text style={{fontSize: 16, fontWeight:'bold', lineHeight: 18}}>2</Text>
      </View>
      <View style={{flex: 1, alignItems:"center", justifyContent: "center"}}>
        {speedLoaded ?
          ((speedData.length > 0 ) ? <LineChart onScroll={function(index){
            setGlobalXChart(index['nativeEvent']['contentOffset']['x']);
          }} data = {speedData} /> : <NoData/>) :
          <ActivityIndicator animating={true}/>
        }
      </View>
      <Text style={{textAlign: "center", fontSize: 20}}>Average Speed</Text>

      <View>
        <Text style={{textAlign: "center", fontSize: 24}}>Total Distance Traveled: {Math.floor(distanceData.map(a => a.value).reduce((partialSum, a) => partialSum + a, 0)).toFixed(0)} mi</Text>
        <Text style={{fontSize: 16, fontWeight:'bold', lineHeight: 18}}>2</Text>
      </View>
      <View style={{flex: 1, width:300, alignItems:"center", justifyContent: "center"}}>
        {distanceLoaded ?
          ((distanceData.length > 0 ) ? <LineChart onScroll={function(index){
            setGlobalXChart(index['nativeEvent']['contentOffset']['x']);
          }} data = {distanceData} /> : <NoData/>) :
          <ActivityIndicator animating={true}/>
        }
      </View>
      <Text style={{textAlign: "center", fontSize: 20}}>Distance Traveled</Text>
    </ScrollView> : <View style={{flex: 1, alignItems:"center", justifyContent: "center"}}><NoData/></View>}
      
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