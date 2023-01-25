import React, {useContext} from 'react';
import {StyleSheet, Text} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useAuthentication} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';
import {Button, Card, Input} from '@rneui/themed';

const LoginForm = (props) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {postLogin} = useAuthentication();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const logIn = async (logInData) => {
    console.log('Login Button pressed');
    // const data = {username: 'anishm', password: 'anishm123'};
    try {
      const loginResult = await postLogin(logInData);
      console.log('logIn', loginResult);
      await AsyncStorage.setItem('userToken', loginResult.token);
      setUser(loginResult.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('logIn', error);
      // TODO: notify user about failed login attempt
    }
  };
  return (
    <Card containerStyle={styles.main}>
      <Card.Title containerStyle={styles.title}>Login</Card.Title>
      <Controller
        control={control}
        rules={{required: true, minLength: 3}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
        name="username"
      />
      {errors.username?.type === 'required' && <Text>is required</Text>}
      {errors.username?.type === 'minLength' && (
        <Text>min length is 3 characters</Text>
      )}
      <Controller
        control={control}
        rules={{required: true, minLength: 5}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={true}
          />
        )}
        name="password"
      />
      {errors.password && <Text>Password (min. 5 chars) is required</Text>}
      <Button
        onPress={handleSubmit(logIn)}
        radius={'sm'}
        containerStyle={{
          width: '100%',
        }}
      >
        Sign in!
      </Button>
    </Card>
  );
};

const styles = StyleSheet.create({
  main: {
    width: '100%',
    margin: 0,
    padding: 0,
  },
  title: {
    fontSize: 30,
    backgroundColor: '#FF0000',
  },
});

export default LoginForm;
