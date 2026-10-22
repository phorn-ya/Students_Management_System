declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      username: string;
      email: string;
      role: string;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}
export {};

