import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | any;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload | any;
  }
}

declare module 'express' {
  interface Request {
    user?: JwtPayload | any;
  }
}
