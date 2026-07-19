import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
declare const validateRequest: (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => void;
export default validateRequest;
//# sourceMappingURL=validateRequest.d.ts.map