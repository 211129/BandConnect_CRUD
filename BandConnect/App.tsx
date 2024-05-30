import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import HomeScreen from './src/users/infrastructure/ui/screens/HomeScreen';
import CreateUserScreen from './src/users/infrastructure/ui/screens/CreateUserScreen';
import UpdateUserScreen from './src/users/infrastructure/ui/screens/UpdateUserScreen';
import {useEffect} from 'react';
import {syncPendingOperations} from './src/users/infrastructure/utils/sync';

type RootStackParamList = {
  Home: undefined;
  CreateUser: undefined;
  UpdateUser: {
    userId: number;
    oldName: string;
    oldEmail: string;
    oldPassword: string;
  };
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;
export type CreateUserScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CreateUser'
>;
export type UpdateUserScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'UpdateUser'
>;

const RootStack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  useEffect(() => {
    syncPendingOperations();
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Home">
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen
          name="CreateUser"
          component={CreateUserScreen}
          options={{title: 'Crear usuario'}}
        />
        <RootStack.Screen
          name="UpdateUser"
          component={UpdateUserScreen}
          options={{title: 'Actualizar usuario'}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
