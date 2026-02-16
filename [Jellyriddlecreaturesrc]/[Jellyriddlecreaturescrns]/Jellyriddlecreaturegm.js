import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  Modal,
  Share,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import Orientation from 'react-native-orientation-locker';

// local
import Jellyriddlecreaturebckgrnd from '../[Jellyriddlecreaturecmpnts]/Jellyriddlecreaturebckgrnd';
import { jellygame } from '../jellyriddlecreaturestls';

const { width, height } = Dimensions.get('window');

// helpers
const jllFrts = [
  { id: 'green', img: require('../../assets/images/jellyfruit1.png') },
  { id: 'purple', img: require('../../assets/images/jellyfruit2.png') },
  { id: 'grape', img: require('../../assets/images/jellyfruit3.png') },
  { id: 'red', img: require('../../assets/images/jellyfruit4.png') },
];

const EMPTY_FRUITS = {
  green: 0,
  purple: 0,
  grape: 0,
  red: 0,
};

const STORAGE_KEY = '@JELLY_FRUITS';

const GAME_TIME = 30;

const FallingFruit = ({ fruit, onCatch }) => {
  const translateY = useRef(new Animated.Value(-80)).current;
  const jllLft = useRef(Math.random() * (width - 80)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        jellygame.fruit,
        {
          left: jllLft,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity onPress={onCatch} activeOpacity={0.9}>
        <Image
          source={fruit.img}
          style={{ width: 80, height: 80, resizeMode: 'contain' }}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const Jellyriddlecreaturegm = () => {
  // states
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [fruits, setFruits] = useState([]);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigation = useNavigation();
  const [score, setScore] = useState({
    green: 0,
    purple: 0,
    grape: 0,
    red: 0,
  });

  // eff

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToPortrait();

      return () => Orientation.unlockAllOrientations();
    }, []),
  );

  const svCtchdFrts = async nwFrts => {
    try {
      const srtFrts = await AsyncStorage.getItem(STORAGE_KEY);
      const CrrFrts = srtFrts ? JSON.parse(srtFrts) : EMPTY_FRUITS;

      const updated = {
        green: CrrFrts.green + nwFrts.green,
        purple: CrrFrts.purple + nwFrts.purple,
        grape: CrrFrts.grape + nwFrts.grape,
        red: CrrFrts.red + nwFrts.red,
      };

      console.log('saved!!');

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.log('error:', error);
    }
  };

  useEffect(() => {
    if (paused || gameOver) return;
    if (timeLeft === 0 && !saved) {
      setGameOver(true);
      svCtchdFrts(score);
      setSaved(true);
      return;
    }

    const jllTmr = setInterval(() => {
      setTimeLeft(time => time - 1);
    }, 1000);

    return () => clearInterval(jllTmr);
  }, [timeLeft, paused, gameOver]);

  useEffect(() => {
    if (paused || gameOver) return;

    const tmIntrvl = setInterval(() => {
      const jllFrt = jllFrts[Math.floor(Math.random() * jllFrts.length)];

      setFruits(prevFrt => [...prevFrt, { ...jllFrt, key: Date.now() }]);
    }, 650);

    return () => clearInterval(tmIntrvl);
  }, [paused, gameOver]);

  const cthcFrt = (fruit, key) => {
    setScore(prevFrt => ({
      ...prevFrt,
      [fruit.id]: prevFrt[fruit.id] + 1,
    }));
    setFruits(prevFrt => prevFrt.filter(frt => frt.key !== key));
  };

  // fu

  const rstrtGm = () => {
    setTimeLeft(GAME_TIME);
    setScore({ green: 0, purple: 0, grape: 0, red: 0 });
    setFruits([]);
    setGameOver(false);
    setPaused(false);
    setSaved(false);

    console.log('restart!');
  };

  const frmtJllTm = seconds => {
    const jllM = String(Math.floor(seconds / 60)).padStart(2, '0');

    const jllS = String(seconds % 60).padStart(2, '0');

    return `${jllM}:${jllS}`;
  };

  const shrJllRs = () => {
    const shareMessage = `I collected ${score.green} green fruits, ${score.purple} purple fruits, ${score.grape} grape fruits, and ${score.red} red fruits in Jelly Riddle Creature!`;
    Share.share({
      message: shareMessage,
    });

    console.log('shared!');
  };

  return (
    <Jellyriddlecreaturebckgrnd>
      <View style={jellygame.container}>
        <View style={jellygame.header}>
          <TouchableOpacity
            onPress={() => setPaused(true)}
            style={jellygame.pauseBtn}
          >
            <Image source={require('../../assets/images/jellyGmPs.png')} />
          </TouchableOpacity>

          <View style={jellygame.timerBox}>
            <Image source={require('../../assets/images/jellyClock.png')} />
            <Text style={jellygame.timerText}>{frmtJllTm(timeLeft)}</Text>
          </View>
        </View>

        {fruits.map(fruit => (
          <FallingFruit
            key={fruit.key}
            fruit={fruit}
            onCatch={() => cthcFrt(fruit, fruit.key)}
          />
        ))}

        <View style={jellygame.scoreBox}>
          <Text style={jellygame.scoreTitle}>You have:</Text>
          <View style={jellygame.scoreRow}>
            {jllFrts.map(f => (
              <View key={f.id} style={jellygame.scoreItem}>
                <Image
                  source={f.img}
                  style={{ width: 36, height: 36, resizeMode: 'contain' }}
                />
                <Text style={jellygame.scoreTxt}>{score[f.id]}</Text>
              </View>
            ))}
          </View>
        </View>

        <Modal
          visible={paused}
          transparent
          animationType="fade"
          statusBarTranslucent={Platform.OS === 'android'}
        >
          {Platform.OS === 'ios' && (
            <BlurView
              blurType="black"
              blurAmount={2}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          )}
          <View style={jellygame.modalBg}>
            <View style={jellygame.modalBox}>
              <Text style={jellygame.modalTitle}>PAUSE</Text>

              <TouchableOpacity onPress={() => setPaused(false)}>
                <LinearGradient
                  colors={['#B7F231', '#12DAFF']}
                  style={jellygame.modalBtn}
                >
                  <Text style={jellygame.modalBtnTxt}>CONTINUE</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={rstrtGm}>
                <LinearGradient
                  colors={['#B7F231', '#12DAFF']}
                  style={jellygame.modalBtn}
                >
                  <Text style={jellygame.modalBtnTxt}>RESTART</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{ alignSelf: 'center', marginTop: 20 }}
              onPress={() => {
                navigation.popToTop();
                setPaused(false);
              }}
              activeOpacity={0.6}
            >
              <Image source={require('../../assets/images/jellyHomel.png')} />
            </TouchableOpacity>

            <Text style={jellygame.infotxt}>
              If you leave now, that food you just collected will be gone!
            </Text>
          </View>
        </Modal>

        <Modal
          visible={gameOver}
          transparent
          animationType="fade"
          statusBarTranslucent={Platform.OS === 'android'}
        >
          {Platform.OS === 'ios' && (
            <BlurView
              blurType="black"
              blurAmount={2}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          )}

          <View style={jellygame.modalBg}>
            <View style={jellygame.resultBox}>
              <Text style={jellygame.modalTitle}>THANK YOU!</Text>
              <Text style={jellygame.resultSubTitle}>
                Now Nibbo won't be hungry thanks to you!
              </Text>
              <View>
                <Image
                  source={require('../../assets/images/jellyHome.png')}
                  style={{ width: 116, height: 100, marginTop: 50 }}
                />
                <Image
                  source={require('../../assets/images/jellyFeedMe.png')}
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: -60,
                    width: 100,
                    height: 80,
                  }}
                />
              </View>

              <Text style={jellygame.resultTxt}>You caught:</Text>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 20,
                  justifyContent: 'space-between',
                  width: 200,
                  flexWrap: 'wrap',
                  marginTop: 10,
                }}
              >
                {jllFrts.map(f => (
                  <View key={f.id} style={jellygame.resultRow}>
                    <Image
                      source={f.img}
                      style={{ width: 38, height: 38, resizeMode: 'contain' }}
                    />
                    <Text style={jellygame.resultNum}>{score[f.id]}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 13,
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  rstrtGm();
                  navigation.navigate('Jellyriddlecreaturefd');
                }}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#B7F231', '#12DAFF']}
                  style={jellygame.feedBtn}
                >
                  <Text style={jellygame.feedTxt}>FEED NIBBO</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} onPress={shrJllRs}>
                <LinearGradient
                  colors={['#F231AB', '#7B0093']}
                  style={jellygame.shareBtn}
                >
                  <Text style={jellygame.shareBtnTxt}>SHARE</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{ alignSelf: 'center', marginTop: 10 }}
              onPress={() => {
                navigation.popToTop();
                setGameOver(false);
              }}
              activeOpacity={0.6}
            >
              <Image source={require('../../assets/images/jellyHomel.png')} />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </Jellyriddlecreaturebckgrnd>
  );
};

export default Jellyriddlecreaturegm;
