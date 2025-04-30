import express from 'express';
import { generateCode } from '../controller/openaiController';

const router = express.Router();

router.post("/generate", generateCode);

export default router;
