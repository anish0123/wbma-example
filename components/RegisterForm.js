import React from 'react';
import {StyleSheet} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import {Button, Card, Input, Text} from '@rneui/themed';

const RegisterForm = (props) => {
  const {postUser, checkUsername} = useUser();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      email: '',
      full_name: '',
    },
    mode: 'onBlur',
  });

  const register = async (registerData) => {
    console.log('Registering: ', registerData);
    try {
      const registerResult = await postUser(registerData);
      console.log('register Form', registerResult);
    } catch (error) {
      console.error('register', error);
      // TODO: notify user about failed login attempt
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

  return (
    <Card containerStyle={styles.main}>
      <Card.Title>Register</Card.Title>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required'},
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
            message: 'min 5 characters, needs one number, one uppercase letter',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="password"
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
        rules={{required: true, minLength: 3}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
        name="email"
      />
      {errors.email?.type === 'required' && <Text>is required</Text>}
      <Controller
        control={control}
        rules={{minLength: 3}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Full Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="full_name"
      />
      {errors.username?.type === 'minLength' && (
        <Text>min length is 3 characters</Text>
      )}

      <Button
        onPress={handleSubmit(register)}
        radius={'sm'}
        containerStyle={{
          width: '100%',
        }}
      >
        Register!
      </Button>
      <Card.Divider containerStyle={styles.divider} />
    </Card>
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

export default RegisterForm;
