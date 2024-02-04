import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Stack, Link } from 'expo-router';

export default function Page() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{title:"Home"}} />
      <View >
        <Text>Home page</Text>
        <Link href="/summary" asChild><Pressable><Text>Summary Page</Text></Pressable></Link>
        <Link href="/welcome">Welcome Page</Link>
        <Link href="/onroute">On Route</Link>
        <Link href="/extra">No Trips</Link>
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