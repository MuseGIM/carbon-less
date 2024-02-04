import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View, ImageBase } from 'react-native'
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

        { label: 'Car', value: 'Car' },
        { label: 'Bus', value: 'Bus' },
        { label: 'Train', value: 'Train' }
    ]);

    // const [itemsSecond, setItemsSecond] = useState([

    //     { label: 'Car', value: 'car' },
    //     { label: 'Bus', value: 'bus' },
    //     { label: 'Train', value: 'train' }
    // ]);

    const CustomCarIcon = () => (
        <FontAwesome name="car" size={20} color="#000000" />
    );
    // const HomeRoute = () => <Text>HomeRoute</Text>;

    // const EnRoute = () => <Text>EnRoute</Text>;
    
    // const SummaryPage = () => <Text>SummaryPage</Text>;
        
    // const MyComponent = () => {
    //   const [index, setIndex] = React.useState(0);
    //   const [routes] = React.useState([
    //     { key: 'HomeRoute', title: 'HomeRoute', focusedIcon: 'home'},
    //     { key: 'EnRoute', title: 'EnRoute', focusedIcon: 'EnRoute' },
    //     { key: 'SummaryPage', title: 'SummaryPage', focusedIcon: 'SummaryPage' },
    //   ]);
    
    //   const renderScene = BottomNavigation.SceneMap({
    //     HomeRoute: HomeRoute,
    //     EnRoute: EnRoute,
    //     SummaryPage: SummaryPage,
    //   });
    // }
    

    // const [fontsLoaded, fontError] = useFonts({
    //     'Inter-Regular': require('./assets/fonts/InterRegular.ttf'),
    //   });
      
    // const onLayoutRootView = useCallback(async () => {
    //     if (fontsLoaded || fontError) {
    //       await SplashScreen.hideAsync();
    //     }
    //   }, [fontsLoaded, fontError]);
    // if (!fontsLoaded && !fontError) {
    // return null;
    // }
    return (
        <View style={styles.container}>
            <Stack.Screen options={{title:"Welcome"}} />
            <View>
                <View>
                    <Text style={styles.title}>Carbon<Text style={{ color: 'green' }}>-Less</Text></Text>
                </View>
                <View style={styles.mainContentContainer}>
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
                            labelStyle ={{fontSize:32}}


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
                    <View style={styles.buttonContainer}>
                        <Link href="/onroute">
                        <Button  labelStyle={{alignSelf: "center", justifyContent: "center", fontSize: 36, lineHeight:38}}  style={{width: 300, height: 300, borderRadius: 150, display: "flex", justifyContent: "center"}} mode="contained" buttonColor='green' dark>Start Route</Button>
                        </Link>
                    </View>
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
        justifyContent: 'center',
        marginBottom: 100,
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

export default HomeScreen;
