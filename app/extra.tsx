import React, { useCallback, useState } from 'react'
import { Image, Text, View, ImageBase, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { FontAwesome } from '@expo/vector-icons';
import { Stack, Link, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';



interface IconDataProps {
    title: string;
    data: string;
    image: ImageSourcePropType;
  }
  

  
  function IconData(props: IconDataProps) {
    return (<View style={styles.tripInformationCol}>
      <View>
        {/* <Text>IMG</Text> */}
        <Image style={{ width: 50, resizeMode: "contain" }} source={props.image} />
      </View>
      <View>
        <Text>{props.title}</Text>
        <Text>{props.data}</Text>
      </View>
    </View>);
  };

const NoTripsScreen = () => {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{title:"No Trips"}} />
            <View>
                <View>
                    <Text style={styles.title}>No Trips<Text style={{ color: 'green' }}> in Progress</Text></Text>
                </View>
                <View style={styles.mainContentContainer}>
                <View style={styles.mainContentContainer}>
                    {/* <IconData image={require('../assets/images/manstanding.png')} data="10 km/h" title="Man" /> */}
                </View>
                    <View>
                        <Text style={styles.thetitle}>You are currently idle and have no trips in progress.</Text>
                    </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Link href="/welcome">
                        <Button  labelStyle={{alignSelf: "center", justifyContent: "center", fontSize: 36, lineHeight:38}}  style={{width: 300, height: 300, borderRadius: 150, display: "flex", justifyContent: "center"}} mode="contained" buttonColor='green' dark>Go Home</Button>
                        </Link>
                    </View>
                </View>
            </View>
        );
    }


const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        fontFamily: "InterRegular"
    },
    title: {
        color: '#1E1E1E',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 48,
        fontWeight: 'bold',
        paddingVertical: 30
    },
    thetitle: {
        color: '#000000',
        flexDirection: 'row',
        fontSize: 20,
        paddingBottom: 30,
        textAlign: 'center',
    },
    buttonContainer:{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainContentContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    
});