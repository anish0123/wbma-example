import {Button, Card, Input} from '@rneui/themed';
import PropTypes from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useContext, useRef, useState} from 'react';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {uploadsUrl} from '../utils/variables';
import {Video} from 'expo-av';

const Modify = ({navigation, route}) => {
  const {file} = route.params;
  console.log(file);
  const {putMedia} = useMedia();
  const [loading, setLoading] = useState(false);
  const {update, setUpdate} = useContext(MainContext);
  const video = useRef(null);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: file.title,
      description: file.description,
    },
    mode: 'onChange',
  });

  const modifyFile = async (data) => {
    // TODO: create form data and post it
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const modifyResult = await putMedia(file.file_id, data, token);
      console.log('modify Result', modifyResult);

      Alert.alert('Success', modifyResult.message, [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK Pressed');
            // update 'update' state in context
            setUpdate(!update);
            // reset form
            // TODO: navigated to home;
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('file modify failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <Card>
          {file.media_type === 'video' ? (
            <Video
              ref={video}
              source={{uri: uploadsUrl + file.filename}}
              style={{width: '100%', height: 500}}
              resizeMode="contain"
              useNativeControls
              onError={(error) => {
                console.log(error);
              }}
            />
          ) : (
            <Card.Image source={{uri: uploadsUrl + file.filename}} />
          )}

          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Title is required',
              },
              minLength: {
                value: 3,
                message: 'Title Min length is 3 characters.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Title"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                errorMessage={errors.title && errors.title.message}
              />
            )}
            name="title"
          />
          <Controller
            control={control}
            rules={{
              minLength: {
                value: 5,
                message: 'Description Min length is 5 characters.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Description"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                errorMessage={errors.description && errors.description.message}
              />
            )}
            name="description"
          />
          <Button
            loading={loading}
            onPress={handleSubmit(modifyFile)}
            radius={'sm'}
            containerStyle={{
              width: '100%',
            }}
          >
            Modify
          </Button>
          {loading && <ActivityIndicator size="large" />}
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Modify;
