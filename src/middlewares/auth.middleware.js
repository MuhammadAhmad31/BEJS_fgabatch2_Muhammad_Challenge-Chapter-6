import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import {
  handleUnauthorizedResponse,
  handleForbiddenResponse,
} from "../utils/handleResponse.js";

export const authenticate = (
  req,
  res,
  next
) => {
  const authorizationHeader = req.headers["authorization"];
  const token =
    typeof authorizationHeader === "string"
      ? authorizationHeader.split(" ")[1]
      : undefined;

  if (!token) {
    return handleUnauthorizedResponse(res, "Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    handleUnauthorizedResponse(res, "Invalid token.");
  }
};

export const authorize = (roles, matchUserId = false) => {
  return (req, res, next) => {
    if (!req.user) {
      return handleUnauthorizedResponse(
        res,
        "Access denied. Not authenticated."
      );
    }

    if (!roles.includes(req.user.role)) {
      return handleForbiddenResponse(
        res,
        "Access denied. You do not have permission to access this resource."
      );
    }

    if (matchUserId && req.user.id !== req.params.userId) {
      return handleForbiddenResponse(
        res,
        "Access denied. You do not have permission to access this profile."
      );
    }

    next();
  };
};
