import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import KnowledgeBase from '../components/KnowledgeBase';

const faq = [
  { question: 'Comment ajouter un employé ?', answer: 'Allez dans la section "Gestion des employés" et cliquez sur "Ajouter un employé".' },
  { question: 'Comment générer un badge ?', answer: 'Allez dans la section "Gestion des badges" et cliquez sur "Générer un badge".' },
  { question: 'Comment signaler un problème ?', answer: 'Allez dans la section "Support" et cliquez sur "Nouvelle demande de support".' },
  // Add more FAQ entries as needed
];

const KnowledgeBaseScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaq = faq.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Base de connaissances</Text>
      <TextInput
        style={styles.input}
        placeholder="Rechercher une question..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <KnowledgeBase faq={filteredFaq} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
});

export default KnowledgeBaseScreen;

