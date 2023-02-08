import {appId, baseUrl} from '../utils/variables';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';

const doFetch = async (url, options) => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok) {
    const message = json.error
      ? `${json.message} : ${json.error}`
      : json.message;
    throw new Error(message || response.statusText);
  }
  return json;
};

const useMedia = (myFilesOnly) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update, user} = useContext(MainContext);

  const loadMedia = async () => {
    try {
      let json = await useTag().getFilesByTag(appId);
      // Keep user files if myFiles
      if (myFilesOnly) {
        json = json.filter((file) => file.user_id === user.user_id);
      }
      json.reverse();
      const media = await Promise.all(
        json.map(async (file) => {
          const fileResponse = await fetch(baseUrl + 'media/' + file.file_id);
          return await fileResponse.json();
        })
      );

      setMediaArray(media);
    } catch (e) {
      console.error('List, LoadMedia', e);
    }
  };

  useEffect(() => {
    loadMedia();
    // load media when update state changes in main context
    // add update state to the array below
  }, [update]);

  const postMedia = async (fileData, token) => {
    const options = {
      method: 'post',
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data',
      },
      body: fileData,
    };
    try {
      // TODO: use fetch to send request to media endpoint and return the result as json, handle errors with try/catch and response.ok
      const uploadResult = await doFetch(baseUrl + 'media', options);
      return uploadResult;
    } catch (error) {
      throw new Error('postMedia: ', error.message);
    }
  };

  const deleteMedia = async (id, token) => {
    try {
      return await doFetch(baseUrl + 'media/' + id, {
        headers: {'x-access-token': token},
        method: 'delete',
      });
    } catch (error) {
      throw new Error('deleteMedia' + error.message);
    }
  };

  const putMedia = async (id, data, token) => {
    const options = {
      method: 'put',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      // TODO: use fetch to send request to media endpoint and return the result as json, handle errors with try/catch and response.ok
      const uploadResult = await doFetch(baseUrl + 'media/' + id, options);
      return uploadResult;
    } catch (error) {
      console.log('putMedia:', error.message);
      throw new Error('putMedia:', error.message);
    }
  };

  return {mediaArray, postMedia, deleteMedia, putMedia};
};

const useAuthentication = () => {
  const postLogin = async (userCredentials) => {
    // user credentials format: {username: 'someUsername', password: 'somePassword'}
    const options = {
      // TODO: add method, headers and body for sending json data with POST
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    };
    try {
      // TODO: use fetch to send request to login endpoint and return the result as json, handle errors with try/catch and response.ok
      const loginResult = await doFetch(baseUrl + 'login', options);
      return loginResult;
    } catch (error) {
      throw new Error('postLogin: ', error.message);
    }
  };
  return {postLogin};
};

// https://media.mw.metropolia.fi/wbma/docs/#api-User
const useUser = () => {
  const getUserByToken = async (token) => {
    // https://media.mw.metropolia.fi/wbma/docs/#api-User-checkUserName
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    try {
      const userData = await doFetch(baseUrl + 'users/user', options);
      return userData;
    } catch (error) {
      throw new Error('checkUser: ' + error.message);
    }
  };
  const postUser = async (userData) => {
    const options = {
      // TODO: add method, headers and body for sending json data with POST
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };
    try {
      // TODO: use fetch to send request to login endpoint and return the result as json, handle errors with try/catch and response.ok
      const registerResult = await doFetch(baseUrl + 'users', options);
      return registerResult;
    } catch (error) {
      throw new Error('postUser: ', error.message);
    }
  };

  const putUser = async (userData, token) => {
    const options = {
      // TODO: add method, headers and body for sending json data with POST
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(userData),
    };
    try {
      // TODO: use fetch to send request to login endpoint and return the result as json, handle errors with try/catch and response.ok
      const editResult = await doFetch(baseUrl + 'users', options);
      return editResult;
    } catch (error) {
      throw new Error('postUser: ', error.message);
    }
  };

  const checkUsername = async (username) => {
    try {
      const result = await doFetch(baseUrl + 'users/username/' + username);
      return result.available;
    } catch (error) {
      throw new Error('checkUsername: ' + error.message);
    }
  };

  const getUserById = async (id, token) => {
    try {
      return await doFetch(baseUrl + 'users/' + id, {
        headers: {'x-access-token': token},
      });
    } catch (error) {
      throw new Error('getUserById' + error.message);
    }
  };

  return {getUserByToken, postUser, checkUsername, putUser, getUserById};
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    try {
      return await doFetch(baseUrl + 'tags/' + tag);
    } catch (error) {
      throw new Error('getFilesByTag', error.message);
    }
  };
  const postTag = async (data, token) => {
    const options = {
      method: 'post',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      // TODO: use fetch to send request to media endpoint and return the result as json, handle errors with try/catch and response.ok
      const tagResult = await doFetch(baseUrl + 'tags', options);
      return tagResult;
    } catch (error) {
      throw new Error('postTag: ', error.message);
    }
  };
  return {getFilesByTag, postTag};
};

const useFavourite = () => {
  const postFavourite = async (fileId, token) => {
    const options = {
      method: 'post',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({file_id: fileId}),
    };
    try {
      // TODO: use fetch to send request to media endpoint and return the result as json, handle errors with try/catch and response.ok
      const tagResult = await doFetch(baseUrl + 'favourites', options);
      return tagResult;
    } catch (error) {
      throw new Error('postFavourite: ', error.message);
    }
  };

  const getFavouritesByUser = async (token) => {};

  const getFavouritesByFileId = async (fileId, token) => {
    try {
      return await doFetch(baseUrl + 'favourites/file/' + fileId);
    } catch (error) {
      throw new Error('getFavourtiesByFileId error, ' + error.message);
    }
  };

  const deleteFavourite = async (fileId, token) => {
    const options = {
      method: 'delete',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(baseUrl + 'favourites/file/' + fileId, options);
    } catch (error) {
      throw new Error('deleteFavourties error, ' + error.message);
    }
  };

  return {
    postFavourite,
    getFavouritesByUser,
    getFavouritesByFileId,
    deleteFavourite,
  };
};

export {useMedia, useAuthentication, useUser, useTag, useFavourite};
