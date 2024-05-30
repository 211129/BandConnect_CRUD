import UserEntity from '../../domain/UserEntity';

interface IUserRepositoryPort {
  findAll(): Promise<UserEntity[]>;
  findById(id: number): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<void>;
  update(user: UserEntity): Promise<void>;
  delete(id: number): Promise<void>;
}

export default IUserRepositoryPort;
