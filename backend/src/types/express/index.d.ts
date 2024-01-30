// types/express/index.d.ts
import 'express';
import { IUser } from '../../interfaces/IUser';
export {}

declare global {
  namespace Express {
    export interface Request {
        user?: IUser
      // extra variables you want to use in req object
    }
  }
}