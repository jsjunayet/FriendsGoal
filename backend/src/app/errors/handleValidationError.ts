import mongoose from 'mongoose';
import type { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

  const statusCode = 400;
  const detailedMsg = errorSources.map((es) => es.message).filter(Boolean).join(". ");

  return {
    statusCode,
    message: detailedMsg || 'Validation Error',
    errorSources,
  };
};

export default handleValidationError;
