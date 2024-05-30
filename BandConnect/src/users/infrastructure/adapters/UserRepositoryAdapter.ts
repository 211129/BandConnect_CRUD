import { axiosInstance } from './../api/axiosConfig';
import IUserRepositoryPort from '../../application/ports/IUserRepositoryPort';
import UserEntity from '../../domain/UserEntity';
import { isConnected } from '../utils/network';
import { getData, storeData } from '../utils/storage';
import { syncPendingOperations } from '../utils/sync';

class UserRepositoryAdapter implements IUserRepositoryPort {
  async findAll(): Promise<UserEntity[]> {
    const connectionStatus = await isConnected();

    if (connectionStatus) {
      await syncPendingOperations();
      const response = await axiosInstance.get('/users');
      const data = response.data;

      // Almacenar los datos en local
      await storeData('users', data);

      return data.map(
        (user: any) =>
          new UserEntity(user.id, user.name, user.email, user.password),
      );
    } else {
      const localData = await getData('users');
      if (localData && Array.isArray(localData)) {
        return localData.map((user: any) => {
          return new UserEntity(user.id, user.name, user.email, user.password);
        });
      }
      return [];
    }
  }

  async findById(id: number): Promise<UserEntity | null> {
    const connectionStatus = await isConnected();

    if (connectionStatus) {
      await syncPendingOperations();
      const response = await axiosInstance.get(`/users/${id}`);

      if (response.status === 404) {
        return null;
      }

      const user = response.data;

      // Almacenar los datos en local
      await storeData(`user_${id}`, user);

      return new UserEntity(user.id, user.name, user.email, user.password);
    } else {
      const localData = await getData(`user_${id}`);
      if (localData) {
        return new UserEntity(
          localData.id,
          localData.name,
          localData.email,
          localData.password,
        );
      }
      return null;
    }
  }

  async create(user: UserEntity): Promise<void> {
    const connectionStatus = await isConnected();

    if (connectionStatus) {
      await syncPendingOperations();

      const response = await axiosInstance.post('/users', {
        name: user.name,
        email: user.email,
        password: user.password,
      });

      // Almacenar los datos en local
      const users = await this.findAll();
      users.push(response.data);
      await storeData('users', users);
    } else {
      const pendingRequests = (await getData('pendingRequests')) || [];
      pendingRequests.push({
        type: 'create',
        user,
      });
      await storeData('pendingRequests', pendingRequests);
    }
  }

  async update(user: UserEntity): Promise<void> {
    const connectionStatus = await isConnected();

    if (connectionStatus) {
      await syncPendingOperations();

      await axiosInstance.put(`/users/${user.id}`, {
        name: user.name,
        email: user.email,
        password: user.password,
      });

      // Actualizar los datos en local
      const users = await this.findAll();
      const updatedUsers = users.map((u) =>
        u.id === user.id ? user : u
      );
      await storeData('users', updatedUsers);
    } else {
      const pendingRequests = (await getData('pendingRequests')) || [];
      pendingRequests.push({
        type: 'update',
        user,
      });
      await storeData('pendingRequests', pendingRequests);

      // Actualizar localmente
      const localData = await getData('users');
      if (localData && Array.isArray(localData)) {
        const updatedUsers = localData.map((u: any) =>
          u.id === user.id ? user : u
        );
        await storeData('users', updatedUsers);
      }
    }
  }

  async delete(id: number): Promise<void> {
    const connectionStatus = await isConnected();

    if (connectionStatus) {
      await syncPendingOperations();

      await axiosInstance.delete(`/users/${id}`);

      // Actualizar los datos en local
      const users = await this.findAll();
      const updatedUsers = users.filter((u) => u.id !== id);
      await storeData('users', updatedUsers);
    } else {
      const pendingRequests = (await getData('pendingRequests')) || [];
      pendingRequests.push({
        type: 'delete',
        id,
      });
      await storeData('pendingRequests', pendingRequests);

      // Actualizar localmente
      const localData = await getData('users');
      if (localData && Array.isArray(localData)) {
        const updatedUsers = localData.filter((u: any) => u.id !== id);
        await storeData('users', updatedUsers);
      }
    }
  }
}

export default UserRepositoryAdapter;
