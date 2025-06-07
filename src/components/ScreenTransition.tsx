import React from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface ScreenTransitionProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const ScreenTransition: React.FC<ScreenTransitionProps> = React.memo(
  ({ children, style }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(new Animated.Value(20)).current;

    React.useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, [fadeAnim, translateY]);

    return (
      <Animated.View
        style={[
          styles.container,
          style,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenTransition;
