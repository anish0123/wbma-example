import {baseUrl} from '../utils/variables';
import {useEffect, useState} from 'react';

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const loadMedia = async () => {
    try {
      const response = await fetch(baseUrl + 'media');
      const json = await response.json();
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
  }, []);

  return {mediaArray};
};

const useAuthentication = () => {
  const postLogin = async () => {
    // TODO: post login to api
    // https://media.mw.metropolia.fi/wbma/docs/#api-Authentication-PostAuth
  };
};

// https://media.mw.metropolia.fi/wbma/docs/#api-User
const useUser = () => {
  const checkUser = async () => {
    // https://media.mw.metropolia.fi/wbma/docs/#api-User-checkUserName
  };
};
export {useMedia, useAuthentication, useUser};
