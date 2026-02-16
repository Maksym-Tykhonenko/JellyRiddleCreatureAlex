import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

// local
import Jellyriddlecreaturebckgrnd from '../[Jellyriddlecreaturecmpnts]/Jellyriddlecreaturebckgrnd';
import { about } from '../jellyriddlecreaturestls';

const Jellyriddlecreatureabt = () => {
  const navigation = useNavigation();

  const hndlShrAbtJlly = () => {
    Share.share({
      message: `Nibbo is your little fantasy friend who grows up with you. Every day he asks for a certain food, and you can collect it in a simple mini-game. One day is one level, and every five days without skipping, Nibbo moves to a new stage of growth and changes in appearance. There are no complicated rules in the application: you just log in every day, feed the hero and watch him gradually grow up. You can turn on a reminder so as not to forget about his meals. Everything works completely offline, without accounts and without ads - just you and your Nibbo.`,
    });
  };

  return (
    <Jellyriddlecreaturebckgrnd>
      <View style={about.container}>
        <View style={about.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/images/jellyHomeBtn.png')} />
          </TouchableOpacity>
        </View>

        <View style={about.aboutJellycnt}>
          <Text style={about.lblAbout}>ABOUT THE APP</Text>
          <Text style={about.sbtAbout}>
            Nibbo is your little fantasy friend who grows up with you. Every day
            he asks for a certain food, and you can collect it in a simple
            mini-game. One day is one level, and every five days without
            skipping, Nibbo moves to a new stage of growth and changes in
            appearance. There are no complicated rules in the application: you
            just log in every day, feed the hero and watch him gradually grow
            up. You can turn on a reminder so as not to forget about his meals.
            Everything works completely offline, without accounts and without
            ads - just you and your Nibbo.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginTop: 20,
            }}
          >
            {Platform.OS === 'ios' ? (
              <>
                <Image
                  source={require('../../assets/images/aboutjelllylogo.png')}
                />
                <Image source={require('../../assets/images/aboutjelly.png')} />
              </>
            ) : (
              <Image
                source={require('../../assets/images/icon.png')}
                style={{
                  width: 166,
                  height: 166,
                  borderRadius: 40,
                  alignSelf: 'center',
                }}
              />
            )}
          </View>
        </View>

        <TouchableOpacity onPress={hndlShrAbtJlly} activeOpacity={0.7}>
          <LinearGradient
            colors={['#F231AB', '#7B0093']}
            style={about.shareBtn}
          >
            <Text style={about.shareBtnTxt}>SHARE</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Jellyriddlecreaturebckgrnd>
  );
};

export default Jellyriddlecreatureabt;
