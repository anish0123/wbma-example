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
import * as ImagePicker from 'expo-image-picker';
import {useCallback, useContext, useRef, useState} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useFocusEffect} from '@react-navigation/native';
import {appId} from '../utils/variables';
import {Video} from 'expo-av';

const Upload = ({navigation}) => {
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const [mediaFile, setMediaFile] = useState({});
  const [loading, setLoading] = useState(false);
  const {update, setUpdate} = useContext(MainContext);
  const video = useRef(null);
  const {
    control,
    handleSubmit,
    formState: {errors},
    trigger,
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onChange',
  });

  const uploadFile = async (data) => {
    // TODO: create form data and post it
    setLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    const filename = mediaFile.uri.split('/').pop();
    let fileExt = filename.split('.').pop();
    if (fileExt === 'jpg') fileExt = 'jpeg';
    const mimeType = mediaFile.type + '/' + fileExt;
    formData.append('file', {
      uri: mediaFile.uri,
      name: filename,
      type: mimeType,
    });
    try {
      const token = await AsyncStorage.getItem('userToken');
      const uploadResult = await postMedia(formData, token);
      console.log('upload Result', uploadResult);

      const appTag = {
        file_id: uploadResult.file_id,
        tag: appId,
      };
      const tagResult = await postTag(appTag, token);
      console.log('tagResult', tagResult);
      Alert.alert('Upload Ok', 'File id: ' + uploadResult.file_id, [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK Pressed');
            // update 'update' state in context
            setUpdate(!update);
            // reset form
            resetValues();
            // TODO: navigated to home;
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('file upload failed', error);
    } finally {
      setLoading(false);
    }
  };

  const pickFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      console.log(result);

      if (!result.canceled) {
        setMediaFile(result.assets[0]);
        // Validate form
        trigger();
      }
    } catch (error) {
      console.log('pickFile', error);
    }
    // No permissions request is necessary for launching the image library
  };

  const resetValues = () => {
    setMediaFile({});
    reset();
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log('leaving');
        resetValues();
      };
    }, [])
  );

  return (
    <ScrollView>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <Card>
          {mediaFile.type === 'video' ? (
            <Video
              ref={video}
              source={{uri: mediaFile.uri}}
              style={{width: '100%', height: 500}}
              resizeMode="contain"
              useNativeControls
              onError={(error) => {
                console.log(error);
              }}
            />
          ) : (
            <Card.Image
              source={{
                uri: mediaFile.uri || 'https://placekitten.com/g/200/300',
              }}
              onPress={pickFile}
            />
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

          <Button title="Pick a file" onPress={pickFile} />
          <Button
            loading={loading}
            onPress={handleSubmit(uploadFile)}
            radius={'sm'}
            containerStyle={{
              width: '100%',
            }}
            disabled={!mediaFile.uri || errors.title || errors.description}
          >
            Upload
          </Button>
          <Button type="outline" onPress={resetValues}>
            Reset
          </Button>
          {loading && <ActivityIndicator size="large" />}
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
