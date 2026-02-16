import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Jellyriddlecreatureonbrd = () => {
  const [jellyCreatureCurrent, setJellyCreatureCurrent] = useState(0);
  const navigation = useNavigation();

  const handleNxtJllStp = () => {
    if (jellyCreatureCurrent < 2) {
      setJellyCreatureCurrent(jellyCreatureCurrent + 1);
    } else {
      navigation.replace('Jellyriddlecreaturehmscrn');
    }
  };

  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={require('../../assets/backgrounds/jellyriddlecreatureonbg.png')}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
        >
          {jellyCreatureCurrent < 2 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Jellyriddlecreaturehmscrn')}
              style={{ position: 'absolute', top: 80, right: 30 }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 20 }}>
                SKIP
              </Text>
            </TouchableOpacity>
          )}

          {jellyCreatureCurrent === 0 && (
            <Image
              source={require('../../assets/images/jellyriddlecreatureon1.png')}
            />
          )}

          {jellyCreatureCurrent === 1 && (
            <View>
              <Image
                source={require('../../assets/images/jellyriddlecreatureon2.png')}
                style={{ left: -40 }}
              />
              <Image
                source={require('../../assets/images/jellyriddlecreatureon3.png')}
                style={{ left: 80 }}
              />
            </View>
          )}

          {jellyCreatureCurrent === 2 && (
            <View>
              <Image
                source={require('../../assets/images/jellyriddlecreatureon4.png')}
                style={{ left: -60, width: 244, height: 290, top: 20 }}
              />
              <Image
                source={require('../../assets/images/jellyriddlecreatureon5.png')}
                style={{ left: 60 }}
              />
            </View>
          )}

          <View
            style={{
              width: '80%',
              marginTop: 20,
              marginBottom: 20,
              backgroundColor: 'white',
              borderWidth: 5,
              borderColor: '#DF6BC9',
              borderRadius: 63,
              padding: 20,
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 40,
            }}
          >
            <Text
              style={{
                fontWeight: '700',
                fontSize: 24,
                color: '#7B1166',
                fontFamily: 'Nunito-Bold',
              }}
            >
              {jellyCreatureCurrent === 0 && 'Hi! I’m Nibbo!'}
              {jellyCreatureCurrent === 1 && 'What to do?'}
              {jellyCreatureCurrent === 2 && 'Growth and reminders'}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 10,
                fontSize: 16,
                color: '#7B1166',
                fontFamily: 'Nunito-Medium',
                paddingHorizontal: 10,
              }}
            >
              {jellyCreatureCurrent === 0 &&
                `Will you help me grow?
I just need to eat every day.`}
              {jellyCreatureCurrent === 1 &&
                `Every day I ask for a food.
Play the mini-game to collect it for me!`}
              {jellyCreatureCurrent === 2 &&
                `If you feed me for 5 days 
in a row — I’ll grow!
Turn on the reminder so you don’t forget.`}
            </Text>
          </View>

          <TouchableOpacity onPress={handleNxtJllStp}>
            <LinearGradient
              colors={['#B7F231', '#12DAFF']}
              style={{
                borderRadius: 135,
                width: 90,
                height: 90,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 45,
                borderWidth: 1,
                borderColor: '#7B1166',
              }}
            >
              <Image
                source={require('../../assets/images/jellyriddlecreaturenext.png')}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Jellyriddlecreatureonbrd;
