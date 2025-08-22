import React, { useState } from 'react';
import { View, Text, Button, FlatList, RefreshControl } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAbsences } from '../../store/slices/absenceSlice';
import { absenceStyles } from '../../styles/absenceStyles';
import EmptyState from '../../components/EmptyState';

interface Props {
  navigation: NavigationProp<any>;
}

const AbsenceScreen: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const dispatch = useAppDispatch();
  const {
    list: absencesList,
    loading,
    error,
  } = useAppSelector((state) => state.absence);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchAbsences({ page: 1, refresh: true }));
      setPage(1);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = () => {
    if (!loading) {
      dispatch(fetchAbsences({ page: page + 1 }));
      setPage((prev) => prev + 1);
    }
  };

  return (
    <View style={absenceStyles.container}>
      <Text style={absenceStyles.title}>Liste des Absences</Text>
      <Button
        title="Gérer les Absences"
        onPress={() => navigation.navigate('AbsenceManagementScreen')}
      />

      <FlatList
        data={absencesList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={absenceStyles.absenceItem}>
            <Text>{`Du ${item.startDate.toLocaleDateString()} au ${item.endDate.toLocaleDateString()}: ${
              item.reason
            }`}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title="Aucune absence"
            message="Vous n'avez aucune absence enregistrée"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default AbsenceScreen;
