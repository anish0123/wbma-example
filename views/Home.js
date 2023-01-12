import {StyleSheet, SafeAreaView, Platform} from 'react-native';
import List from '../components/List';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <List />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});

export default Home;
