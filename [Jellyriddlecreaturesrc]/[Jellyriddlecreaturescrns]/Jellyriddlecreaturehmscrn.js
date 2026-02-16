import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import { BlurView } from '@react-native-community/blur';

// local
import { useBackground } from '../[Jellyriddlecreaturestr]/jellyriddlecreaturecntxt';
import Jellyriddlecreaturebckgrnd from '../[Jellyriddlecreaturecmpnts]/Jellyriddlecreaturebckgrnd';
import { home } from '../jellyriddlecreaturestls';

//keys
const STORAGE_KEY = '@JELLY_FRUITS';

const STORAGE_DAILY_LAST_OPEN = '@DAILY_LAST_OPEN_DATE';

const STORAGE_DAILY_STREAK = '@DAILY_STREAK';

const EMPTY_FRUITS = {
  green: 0,
  purple: 0,
  grape: 0,
  red: 0,
};

const Jellyriddlecreaturehmscrn = () => {
  // states
  const navigation = useNavigation();
  const [fruitsCount, setFruitsCount] = useState(EMPTY_FRUITS);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(1);
  const nibboTranslateY = useState(new Animated.Value(0))[0];
  const nibboRotate = useState(new Animated.Value(0))[0];
  const [jellyTrackIndex, setJellyTrackIndex] = useState(0);
  const [sound, setSound] = useState(null);
  const jellyTracks = [
    'calm-acoustic-quiet-quest-251658.mp3',
    'calm-acoustic-quiet-quest-251658.mp3',
  ];
  const [homeSpeech, setHomeSpeech] = useState("Hi! I'm Nibbo!");

  // storage
  const { isEnabledBgMusic, setIsEnabledBgMusic, setIsEnabledNotifications } =
    useBackground();

  // effs
  useFocusEffect(
    useCallback(() => {
      checkDailyChallenge();

      console.log('checked');
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      playNibboIdleJerk();
      const intervalId = setInterval(() => {
        playNibboIdleJerk();
      }, 6000);

      return () => {
        clearInterval(intervalId);
      };
    }, []),
  );
  const playNibboIdleJerk = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(nibboTranslateY, {
          toValue: -20,
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
          toValue: -2,
          duration: 250,
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

  const nibboRotation = nibboRotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-3deg', '3deg'],
  });

  const checkDailyChallenge = async () => {
    try {
      const jllTd = new Date();
      jllTd.setHours(0, 0, 0, 0);

      const jllLstOpnd = await AsyncStorage.getItem(STORAGE_DAILY_LAST_OPEN);
      const jllStr = await AsyncStorage.getItem(STORAGE_DAILY_STREAK);

      let streak = jllStr ? Number(jllStr) : 1;

      if (!jllLstOpnd) {
        await AsyncStorage.multiSet([
          [STORAGE_DAILY_LAST_OPEN, jllTd.getTime().toString()],
          [STORAGE_DAILY_STREAK, '1'],
        ]);

        setDailyStreak(1);
        setShowDailyModal(true);
        return;
      }

      const jllLstOp = new Date(Number(jllLstOpnd));
      jllLstOp.setHours(0, 0, 0, 0);

      const jllDff =
        (jllTd.getTime() - jllLstOp.getTime()) / (1000 * 60 * 60 * 24);
      if (jllDff === 1) {
        streak += 1;
        setShowDailyModal(true);
      } else if (jllDff > 1) {
        streak = 1;
        setShowDailyModal(true);
      } else {
        setDailyStreak(streak);
        return;
      }

      await AsyncStorage.multiSet([
        [STORAGE_DAILY_LAST_OPEN, jllTd.getTime().toString()],
        [STORAGE_DAILY_STREAK, streak.toString()],
      ]);

      setDailyStreak(streak);
    } catch (err) {
      console.log('Daily challenge error =>', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isJllAct = true;

      const loadHungerState = async () => {
        try {
          const strd = await AsyncStorage.getItem('@NIBBO_HUNGRY_UNTIL');
          const hungUnt = strd ? Number(strd) : null;

          if (!isJllAct) return;

          if (!hungUnt || Date.now() > hungUnt) {
            setHomeSpeech("I'm hungry!");
          } else {
            setHomeSpeech("Hi! I'm Nibbo!");
          }
        } catch (e) {
          console.log('Hunger load error =>', e);
        }
      };

      loadHungerState();

      return () => {
        isJllAct = false;
      };
    }, []),
  );

  useEffect(() => {
    playJellyTrack(jellyTrackIndex);

    return () => {
      if (sound) {
        sound.stop(() => {
          sound.release();
        });
      }
    };
  }, [jellyTrackIndex]);

  const playJellyTrack = index => {
    if (sound) {
      sound.stop(() => {
        sound.release();
      });

      console.log('play music!');
    }

    const jellyTrackPath = jellyTracks[index];

    const newJellyGameSound = new Sound(
      jellyTrackPath,
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('Error', error);
          return;
        }

        newJellyGameSound.play(success => {
          if (success) {
            setJellyTrackIndex(
              prevIndex => (prevIndex + 1) % jellyTracks.length,
            );
          } else {
            console.log('Error ');
          }
        });
        setSound(newJellyGameSound);
      },
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadJellyBgMusic();
      loadJellyVibration();
    }, []),
  );

  useEffect(() => {
    const setVolumeGameMusic = async () => {
      try {
        const jellyMusicValue = await AsyncStorage.getItem('jellymusic');

        const isJellyMusicOn = JSON.parse(jellyMusicValue);
        setIsEnabledBgMusic(isJellyMusicOn);
        if (sound) {
          sound.setVolume(isJellyMusicOn ? 1 : 0);
        }
      } catch (error) {
        console.error('Error', error);
      }
    };

    setVolumeGameMusic();
  }, [sound]);

  useEffect(() => {
    if (sound) {
      sound.setVolume(isEnabledBgMusic ? 1 : 0);
    }
  }, [isEnabledBgMusic]);

  const loadJellyBgMusic = async () => {
    try {
      const jellyMusicValue = await AsyncStorage.getItem('jellymusic');
      const isJellyMusicOn = JSON.parse(jellyMusicValue);
      setIsEnabledBgMusic(isJellyMusicOn);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadJellyVibration = async () => {
    try {
      const jellyVibrationValue = await AsyncStorage.getItem(
        'jellynotification',
      );
      if (jellyVibrationValue !== null) {
        const isJellyVibrationOn = JSON.parse(jellyVibrationValue);
        setIsEnabledNotifications(isJellyVibrationOn);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isJllAct = true;

      const getSvdJllFrts = async () => {
        try {
          const strd = await AsyncStorage.getItem(STORAGE_KEY);

          const prsdJll = strd ? JSON.parse(strd) : EMPTY_FRUITS;

          if (isJllAct) {
            setFruitsCount(prsdJll);
          }
        } catch (err) {
          console.log('Load fruits error:', err);
        }
      };

      getSvdJllFrts();

      return () => {
        isJllAct = false;
      };
    }, []),
  );

  return (
    <Jellyriddlecreaturebckgrnd>
      <View style={home.jellycreaturecontainer}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 30,
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <View style={home.jellycreaturefruitscorecontainer}>
            <Text style={{ fontWeight: '700', fontSize: 24, color: '#7B1166' }}>
              You have:
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <View>
                <View style={home.fruitswrapper}>
                  <Image
                    source={require('../../assets/images/jellyfruit1.png')}
                    style={{ resizeMode: 'contain', width: 40, height: 40 }}
                  />
                  <Text style={home.jellycreaturefruittxt}>
                    {fruitsCount.green}
                  </Text>
                </View>
                <View style={home.fruitswrapper}>
                  <Image
                    source={require('../../assets/images/jellyfruit2.png')}
                    style={{ resizeMode: 'contain', width: 40, height: 40 }}
                  />
                  <Text style={home.jellycreaturefruittxt}>
                    {fruitsCount.purple}
                  </Text>
                </View>
              </View>
              <View>
                <View style={home.fruitswrapper}>
                  <Image
                    source={require('../../assets/images/jellyfruit3.png')}
                    style={{ resizeMode: 'contain', width: 40, height: 40 }}
                  />
                  <Text style={home.jellycreaturefruittxt}>
                    {fruitsCount.grape}
                  </Text>
                </View>
                <View style={home.fruitswrapper}>
                  <Image
                    source={require('../../assets/images/jellyfruit4.png')}
                    style={{ resizeMode: 'contain', width: 40, height: 40 }}
                  />
                  <Text style={home.jellycreaturefruittxt}>
                    {fruitsCount.red}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ gap: 16, marginBottom: 20 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Jellyriddlecreaturegm')}
            >
              <Image source={require('../../assets/images/jellygame.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Jellyriddlecreaturesttngs')}
            >
              <Image source={require('../../assets/images/jellysett.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Jellyriddlecreatureabt')}
            >
              <Image source={require('../../assets/images/jellyinf.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
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
          <ImageBackground
            source={require('../../assets/images/jellyCloud.png')}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
              width: 221,
              height: 175,
              position: 'absolute',
              top: -130,
              left: -50,
            }}
          >
            <Text style={home.homeBubbleText}>{homeSpeech}</Text>
          </ImageBackground>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 40,
            alignItems: 'center',
            gap: 20,
          }}
        >
          <ImageBackground
            source={require('../../assets/images/jellyLvlBg.png')}
            style={home.jellynumcont}
          >
            <Text style={home.jellynumconttxt}>{dailyStreak}</Text>
          </ImageBackground>

          <TouchableOpacity
            onPress={() => navigation.navigate('Jellyriddlecreaturefd')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#B7F231', '#12DAFF']}
              style={home.jellycreaturegradbtnfeed}
            >
              <Text style={home.jellycreaturegradbtnfeedtxt}>FEED NIBBO</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      {showDailyModal && (
        <View style={home.dailyOverlay}>
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
          <View style={home.dailyModal}>
            <TouchableOpacity
              style={home.dailyClose}
              activeOpacity={0.8}
              onPress={() => setShowDailyModal(false)}
            >
              <Image
                source={require('../../assets/images/jellyModalClose.png')}
              />
            </TouchableOpacity>

            <Text style={home.dailyTitle}>DAILY CHALLENGE</Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
              }}
            >
              <Image
                source={require('../../assets/images/jellyModalImg.png')}
              />
              <Text style={home.dailyText}>
                Don't forget to feed me every day so I can grow!
              </Text>
            </View>

            <View style={home.daysRow}>
              {[1, 2, 3, 4, 5].map(day => {
                const currentDay = ((dailyStreak - 1) % 5) + 1;

                return (
                  <View key={day}>
                    <Text
                      key={day}
                      style={[
                        home.dayItem,
                        day === currentDay && home.dayActive,
                        day === 5 && { color: '#BD0003' },
                      ]}
                    >
                      Day {day}
                    </Text>

                    {day === 5 && (
                      <Image
                        source={require('../../assets/images/jellyModalNibbo.png')}
                        style={{ marginTop: 3 }}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      )}
    </Jellyriddlecreaturebckgrnd>
  );
};

export default Jellyriddlecreaturehmscrn;
