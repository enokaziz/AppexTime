import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getEmployeeHistory } from '../../services/employee';
import { EmployeeHistory } from '../../types/index';
import { RouteProp } from '@react-navigation/native';

type EmployeeHistoryScreenRouteProp = RouteProp<{ params: { employeeId: string } }, 'params'>;

const EmployeeHistoryScreen = () => {
  const route = useRoute<EmployeeHistoryScreenRouteProp>();
  const { employeeId } = route.params;
  const [history, setHistory] = useState<EmployeeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const listOpacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const fetchedHistory = await getEmployeeHistory(employeeId, 1);
        setHistory(fetchedHistory);
        Animated.timing(listOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error fetching history:', error);
        Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération de l\'historique.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [employeeId]);

  const loadMoreHistory = async () => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = page + 1;
      const moreHistory = await getEmployeeHistory(employeeId, nextPage);
      if (moreHistory.length > 0) {
        setHistory((prev) => [...prev, ...moreHistory]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more history:', error);
      Alert.alert('Erreur', 'Impossible de charger plus d\'historique.');
    } finally {
      setIsFetchingMore(false);
    }
  };

  const renderItem = ({ item }: { item: EmployeeHistory }) => (
    <View style={styles.item}>
      <Text style={styles.label}>Date: <Text style={styles.value}>{item.date}</Text></Text>
      <Text style={styles.label}>Action: <Text style={styles.value}>{item.action}</Text></Text>
      <Text style={styles.label}>Lieu: <Text style={styles.value}>{item.location}</Text></Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique de l'Employé</Text>
      <Animated.FlatList
        style={{ opacity: listOpacity }}
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMoreHistory}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#007AFF" /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  item: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  value: {
    fontWeight: 'normal',
    color: '#555',
  },
});

export default EmployeeHistoryScreen;