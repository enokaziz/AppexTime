import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface KnowledgeBaseProps {
  faq: { question: string; answer: string }[];
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ faq }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Base de connaissances</Text>
      <FlatList
        data={faq}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        )}
      />
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
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  answer: {
    fontSize: 16,
    color: '#333',
  },
});

export default KnowledgeBase;
