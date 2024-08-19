export const handleSuccessResponse = (
  res,
  message,
  data,
  statusCode = 200
) => {
  const response = {
    success: true,
    code: statusCode,
    message,
    data: data ?? undefined,
  };
  res.status(statusCode).json(response);
};

export const handleErrorResponse = (
  res,
  message,
  statusCode = 400
) => {
  const response = {
    success: false,
    code: statusCode,
    message,
  };
  res.status(statusCode).json(response);
};

export const handleUnauthorizedResponse = (
  res,
  message,
  statusCode = 401
) => {
  const response = {
    success: false,
    code: statusCode,
    message,
  };
  res.status(statusCode).json(response);
};

export const handleForbiddenResponse = (
  res,
  message,
  statusCode = 403
) => {
  const response = {
    success: false,
    code: statusCode,
    message,
  };
  res.status(statusCode).json(response);
};
