import IUserRepositoryPort from '../application/ports/IUserRepositoryPort';
import UserUseCases from '../application/usercases/UserUseCases';
import UserRepositoryAdapter from './adapters/UserRepositoryAdapter';

const userRepositoryAdapter: IUserRepositoryPort = new UserRepositoryAdapter();
export const userUseCases = new UserUseCases(userRepositoryAdapter);
