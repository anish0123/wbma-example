import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import {Button, Card, Input} from '@rneui/themed';

const RegisterForm = (props) => {
  const {postUser} = useUser();
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
  return (
    <Card containerStyle={styles.main}>
      <Card.Title>Register</Card.Title>
      <Controller
        control={control}
        rules={{required: true, minLength: 3}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
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
      <Controller
        control={control}
        rules={{required: true, minLength: 3}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
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
