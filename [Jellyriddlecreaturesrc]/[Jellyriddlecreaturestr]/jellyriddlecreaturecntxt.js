import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { JELLY_APP_BACKGROUNDS } from '../[Jellyriddlecreaturecnsts]/jellyriddlecreaturebgs';

const backgroundKKey = '@JELLY_BACKGROUND';

const BackgroundContext = createContext();

export const ContextProvider = ({ children }) => {
  const [jellyBgKey, setJellyBgKey] = useState('pink');
  const [isEnabledBgMusic, setIsEnabledBgMusic] = useState(false);
  const [isEnabledNotifications, setIsEnabledNotifications] = useState(false);

  useEffect(() => {
    getJellyCreatureAppBg();
  }, []);

  const getJellyCreatureAppBg = async () => {
    const bgKeySvd = await AsyncStorage.getItem(backgroundKKey);
    if (bgKeySvd && JELLY_APP_BACKGROUNDS[bgKeySvd]) {
      setJellyBgKey(bgKeySvd);

      console.log('loaded back :)');
    }
  };

  const changeBackground = async bgKey => {
    isEnabledNotifications &&
      Toast.show({
        type: 'success',
        text1: 'Background changed!',
        position: 'top',
        visibilityTime: 2000,
      });
    setJellyBgKey(bgKey);

    console.log('changed back !');

    await AsyncStorage.setItem(backgroundKKey, bgKey);
  };

  return (
    <BackgroundContext.Provider
      value={{
        bg: JELLY_APP_BACKGROUNDS[jellyBgKey],
        jellyBgKey,
        changeBackground,
        isEnabledBgMusic,
        setIsEnabledBgMusic,
        isEnabledNotifications,
        setIsEnabledNotifications,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);
