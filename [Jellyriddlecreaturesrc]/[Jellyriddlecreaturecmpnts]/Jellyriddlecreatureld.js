import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';

const Jellyriddlecreatureld = () => {
  const jellyCreatureLoader = `
  <!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: transparent;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      font-family: monospace;
    }

    .wrapper {
      min-height: 3rem;
      min-width: 14rem;
      font-size: 2rem;
      position: relative;
      overflow: hidden;
      mask-image: linear-gradient(
        to right,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 1) 30%,
        rgba(0, 0, 0, 1) 70%,
        rgba(0, 0, 0, 0)
      );
    }

    .letter {
      width: 1ch;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 100%;
      animation: scroll 2.5s linear infinite, rainbow 2.5s linear infinite;
    }

    @keyframes scroll {
      to { left: -1ch; }
    }

    @keyframes rainbow {
      0%   { color: white; }
      10%  { color: #ff0000; }
      20%  { color: #ff8700; }
      30%  { color: #ffd300; }
      40%  { color: #deff0a; }
      50%  { color: #a1ff0a; }
      60%  { color: #0aff99; }
      70%  { color: #0aefff; }
      80%  { color: #147df5; }
      90%  { color: #580aff; }
      100% { color: #be0aff; }
    }

    .letter1  { animation-delay: -2.25s; }
    .letter2  { animation-delay: -2.0s; }
    .letter3  { animation-delay: -1.75s; }
    .letter4  { animation-delay: -1.5s; }
    .letter5  { animation-delay: -1.25s; }
    .letter6  { animation-delay: -1.0s; }
    .letter7  { animation-delay: -0.75s; }
    .letter8  { animation-delay: -0.5s; }
    .letter9  { animation-delay: -0.25s; }
    .letter10 { animation-delay: 0s; }
  </style>
</head>
<body>
  <div class="wrapper">
    <span class="letter letter1">L</span>
    <span class="letter letter2">o</span>
    <span class="letter letter3">a</span>
    <span class="letter letter4">d</span>
    <span class="letter letter5">i</span>
    <span class="letter letter6">n</span>
    <span class="letter letter7">g</span>
    <span class="letter letter8">.</span>
    <span class="letter letter9">.</span>
    <span class="letter letter10">.</span>
  </div>
</body>
</html>
`;

  return (
    <ImageBackground
      source={require('../../assets/backgrounds/jellyriddlecreatureldrbg.png')}
      style={styles.imagewrapper}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <WebView
          originWhitelist={['*']}
          source={{ html: jellyCreatureLoader }}
          style={styles.loaderwebview}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imagewrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderwebview: {
    width: 360,
    height: 120,
    backgroundColor: 'transparent',
  },
});

export default Jellyriddlecreatureld;
