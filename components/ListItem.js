import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Image} from 'react-native';
import {uploadsUrl} from '../utils/variables';
import {Card, ListItem as RNEListItem, Button} from '@rneui/themed';

const ListItem = ({singleMedia, navigation}) => {
  const item = singleMedia;
  return (
    <View styles={styles.details}>
      <Card containerStyle={styles.main}>
        <View style={styles.view}>
          <Image
            source={{uri: uploadsUrl + item.thumbnails?.w160}}
            style={styles.image}
          />
          <View style={styles.text}>
            <RNEListItem containerStyle={styles.listItem}>
              <RNEListItem.Title containerStyle={{margin: 0, padding: 0}}>
                {item.title}
              </RNEListItem.Title>
            </RNEListItem>
            <RNEListItem containerStyle={styles.listItem}>
              <RNEListItem.Subtitle numberOfLines={1}>
                {item.description}
              </RNEListItem.Subtitle>
            </RNEListItem>
          </View>
          <View style={styles.button}>
            <Button
              title="View"
              onPress={() => {
                navigation.navigate('Single', item);
              }}
              radius={'sm'}
            />
          </View>
        </View>
      </Card>
    </View>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  details: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  main: {
    margin: 0,
  },
  listItem: {
    margin: 0,
    padding: 0,
  },
  view: {
    flexDirection: 'row',
    width: '60%',
  },
  image: {
    width: '30%',
    height: 60,
  },
  text: {
    marginLeft: 20,
  },
  button: {
    position: 'absolute',
    marginLeft: 300,
    marginTop: 15,
  },
});

export default ListItem;
