import type { IUserRepository } from "../interfaces/repositories/user-repository.interface";
import type { User } from "../interfaces/domain/user";

export class InMemoryUserRepository implements IUserRepository {
  private readonly users = new Map<string, User>();

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.get(email);
  }

  async create(user: User): Promise<void> {
    this.users.set(user.email, user);
  }
}
