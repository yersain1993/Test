import type { User } from "../domain/user";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | undefined>;
  create(user: User): Promise<void>;
}
