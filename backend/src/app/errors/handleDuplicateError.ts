/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);
  const keyMatch = err.message.match(/index:\s+([^\s]+)/);
  const field = keyMatch ? keyMatch[1].replace(/_\d+$/, "") : "";

  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1];
  const displayMsg = extractedMessage
    ? `${extractedMessage} already exists`
    : field
    ? `Duplicate entry for ${field}`
    : "Duplicate entry already exists";

  const errorSources: TErrorSources = [
    {
      path: field || "",
      message: displayMsg,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: displayMsg,
    errorSources,
  };
};

export default handleDuplicateError;
