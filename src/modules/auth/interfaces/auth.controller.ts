import type { RequestHandler } from 'express';

export const register: RequestHandler = (_req, res) => {
  res.status(501).json({ success: false, message: 'register is not implemented yet' });
};

export const login: RequestHandler = (_req, res) => {
  res.status(501).json({ success: false, message: 'login is not implemented yet' });
};

export const refreshToken: RequestHandler = (_req, res) => {
  res.status(501).json({ success: false, message: 'refresh token is not implemented yet' });
};

export const logout: RequestHandler = (_req, res) => {
  res.status(501).json({ success: false, message: 'logout is not implemented yet' });
};
