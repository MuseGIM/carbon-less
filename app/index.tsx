import { Text, View, StyleSheet } from 'react-native';
import { Stack, Link } from 'expo-router';

export default function Page() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{title:"Home"}} />
      <View >
        <Text>Home page</Text>
        <Link href="/ongoing">hello</Link>
        <Link href="/welcome">Welcome</Link>
        <Link href="/onroute">On Route</Link>
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