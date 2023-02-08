import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Image, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Card, ListItem, Icon, Text} from '@rneui/themed';
import {Video} from 'expo-av';
import {useFavourite, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';

const Single = ({route}) => {
  console.log(route.params);
  const {
    title,
    description,
    filename,
    time_added: t,
    user_id: userId,
    media_type: type,
    file_id: fileId,
    filesize,
  } = route.params;
  const video = useRef(null);
  const [owner, setOwner] = useState({});
  const [likes, setLikes] = useState([]);
  const [userLikesIt, setUserLikesIt] = useState(false);
  const {getUserById} = useUser();
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();

  const getOwner = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const ownerDetails = await getUserById(userId, token);
    setOwner(ownerDetails);
  };

  const getLikes = async () => {
    try {
      const likes = await getFavouritesByFileId(fileId);
      console.log('likes', likes);
      setLikes(likes);
      // TODO: check if the current user id is included in likes array and
      // set the 'userLikesIt' accordingly
    } catch (error) {
      console.log('getLikes' + error);
    }
  };

  const likeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await postFavourite(fileId, token);
      getLikes();
      setUserLikesIt(true);
      console.log(result);
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log('likeFile' + error);
    }
  };

  const dislikeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await deleteFavourite(fileId, token);
      getLikes();
      setUserLikesIt(false);
      console.log(result);
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log('likeFile' + error);
    }
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.log('unlock', error);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.log('lock', error);
    }
  };

  useEffect(() => {
    getOwner();
    getLikes();
    unlock();
    return () => {
      lock();
    };
  }, []);

  const showVideoInFullScreen = async () => {
    try {
      if (video) await video.presentFullscreenPlayer();
    } catch (error) {
      console.log('showVideoInFullScreen', error);
    }
  };

  return (
    <ScrollView>
      <Card>
        <Card.Title>{title}</Card.Title>
        {type === 'image' ? (
          <Image style={styles.image} source={{uri: uploadsUrl + filename}} />
        ) : (
          <Video
            ref={video}
            source={{uri: uploadsUrl + filename}}
            style={{width: '100%', height: 500}}
            resizeMode="cover"
            useNativeControls
            onError={(error) => {
              console.log(error);
            }}
            isLooping
          />
        )}
        <Card.Divider />

        <ListItem>
          {userLikesIt ? (
            <Icon name="favorite" color="red" onPress={dislikeFile} />
          ) : (
            <Icon name="favorite-border" onPress={likeFile} />
          )}

          <Text>Likes: {likes.length.toString()}</Text>
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
        <ListItem>
          <Icon name="save" />
          <Text>{(filesize / 1000000).toFixed(2)} MB</Text>
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
