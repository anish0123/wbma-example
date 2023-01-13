import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {uploadsUrl} from '../utils/variables';

const ListItem = ({singleMedia, navigation}) => {
  const item = singleMedia;
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Single', item);
      }}
    >
      <View style={styles.main}>
        <Image
          style={styles.image}
          source={{uri: uploadsUrl + item.thumbnails?.w160}}
        />
        <View style={styles.info}>
          <Text style={{fontSize: 20, color: 'rgb(255,255,255)'}}>
            {item.title}
          </Text>
          <Text style={{color: '#D3D3D3'}}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row',
    height: 150,
    width: 400,
    justifyContent: 'center',
    backgroundColor: '#242834',
    marginTop: 10,
  },
  image: {
    flex: 1,
    width: 100,
    height: 100,
    marginTop: 25,
    marginRight: 10,
    marginLeft: 10,
    borderBottomLeftRadius: 60,
  },
  info: {
    flex: 1,
    width: 100,
    marginRight: 30,
    justifyContent: 'center',
  },
});

export default ListItem;
