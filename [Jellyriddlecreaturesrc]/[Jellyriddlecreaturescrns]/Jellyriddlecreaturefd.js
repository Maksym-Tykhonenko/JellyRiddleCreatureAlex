import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

// local
import Jellyriddlecreaturebckgrnd from '../[Jellyriddlecreaturecmpnts]/Jellyriddlecreaturebckgrnd';
import { useBackground } from '../[Jellyriddlecreaturestr]/jellyriddlecreaturecntxt';
import { feed } from '../jellyriddlecreaturestls';

const jllFrts = [
  { id: 'green', img: require('../../assets/images/jellyFeedGreen.png') },
  { id: 'purple', img: require('../../assets/images/jellyFeedPurple.png') },
  { id: 'grape', img: require('../../assets/images/jellyFeedGrape.png') },
  { id: 'red', img: require('../../assets/images/jellyFeedRed.png') },
];

// keys

const STORAGE_FRUITS = '@JELLY_FRUITS';
const STORAGE_HUNGRY_UNTIL = '@NIBBO_HUNGRY_UNTIL';
const STORAGE_REQUEST = '@NIBBO_REQUEST';

const EMPTY_FRUITS = {
  green: 0,
  purple: 0,
  grape: 0,
  red: 0,
};

const FIVE_HOURS = 5 * 60 * 60 * 1000;

const Jellyriddlecreaturefd = () => {
  // states
  const navigation = useNavigation();
  const [fruits, setFruits] = useState(EMPTY_FRUITS);
  const [request, setRequest] = useState(null);
  const [hungryUntil, setHungryUntil] = useState(null);
  const [speech, setSpeech] = useState('I WANT:');

  // storage
  const { isEnabledNotifications } = useBackground();

  // refs
  const errorTimeoutRef = useRef(null);
  const nibboTranslateY = useRef(new Animated.Value(0)).current;
  const nibboRotate = useRef(new Animated.Value(0)).current;
  const isFed = hungryUntil && hungryUntil > Date.now();

  const nibboRotation = nibboRotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-3deg', '3deg'],
  });

  useFocusEffect(
    useCallback(() => {
      getJllStt();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      playNibboIdleJerk();
      const jllIntID = setInterval(() => {
        playNibboIdleJerk();
      }, 7000);

      return () => clearInterval(jllIntID);
    }, []),
  );

  const playNibboIdleJerk = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(nibboTranslateY, {
          toValue: -15,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(nibboRotate, {
          toValue: 2,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(nibboTranslateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(nibboRotate, {
          toValue: -1.5,
          duration: 220,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(nibboRotate, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getJllStt = async () => {
    try {
      const svdFrts = await AsyncStorage.getItem(STORAGE_FRUITS);

      const hngrDt = await AsyncStorage.getItem(STORAGE_HUNGRY_UNTIL);

      const reqDta = await AsyncStorage.getItem(STORAGE_REQUEST);

      setFruits(svdFrts ? JSON.parse(svdFrts) : EMPTY_FRUITS);

      const untJll = hngrDt ? Number(hngrDt) : null;
      setHungryUntil(untJll);

      if (untJll && untJll > Date.now()) {
        setSpeech('THANKS!');
      } else if (reqDta) {
        setRequest(JSON.parse(reqDta));

        setSpeech('I WANT:');
      } else {
        gnrtJllReq();
      }
    } catch (e) {
      console.log('error:', e);
    }
  };

  const gnrtJllReq = async () => {
    const genFrt = jllFrts[Math.floor(Math.random() * jllFrts.length)];

    const frtAmnt = Math.floor(Math.random() * 14) + 4;

    const jellyReq = { fruitId: genFrt.id, amount: frtAmnt };
    setRequest(jellyReq);

    setSpeech('I WANT:');

    await AsyncStorage.setItem(STORAGE_REQUEST, JSON.stringify(jellyReq));
  };

  const hndlFddNibbo = async fruitId => {
    if (isFed || !request) return;

    if (fruitId !== request.fruitId) {
      setSpeech("I DON'T WANT THIS!");

      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      errorTimeoutRef.current = setTimeout(() => {
        setSpeech('I WANT:');
      }, 2000);

      return;
    }

    if (fruits[fruitId] <= 0) {
      return;
    }

    const updJllFr = {
      ...fruits,
      [fruitId]: fruits[fruitId] - 1,
    };

    const uptJllAmnt = request.amount - 1;

    setFruits(updJllFr);

    if (uptJllAmnt > 0) {
      const updatedRequest = {
        ...request,
        amount: uptJllAmnt,
      };

      setRequest(updatedRequest);
      setSpeech('I WANT:');

      await AsyncStorage.multiSet([
        [STORAGE_FRUITS, JSON.stringify(updJllFr)],
        [STORAGE_REQUEST, JSON.stringify(updatedRequest)],
      ]);

      return;
    }

    const untlDt = Date.now() + FIVE_HOURS;

    await AsyncStorage.multiSet([
      [STORAGE_FRUITS, JSON.stringify(updJllFr)],
      [STORAGE_HUNGRY_UNTIL, untlDt.toString()],
      [STORAGE_REQUEST, ''],
    ]);

    if (isEnabledNotifications) {
      Toast.show({
        type: 'success',
        text1: 'Nibbo is full!',
        text2: 'Come back in 5 hours for more fun!',
        position: 'top',
        visibilityTime: 4000,
      });
    }

    setHungryUntil(untlDt);
    setRequest(null);
    setSpeech('THANKS!');
  };

  useEffect(() => {
    if (!hungryUntil) return;

    const tmIntrvl = setInterval(() => {
      if (Date.now() >= hungryUntil) {
        setHungryUntil(null);
        gnrtJllReq();
      }
    }, 1000);

    return () => clearInterval(tmIntrvl);
  }, [hungryUntil]);

  const frmtJllTm = jllMs => {
    const ttlTime = Math.max(0, Math.floor(jllMs / 1000));

    const jllH = String(Math.floor(ttlTime / 3600)).padStart(2, '0');

    const jllM = String(Math.floor((ttlTime % 3600) / 60)).padStart(2, '0');

    const jllS = String(ttlTime % 60).padStart(2, '0');

    return `${jllH}:${jllM}:${jllS}`;
  };

  return (
    <Jellyriddlecreaturebckgrnd>
      <View style={feed.header}>
        <TouchableOpacity onPress={() => navigation.popToTop()}>
          <Image source={require('../../assets/images/jellyHomeBtn.png')} />
        </TouchableOpacity>

        {isFed && (
          <View style={feed.timerBox}>
            <Image source={require('../../assets/images/jellyClock.png')} />
            <Text style={feed.timerText}>
              {frmtJllTm(hungryUntil - Date.now())}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate('Jellyriddlecreaturegm')}
        >
          <Image source={require('../../assets/images/jellyPlayBtn.png')} />
        </TouchableOpacity>
      </View>
      <View style={feed.container}>
        <View>
          <ImageBackground
            source={require('../../assets/images/jellyCloud.png')}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
              width: 221,
              height: 175,
              top: 30,
              left: -20,
              marginTop: 40,
            }}
          >
            <View>
              <Text style={feed.bubbleText}>{speech}</Text>

              {speech === 'I WANT:' && request && (
                <View style={feed.requestRow}>
                  <Image
                    source={jllFrts.find(f => f.id === request.fruitId)?.img}
                    style={{ width: 30, height: 30, resizeMode: 'contain' }}
                  />
                  <Text style={feed.amount}>{request.amount}</Text>
                </View>
              )}
            </View>
          </ImageBackground>
          <Animated.Image
            source={require('../../assets/images/jellyHome.png')}
            style={{
              marginTop: 39,
              right: -50,
              transform: [
                { translateY: nibboTranslateY },
                { rotate: nibboRotation },
              ],
            }}
          />
        </View>

        <View style={feed.bar}>
          {jllFrts.map(f => (
            <TouchableOpacity
              key={f.id}
              onPress={() => hndlFddNibbo(f.id)}
              disabled={isFed}
              style={feed.fruitBtn}
            >
              <Image
                source={f.img}
                style={{ width: 65, height: 65, resizeMode: 'contain' }}
              />
              <View style={feed.countBox}>
                <Text style={feed.count}>{fruits[f.id]}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Jellyriddlecreaturebckgrnd>
  );
};

export default Jellyriddlecreaturefd;
