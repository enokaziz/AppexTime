import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';

interface LiveChatProps {
  onMessageSent: (message: string) => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ onMessageSent }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Simulate receiving messages from the server
    const interval = setInterval(() => {
      setMessages((prevMessages) => [...prevMessages, 'Support: Hello! How can I assist you?']);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages((prevMessages) => [...prevMessages, inputValue]);
      onMessageSent(inputValue);
      setInputValue('');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messageContainer}>
        {messages.map((message, index) => (
          <Text key={index} style={styles.message}>
            {message}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageContainer: {
    flex: 1,
    padding: 10,
  },
  message: {
    padding: 10,
    margin: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default LiveChat;
