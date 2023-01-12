import React from 'react';
import propTypes from 'prop-types';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {uploadsUrl} from '../utils/variables';

const ListItem = ({singleMedia}) => {
  const item = singleMedia;
  return (
    <TouchableOpacity>
      <View style={styles.main}>
        <Image
          style={styles.image}
          source={{uri: uploadsUrl + item.thumbnails?.w160}}
        />
        <View style={styles.info}>
          <Text style={{fontSize: 30}}>{item.title}</Text>
          <Text>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

ListItem.propTypes = {
  singleMedia: propTypes.object,
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row',
    height: 350,
    width: 400,
    justifyContent: 'center',
    backgroundColor: '#808080',
    marginTop: 5,
  },
  image: {
    flex: 1,
    width: 100,
    height: 270,
    marginTop: 30,
    marginRight: 10,
    marginLeft: 10,
  },
  info: {
    flex: 1,
    width: 100,
    marginRight: 30,
    justifyContent: 'center',
  },
});

export default ListItem;
