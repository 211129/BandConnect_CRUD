import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {userUseCases} from '../../dependecies';
import UserEntity from '../../../domain/UserEntity';
import {CreateUserScreenProps} from '../../../../../App';
import { isConnected } from '../../utils/network';

const CreateUserScreen = ({navigation}: CreateUserScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async () => {
    const isConnection = await isConnected();
    console.log(isConnection);
    if (!isConnection) {
      Alert.alert("No se puede crear un usuario sin internet")
      return;
    }
    console.log('Creando usuario...');
    setIsLoading(true);
    console.log('Nombre:', name);
    console.log('Email:', email);
    console.log('Contraseña:', password);

    const userEntity = new UserEntity(0, name, email, password);
    await userUseCases.create(userEntity);

    navigation.navigate('Home');
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nombre" value={name} onChangeText={setName} />
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title="Crear usuario"
        onPress={handleCreateUser}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default CreateUserScreen;
