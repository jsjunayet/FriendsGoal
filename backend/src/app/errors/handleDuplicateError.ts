/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  let field = "";
  let val = "";
  let displayMsg = "Duplicate entry already exists";

  if (err?.keyValue && typeof err.keyValue === "object") {
    const keys = Object.keys(err.keyValue);
    if (keys.length > 0 && keys[0]) {
      field = keys[0];
      val = String(err.keyValue[field]);
      if (field === "email") {
        displayMsg = `A member or user with email "${val}" already exists! Please use a unique email.`;
      } else if (field === "memberCode") {
        displayMsg = `Member ID "${val}" already exists! Please use a unique member ID.`;
      } else if (field === "mobileNo") {
        displayMsg = `Mobile number "${val}" already exists! Please use a unique number.`;
      } else {
        displayMsg = `${field.charAt(0).toUpperCase() + field.slice(1)} "${val}" already exists!`;
      }
    }
  }

  if (!field) {
    const match = err?.message?.match(/"([^"]*)"/);
    const keyMatch = err?.message?.match(/index:\s+([^\s]+)/);
    field = keyMatch ? keyMatch[1].replace(/_\d+$/, "") : "";
    const extractedMessage = match && match[1];
    displayMsg = extractedMessage
      ? `${extractedMessage} already exists`
      : field
      ? `Duplicate entry for ${field}`
      : "Duplicate entry already exists";
  }

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
