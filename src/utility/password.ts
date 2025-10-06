const argon2 = require('argon2');

export class Password {
  static async generate(password: string): Promise<string> {
    return await argon2.hash(password);
  }
  static async compare(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }
}
