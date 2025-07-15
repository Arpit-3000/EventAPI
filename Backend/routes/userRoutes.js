import express from 'express';
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  listUsers
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;