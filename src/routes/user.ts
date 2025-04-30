import { Router } from 'express';
import { createUser, login} from '../controller/user';
import cors from 'cors';

const router: Router = Router();

router.use(cors());

// Use async handlers directly
router.post("/register", createUser);
router.post("/user/login", login);

export default router;
