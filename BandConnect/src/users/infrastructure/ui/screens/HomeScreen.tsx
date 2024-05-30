import {useEffect, useState} from 'react';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import {userUseCases} from '../../dependecies';
import UserEntity from '../../../domain/UserEntity';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HomeScreenProps} from '../../../../../App';

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const [users, setUsers] = useState([] as UserEntity[]);
  useEffect(() => {
    const fetchData = async () => {
      const usersResposne = await userUseCases.findAll();
      setUsers(usersResposne);
    };

    fetchData();
  }, [users]);

  const handleEdit = (userId: number) => {
    const userData = users.find(user => user.id === userId);
    if (userData) {
      navigation.navigate('UpdateUser', {
        userId: userData.id,
        oldName: userData.name,
        oldEmail: userData.email,
        oldPassword: userData.password,
      });
    }

    return;
  };

  const handleDelete = async (userId: number) => {
    await userUseCases.delete(userId);

    const usersResponse = await userUseCases.findAll();
    setUsers(usersResponse);
  };

  const handleCreate = () => {
    navigation.navigate('CreateUser');
  };

  const renderItem = ({item}: {item: UserEntity}) => (
    <SafeAreaView style={styles.itemContainer}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.nameText}>Name: {item.name}</Text>
        <Text style={styles.emailText}>Email: {item.email}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Editar" onPress={() => handleEdit(item.id)} />
        <Button title="Eliminar" onPress={() => handleDelete(item.id)} />
      </View>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Directorio de usuarios</Text>
      <Button title="Crear Usuario" onPress={handleCreate} />
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  userInfoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default HomeScreen;
