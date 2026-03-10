import { sendError } from '@/shared/utils/sendError';

import type { RequestHandler } from 'express';

export const getUsers: RequestHandler = (_req, res) => {
  sendError(res, 501, {
    success: false,
    message: 'get users is not implemented yet',
  });
};

export const getUserById: RequestHandler = (_req, res) => {
  sendError(res, 501, {
    success: false,
    message: 'get user by id is not implemented yet',
  });
};

export const createUser: RequestHandler = (_req, res) => {
  sendError(res, 501, {
    success: false,
    message: 'create user is not implemented yet',
  });
};

export const updateUser: RequestHandler = (_req, res) => {
  sendError(res, 501, {
    success: false,
    message: 'update user is not implemented yet',
  });
};

export const deleteUser: RequestHandler = (_req, res) => {
  sendError(res, 501, {
    success: false,
    message: 'delete user is not implemented yet',
  });
};
