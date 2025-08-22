import React from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';

const Mascotte = ({ status }: { status: 'idle' | 'error' | 'success' | 'focused' }) => {
  const animationSource =
    status === 'error'
      ? require('../../../assets/mascotte_error.json')
      : status === 'success'
      ? require('../../../assets/mascotte_success.json')
      : status === 'focused'
      ? require('../../../assets/mascotte_idle.json')
      : require('../../../assets/mascotte_idle.json');

  return (
    <View style={styles.container}>
      <LottieView source={animationSource} autoPlay loop style={styles.anim} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  anim: {
    width: 120,
    height: 120,
  },
});

export default Mascotte;
