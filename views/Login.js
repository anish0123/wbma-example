import React, {useContext, useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Button, Text} from '@rneui/themed';

const Login = () => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();

  const [toggleForm, setToggleForm] = useState(true);

  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken === null) return;
      const userData = await getUserByToken(userToken);
      console.log('checkToken', userData);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.log('no valid token available', error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);
  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      style={{flex: 1}}
      activeOpacity={1}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {toggleForm ? <LoginForm /> : <RegisterForm />}
        <Text>
          {toggleForm
            ? ' No account yet'
            : 'Already have account? Please Login'}
        </Text>
        <Button
          type="outline"
          title={toggleForm ? 'Register' : 'Login'}
          onPress={() => {
            setToggleForm(false);
          }}
        />
      </KeyboardAvoidingView>
    </TouchableOpacity>
    /*  <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{flex: 1}}
        activeOpacity={1}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <LoginForm />
          <RegisterForm />
        </KeyboardAvoidingView>
      </TouchableOpacity> */
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});

export default Login;
