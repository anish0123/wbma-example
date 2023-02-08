import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Card, Icon, ListItem, Input, Button} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';

const Profile = ({navigation}) => {
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');
  const {putUser, checkUsername, getUserByToken} = useUser();
  const {
    control,
    getValues,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      full_name: '',
    },
    mode: 'onBlur',
  });

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      setAvatar(avatarArray.pop().filename);
      console.log('user avatar', avatar);
    } catch (error) {
      console.error('user avatar fetch failed', error);
    }
  };

  const checkUser = async (username) => {
    try {
      const userAvailable = await checkUsername(username);
      console.log('checkUser', userAvailable);
      return userAvailable || 'Username is already taken';
    } catch (error) {
      console.error('checkUser', error.message);
    }
  };

  const edit = async (registerData) => {
    delete registerData.confirmPassword;
    console.log('Editing: ', registerData);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await getUserByToken(userToken);
      console.log('edit function', userData);
      const editResult = await putUser(registerData, userToken);
      setUser(registerData);
      console.log('edit function', user);
      console.log('edit Form', editResult);
      alert('User Data Updated');
    } catch (error) {
      console.error('edit', error);
      // TODO: notify user about failed login attempt
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  return (
    <ScrollView>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
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
            <Button
              title="My Files"
              onPress={() => {
                navigation.navigate('MyFiles');
              }}
            />
          </Card>
          <Card>
            <Card.Title>Edit Details</Card.Title>
            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'username is required'},
                minLength: {
                  value: 3,
                  message: 'Username Min length is 3 characters.',
                },
                validate: checkUser,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  placeholder="Username"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  defaultValue={user.username}
                  value={value}
                  autoCapitalize="none"
                  errorMessage={errors.username && errors.username.message}
                />
              )}
              name="username"
            />
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message:
                    'Password is required. min 5 characters, needs one number, one uppercase letter',
                },
                pattern: {
                  value: /(?=.*\p{Lu})(?=.*[0-9]).{5,}/u,
                  message:
                    'min 5 characters, needs one number, one uppercase letter',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  placeholder="Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={true}
                  errorMessage={errors.password && errors.password.message}
                />
              )}
              name="password"
            />
            <Controller
              control={control}
              rules={{
                validate: (value) => {
                  if (value === getValues('password')) {
                    return true;
                  } else {
                    return 'passwords do not match!';
                  }
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  placeholder="Confirm Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={true}
                  errorMessage={
                    errors.confirmPassword && errors.confirmPassword.message
                  }
                />
              )}
              name="confirmPassword"
            />
            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'Email is required'},
                pattern: {
                  value: /^[a-z0-9.-_]{1,64}@[a-z0-9.-_]{3,64}/i,
                  message: 'Must be a valid email',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  placeholder="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  errorMessage={errors.email && errors.email.message}
                />
              )}
              name="email"
            />
            <Controller
              control={control}
              rules={{
                minLength: {
                  value: 3,
                  message: 'Name Min length is 3 characters.',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  placeholder="Full Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.full_name && errors.full_name.message}
                />
              )}
              name="full_name"
            />
            <Button
              onPress={handleSubmit(edit)}
              radius={'sm'}
              containerStyle={{
                width: '100%',
              }}
            >
              Edit Details!
            </Button>
            <Card.Divider containerStyle={styles.divider} />
          </Card>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  main: {
    width: '100%',
    margin: 0,
    padding: 0,
  },
  divider: {
    margin: 0,
    padding: 0,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
