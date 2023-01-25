import {StyleSheet, SafeAreaView, Platform, View} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';

const Home = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
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
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
