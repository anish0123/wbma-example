import {
  StyleSheet,
  SafeAreaView,
  Platform,
  ImageBackground,
  View,
  Text,
} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import {Settings} from 'react-native-feather';

const Header = () => {
  return (
    <View style={styles.header}>
      <ImageBackground
        source={require('../assets/westie.jpeg')}
        style={styles.bgImage}
        imageStyle={{
          borderBottomRightRadius: 40,
          borderBottomLeftRadius: 40,
        }}
      ></ImageBackground>
      <Settings stroke="black" width={32} height={32} style={styles.settings} />
      <Text style={styles.hello}> Hello from a cute dog!</Text>
    </View>
  );
};

const Home = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.main}>
        <List navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(0,0,0)',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    marginTop: 0,
  },
  header: {
    flex: 2,
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  hello: {
    fontSize: 20,
    fontWeight: 'larger',
    position: 'absolute',
    bottom: 5,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  settings: {
    position: 'absolute',
    right: 30,
    top: 15,
  },
  main: {
    flex: 4,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
