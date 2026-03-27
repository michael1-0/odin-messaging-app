declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      username: string;
      noteToAll: string;
      createdAt: Date;
    }
  }
}

export {};
