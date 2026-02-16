import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';

// local
import Jellyriddlecreaturebckgrnd from '../[Jellyriddlecreaturecmpnts]/Jellyriddlecreaturebckgrnd';
import { useBackground } from '../[Jellyriddlecreaturestr]/jellyriddlecreaturecntxt';
import Jellyriddlecreatureswtc from '../[Jellyriddlecreaturecmpnts]/Jellyriddlecreatureswtc';
import { setup } from '../jellyriddlecreaturestls';

const STORAGE_BG = '@JELLY_BACKGROUND';

// backs
const BACKGROUNDS = [
  {
    id: 'pink',
    img: require('../../assets/backgrounds/jellyriddlecreaturehmbg.png'),
  },
  {
    id: 'purple',
    img: require('../../assets/backgrounds/jellyriddlecreatureonbg.png'),
  },
  {
    id: 'blue',
    img: require('../../assets/backgrounds/jellyriddlecreaturehmbg3.png'),
  },
];

const EMPTY_FRUITS = {
  green: 0,
  purple: 0,
  grape: 0,
  red: 0,
};

const Jellyriddlecreaturesttngs = () => {
  const navigation = useNavigation();
  // states
  const [selected, setSelected] = useState('pink');
  const [hasProgress, setHasProgress] = useState(false);

  // storage
  const {
    bgKey,
    changeBackground,
    isEnabledBgMusic,
    setIsEnabledBgMusic,
    isEnabledNotifications,
    setIsEnabledNotifications,
  } = useBackground();

  useEffect(() => {
    chckJllPrgrss();
    getJllBgrnd();
  }, []);

  const chckJllPrgrss = async () => {
    try {
      const frPrgrss = await AsyncStorage.getItem('@JELLY_FRUITS');

      const strPrgrss = await AsyncStorage.getItem('@DAILY_STREAK');

      const hngrPrgrss = await AsyncStorage.getItem('@NIBBO_HUNGRY_UNTIL');

      const fruitsObj = frPrgrss ? JSON.parse(frPrgrss) : EMPTY_FRUITS;

      const hsFrtss =
        fruitsObj.green || fruitsObj.purple || fruitsObj.grape || fruitsObj.red;

      const hsStrcks = strPrgrss && Number(strPrgrss) > 1;
      const hsHngr = hngrPrgrss && Date.now() < Number(hngrPrgrss);

      setHasProgress(!!(hsFrtss || hsStrcks || hsHngr));
    } catch (err) {
      console.log('Check progress error', err);
    }
  };

  const getJllBgrnd = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_BG);

    if (stored) setSelected(stored);
  };

  const toggleBgMusic = async musValue => {
    await AsyncStorage.setItem('jellymusic', JSON.stringify(musValue));
    setIsEnabledBgMusic(musValue);

    console.log('togg mus');
  };

  const toggleNotification = async ntfValue => {
    Toast.show({
      type: 'success',
      text1: ntfValue ? 'Notifications Enabled' : 'Notifications Disabled',
      position: 'top',
      visibilityTime: 3000,
    });

    await AsyncStorage.setItem('jellynotification', JSON.stringify(ntfValue));
    setIsEnabledNotifications(ntfValue);

    console.log('togg ntf');
  };

  const rssJllPrgrss = () => {
    Alert.alert('Reset progress?', 'All your progress will be lost', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove([
              '@JELLY_FRUITS',
              '@NIBBO_HUNGRY_UNTIL',
              '@NIBBO_REQUEST',
              '@DAILY_LAST_OPEN_DATE',
              '@DAILY_STREAK',
            ]);
            setHasProgress(false);
          } catch (err) {
            console.log('Reset error!!', err);
          }
        },
      },
    ]);
  };

  return (
    <Jellyriddlecreaturebckgrnd>
      <View style={setup.container}>
        <View style={setup.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/images/jellyHomeBtn.png')} />
          </TouchableOpacity>
        </View>

        <View style={setup.box}>
          <Text style={setup.title}>SETTINGS</Text>
          {Platform.OS === 'ios' && (
            <View style={setup.flexdirwrapper}>
              <Text style={setup.section}>MUSIC</Text>
              <Jellyriddlecreatureswtc
                value={isEnabledBgMusic}
                onChange={() => toggleBgMusic(!isEnabledBgMusic)}
              />
            </View>
          )}
          <View style={setup.flexdirwrapper}>
            <Text style={setup.section}>NOTIFICATION</Text>
            <Jellyriddlecreatureswtc
              value={isEnabledNotifications}
              onChange={() => toggleNotification(!isEnabledNotifications)}
            />
          </View>

          <Text style={setup.section}>CHANGE BACKGROUND</Text>

          <View style={setup.bgRow}>
            {BACKGROUNDS.map(bg => (
              <TouchableOpacity
                onPress={() => changeBackground(bg.id)}
                key={bg.id}
              >
                <View
                  style={[setup.bgCard, bgKey === bg.id && setup.bgSelected]}
                >
                  <Image source={bg.img} style={setup.bgImg} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={hasProgress ? 0.7 : 1}
          onPress={hasProgress ? rssJllPrgrss : undefined}
          disabled={!hasProgress}
        >
          <LinearGradient
            colors={
              hasProgress ? ['#CD1A1A', '#FFDC12'] : ['#575757BA', '#575757BA']
            }
            style={[setup.resetBtn]}
          >
            <Text style={setup.resetTxt}>RESET PROGRESS</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Jellyriddlecreaturebckgrnd>
  );
};

export default Jellyriddlecreaturesttngs;
