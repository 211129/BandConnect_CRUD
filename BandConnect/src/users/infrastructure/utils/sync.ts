import {getData, storeData, removeData} from './storage';
import {isConnected} from './network';
import UserEntity from '../../domain/UserEntity';
import { axiosInstance } from '../api/axiosConfig';

export interface PendingOperation {
  type: 'create' | 'update' | 'delete';
  id?: number;
  user?: UserEntity;
}

export const syncPendingOperations = async (): Promise<void> => {
  const connectionStatus = await isConnected();

  if (connectionStatus) {
    const pendingOperations: PendingOperation[] =
      (await getData('pendingRequests')) || [];

    for (const operation of pendingOperations) {
      try {
        switch (operation.type) {
          case 'create':
            await axiosInstance.post('/users', {
              name: operation.user?.name,
              email: operation.user?.email,
              password: operation.user?.password,
            });
            break;
          case 'update':
            if (operation.id !== undefined && operation.user) {
              await axiosInstance.put(`/users/${operation.id}`, {
                name: operation.user.name,
                email: operation.user.email,
                password: operation.user.password,
              });
            }
            break;
          case 'delete':
            if (operation.id !== undefined) {
              await axiosInstance.delete(`/users/${operation.id}`);
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error syncing operation ${operation.type}`, error);
      }
    }

    // Clear pending operations after successful sync
    await removeData('pendingRequests');
  }
};
