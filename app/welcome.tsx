import { Text, View, StyleSheet } from 'react-native';
import { Button, List } from 'react-native-paper';
import { Stack, Link } from 'expo-router';
import { useState, useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Location from 'expo-location';

export default function Page() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
    ]);

    const [status, requestPermission] = Location.useBackgroundPermissions();

    useEffect(() => {
        (async () => {
          if(!status){
            requestPermission();
          }
        })();
      }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen name="" options={{ title: "Welcome" }} />
            <View >
                <Text>Welcome page</Text>
                <Link href="/ongoing">hello</Link>

                <Button buttonColor='#187008' mode="contained" onPress={() => console.log('Pressed')}>
                    Start
                </Button>


                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                />

                
          <Button buttonColor='#187008' mode="contained" onPress={() => console.log('Pressed')}>
            Start
          </Button>

                {/* <List.Section title="Accordions">
      <List.Accordion
        title="Uncontrolled Accordion"
        left={props => <List.Icon {...props} icon="folder" />}>
        <Link href="/onroute"><List.Item title="Car"/></Link>
        <List.Item title="Bus" />
        <List.Item title="Train"/>
      </List.Accordion>
        </List.Section> */}
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