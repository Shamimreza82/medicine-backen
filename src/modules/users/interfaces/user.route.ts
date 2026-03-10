import { Router } from 'express';

import { auth } from '@/middlewares/auth';

import { createUser, deleteUser, getUserById, getUsers, updateUser } from './user.controller';

export const userRouter = Router();

userRouter.use(auth);

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
