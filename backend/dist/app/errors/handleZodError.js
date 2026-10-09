"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (err) => {
    const errorSources = err.issues.map((issue) => {
        const lastPath = issue?.path[issue.path.length - 1];
        return {
            path: String(lastPath ?? ""),
            message: issue.message,
        };
    });
    const statusCode = 400;
    const detailedMsg = errorSources.map((es) => es.message).filter(Boolean).join(". ");
    return {
        statusCode,
        message: detailedMsg || "Validation Error",
        errorSources,
    };
};
exports.default = handleZodError;
//# sourceMappingURL=handleZodError.js.map