import { Router } from 'express';

import { createUser, deleteUser, getUserById, getUsers, updateUser } from './user.controller';
import { authenticate } from '../../../middlewares/authenticate';


export const userRouter = Router();

userRouter.use(authenticate);

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
