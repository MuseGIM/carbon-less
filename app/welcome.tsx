import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View, ImageBase, Pressable } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import { Button } from 'react-native-paper'
import { FontAwesome } from '@expo/vector-icons';
import { Stack, Link, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { BottomNavigation } from 'react-native-paper';
import measure from './summary.js';

const HomeScreen = () => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([

        { label: 'Car', value: 'Car', selectable: 'selectable' },
        { label: 'Bus', value: 'Bus', disabled: true},
        { label: 'Train', value: 'Train', disabled: true}
    ]);

    const CustomCarIcon = () => (
        <FontAwesome name="car" size={20} color="#000000" />
    );

    const [fontsLoaded, fontError] = useFonts({
        'InterRegular': require('../assets/fonts/InterRegular.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);
    if (!fontsLoaded && !fontError) {
        return null;
    }
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Welcome" }} />
            <View style={{ justifyContent: "space-between", flex: 1 }}>
                <View style={{flexDirection:"column"}}>
                    <View>
                        <Text style={styles.title}>Carbon<Text style={{ fontFamily: "InterRegular", color: 'green', fontWeight:'bold'}}>-Less</Text></Text>
                    </View>
                    <View>
                        <Text style={styles.modeSelection}>Select your mode of transport:</Text>
                    </View>
                    <View style={styles.DropDownPickerContainer}>
                        <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            containerStyle={{ width: "80%", alignItems: 'center', justifyContent: 'center' }} 
                            dropDownContainerStyle={{
                                borderColor: '#000000',
                                borderWidth: 1,
                            }}
                            labelStyle={{ fontSize: 20}}
                            placeholder='Select an item...' 
                            placeholderStyle={{fontSize:16}}
                        />
                        {/* {value == "car" &&
                            (
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    containerStyle={{ width: "80%", alignItems: 'center', justifyContent: 'center', marginTop: 20 }}
                                    dropDownContainerStyle={{
                                        borderColor: '#000000',
                                        borderWidth: 1,
                                    }}

                                />
                            )
                        } */}
                    </View>

                </View>
                <View style={styles.buttonContainer}>
                    <Link style={{ flex: 1, justifyContent:"flex-end" }} href="/onroute" asChild>
                    {/* <View></View> */}
                        <Pressable><View style={{marginBottom:"22%", alignItems: "center", justifyContent:"center", backgroundColor: "green", height: 300, width: 300, borderRadius: 1000}}>
                            <Text style={{fontSize: 40, color: "#ffffff", fontWeight:'bold'}}>Start Route</Text>
                            </View></Pressable>
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
        fontFamily: "InterRegular",
    },
    title: {
        color: '#1E1E1E',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 48,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 20
    },
    modeSelection: {
        color: '#000000',
        flexDirection: 'row',
        fontSize: 20,
        paddingBottom: 30,
        textAlign: 'center',
    },
    DropDownPickerContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyConten2t: 'center',
        marginBottom: 100,
   //     display: "flex",
    //    flexDirection: "row",
   //     alignItems: "center"
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 0
    },
    mainContentContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
});

export default HomeScreen;
