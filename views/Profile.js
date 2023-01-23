import React, {useContext, useEffect, useState} from 'react';
import {Text, Button, Image} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Card, Icon, ListItem} from '@rneui/themed';

const Profile = () => {
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      setAvatar(avatarArray.pop().filename);
      console.log('user avatar', avatar);
    } catch (error) {
      console.error('user avatar fetch failed', error);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  return (
    <Card>
      <Card.Title>{user.username}</Card.Title>
      <Card.Image source={{uri: uploadsUrl + avatar}} />
      <ListItem>
        <Icon name="email"></Icon>
        <ListItem.Title>Email : {user.email}</ListItem.Title>
      </ListItem>
      <ListItem>
        <Icon name="badge"></Icon>
        <ListItem.Title>Full name: {user.full_name}</ListItem.Title>
      </ListItem>
      <Button
        title="Logout!"
        onPress={async () => {
          console.log('Loggin Out!');
          setUser({});
          setIsLoggedIn(false);
          try {
            await AsyncStorage.clear();
          } catch (error) {
            console.warn('error in clearing asyncStorage!', error);
          }
        }}
      />
    </Card>
  );
};

export default Profile;
