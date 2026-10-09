"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (err) => {
    const errorSources = Object.values(err.errors).map((val) => {
        return {
            path: val?.path,
            message: val?.message,
        };
    });
    const statusCode = 400;
    const detailedMsg = errorSources.map((es) => es.message).filter(Boolean).join(". ");
    return {
        statusCode,
        message: detailedMsg || 'Validation Error',
        errorSources,
    };
};
exports.default = handleValidationError;
//# sourceMappingURL=handleValidationError.js.map