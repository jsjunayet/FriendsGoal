import type { NextFunction, Request, Response } from 'express';
import type { TUserRole } from '../modules/User/user.interface';
declare const auth: (...requiredRoles: TUserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
export default auth;
//# sourceMappingURL=auth.d.ts.map