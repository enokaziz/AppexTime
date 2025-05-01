import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

interface AnimationConfig {
  duration?: number;
  delay?: number;
  useNativeDriver?: boolean;
}

export const useAnimatedValue = (initialValue: number = 0, config?: AnimationConfig) => {
  const animatedValue = useRef(new Animated.Value(initialValue)).current;

  useEffect(() => {
    const {
      duration = 800,
      delay = 0,
      useNativeDriver = true,
    } = config || {};

    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver,
    }).start();
  }, []);

  return animatedValue;
};

export default useAnimatedValue;
