import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername } from "../../models/user.model.js";
import { JWT_SECRET } from "../../config/env.js";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "../../utils/handleResponse.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return handleErrorResponse(res, "Username and password are required.");
  }
  
  try {
    const user = await findUserByUsername(username);
    if (!user) return handleErrorResponse(res, "Invalid username or password.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return handleErrorResponse(res, "Invalid username or password.");

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role?.name,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    handleSuccessResponse(res, "Login successful.", {
      token,
    });
  } catch (error) {
    handleErrorResponse(res, "Login failed.");
  }
};

export const googleAuth = (req, res) => {
  if (req.user) {
    const token = jwt.sign(
      {
        id: req.user.id,
        username: req.user.username,
        name: req.user.displayName,
        role: "USER",
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    handleSuccessResponse(res, "Login successful.", {
      token,
    });
  } else {
    handleErrorResponse(res, "Login failed.");
  }
};

export const logout = async (req, res) => {
  handleSuccessResponse(res, "Logout successful.");
};
