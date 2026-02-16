import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';

const Jellyriddlecreatureswtc = ({ value, onChange }) => {
  const swtchAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(swtchAnim, {
      toValue: value ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = swtchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const backgroundSwitchColor = swtchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(100,116,139,0.4)', 'rgba(236,72,153,1)'],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onChange(!value)}>
      <Animated.View
        style={[
          styles.jellyswtchtrck,
          { backgroundColor: backgroundSwitchColor },
        ]}
      >
        <Animated.View
          style={[
            styles.jellyswtchthumb,
            {
              transform: [{ translateX }],
              borderColor: value
                ? 'rgba(236,72,153,1)'
                : 'rgba(100,116,139,0.5)',
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  jellyswtchtrck: {
    width: 48,
    height: 24,
    borderRadius: 999,
    padding: 2,
    justifyContent: 'center',
  },
  jellyswtchthumb: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Jellyriddlecreatureswtc;
