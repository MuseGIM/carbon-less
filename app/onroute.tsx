import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Stack, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

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

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    // const { locations } = data;
    // setTest(JSON.stringify(data));
    // do something with the locations captured in the background
  }
});

export default function Page() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [status, requestPermission] = Location.useBackgroundPermissions();

  const [test, setTest] = useState<string>("");

  useEffect(() => {
    (async () => {
      if(!status?.granted){
        await requestPermission();
      }
      // let location = await Location.getCurrentPositionAsync({});
      // setLocation(location);

      Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
      });

    })();
  }, []);


  let text = 'Waiting..';
  if (!status?.granted) {
    text = "denied"
  } else {
    text = JSON.stringify(location);
  }

    return (
      <View style={styles.container}>
        <Stack.Screen name="" options={{title:"On Route"}} />
        <View >
          <Text>Welcome page</Text>
          <Text>{test}</Text>

          
          
        </View>
      </View>
   );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    link: {
      marginTop: 15,
      paddingVertical: 15,
    },
    linkText: {
      fontSize: 14,
      color: '#2e78b7',
    },
  });