import express from 'express';
import { getFolders, createFolder, deleteFolder } from '../controllers/controller';

const router = express.Router();

router.get('/folders', getFolders);

router.post('/folders', createFolder);


router.delete('/folders/:id', deleteFolder);

export default router;