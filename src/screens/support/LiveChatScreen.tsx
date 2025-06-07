import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LiveChat from '../../components/LiveChat';

const LiveChatScreen: React.FC = () => {
  const handleSendMessage = (message: string) => {
    // Handle sending the message to the server
    console.log('Message sent:', message);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Support en direct</Text>
      <LiveChat onMessageSent={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default LiveChatScreen;
