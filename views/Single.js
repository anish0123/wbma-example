import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Image, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Card, ListItem, Icon} from '@rneui/themed';
import {Video} from 'expo-av';
import {useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Single = ({route}) => {
  console.log(route.params);
  const {
    title,
    description,
    filename,
    time_added: t,
    user_id: userId,
    media_type: type,
    screenshot,
  } = route.params;
  const video = useRef(null);
  const [owner, setOwner] = useState({});
  const {getUserById} = useUser();

  const getOwner = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const ownerDetails = await getUserById(userId, token);
    setOwner(ownerDetails);
  };

  useEffect(() => {
    getOwner();
  }, []);

  return (
    <ScrollView>
      <Card>
        {type === 'image' ? (
          <Image style={styles.image} source={{uri: uploadsUrl + filename}} />
        ) : (
          <Video
            ref={video}
            source={{uri: uploadsUrl + filename}}
            style={{width: '100%', height: 500}}
            resizeMode="contain"
            useNativeControls
            onError={(error) => {
              console.log(error);
            }}
            isLooping
            usePoster
            posterSource={{uri: uploadsUrl + screenshot}}
          />
        )}
        <Card.Divider />
        <ListItem>
          <ListItem.Title>{title}</ListItem.Title>
        </ListItem>
        {description && (
          <ListItem containerStyle={styles.description}>
            <Icon name="image"></Icon>
            <ListItem.Subtitle>{description}</ListItem.Subtitle>
          </ListItem>
        )}

        <ListItem>
          <Icon name="schedule" />
          <ListItem.Subtitle>
            Added At: {new Date(t).toLocaleString('fi-FI')}
          </ListItem.Subtitle>
        </ListItem>
        <ListItem>
          <Icon name="person" />
          <ListItem.Subtitle>
            User: {owner.username} ({owner.fullname})
          </ListItem.Subtitle>
        </ListItem>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 350,
  },
  description: {
    width: 350,
  },
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
