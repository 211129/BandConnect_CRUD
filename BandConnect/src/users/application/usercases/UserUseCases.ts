import UserEntity from '../../domain/UserEntity';
import IUserRepositoryPort from '../ports/IUserRepositoryPort';

class UserUseCases {
  constructor(private readonly userRepository: IUserRepositoryPort) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async create(user: UserEntity): Promise<void> {
    await this.userRepository.create(user);
  }

  async findById(userId: number): Promise<UserEntity | null> {
    return this.userRepository.findById(userId);
  }

  async update(user: UserEntity): Promise<void> {
    await this.userRepository.update(user);
  }

  async delete(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }
}

export default UserUseCases;
