import React from 'react';
import { ImageBackground, ScrollView } from 'react-native';
import { useBackground } from '../[Jellyriddlecreaturestr]/jellyriddlecreaturecntxt';

const Jellyriddlecreaturebckgrnd = ({ children }) => {
  const { bg } = useBackground();

  return (
    <ImageBackground source={bg} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </ImageBackground>
  );
};

export default Jellyriddlecreaturebckgrnd;
