import React, {useEffect, useState} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';
import {userUseCases} from '../../dependecies';
import UserEntity from '../../../domain/UserEntity';
import {UpdateUserScreenProps} from '../../../../../App';

const UpdateUserScreen = ({navigation, route}: UpdateUserScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(route.params.oldName);
    setEmail(route.params.oldEmail);
    setPassword(route.params.oldPassword);
  }, [route.params.oldName, route.params.oldEmail, route.params.oldPassword]);

  const handleCreateUser = async () => {
    console.log('Creando usuario...');
    setIsLoading(true);
    console.log('Nombre:', name);
    console.log('Email:', email);
    console.log('Contraseña:', password);

    const userEntity = new UserEntity(
      route.params.userId,
      name,
      email,
      password,
    );
    await userUseCases.update(userEntity);

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
        title="Actualizar usuario"
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

export default UpdateUserScreen;
