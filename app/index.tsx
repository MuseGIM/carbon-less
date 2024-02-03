import { Text, View, StyleSheet } from 'react-native';
import { Stack, Link } from 'expo-router';

export default function Page() {
  return (
    <View style={styles.container}>
      <Stack.Screen name="" />
      <View >
        <Text>Home page</Text>
        <Link href="/ongoing">hello</Link>
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