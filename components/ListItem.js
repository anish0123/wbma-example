import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Alert, Image} from 'react-native';
import {uploadsUrl} from '../utils/variables';
import {Card, ListItem as RNEListItem, Button} from '@rneui/themed';
import {ButtonGroup} from '@rneui/base';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';

const ListItem = ({singleMedia, navigation}) => {
  const {user, setUpdate, update} = useContext(MainContext);
  const {deleteMedia} = useMedia();
  const item = singleMedia;
  const doDelete = () => {
    try {
      Alert.alert('Delete', 'this file permanently', [
        {text: 'cancel'},
        {
          text: 'OK',
          onPress: async () => {
            const token = await AsyncStorage.getItem('userToken');
            const response = await deleteMedia(item.file_id, token);
            response && setUpdate(!update);
          },
        },
      ]);
    } catch (error) {
      console.log('doDelete', error);
    }
  };
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
            {item.user_id === user.user_id && (
              <ButtonGroup
                buttons={['Modify', 'Delete']}
                rounded
                containerStyle={styles.buttonContainter}
                buttonStyle={styles.button}
                onPress={(index) => {
                  if (index === 0) {
                    navigation.navigate('Modify', {file: item});
                  } else {
                    doDelete();
                  }
                }}
              />
            )}
          </View>

          <View style={styles.viewButton}>
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
  buttonContainter: {
    width: 150,
    height: 40,
  },
  viewButton: {
    position: 'absolute',
    marginLeft: 300,
    marginTop: 15,
  },
});

export default ListItem;
