import express from 'express'
import { AdminRegister,AdminLogin, createAJob, updateAJob, getAJob, RegisterACompany } from '../controller/adminController.js';
import jwtVerifyMiddleware from "../middleware/jwtVerifyMiddleware.js"
import upload from "../utils/multer.js"
import {authorize} from "../middleware/authorize.js"
const router=express.Router();


router.post('/sign-up',AdminRegister)
router.post('/login',AdminLogin)
router.post('/job/create',jwtVerifyMiddleware,authorize(['admin']),createAJob);
router.patch('/job/update/:id',jwtVerifyMiddleware,authorize(['admin']),updateAJob);
router.get('/job/:id',jwtVerifyMiddleware,authorize(['admin']),getAJob);
router.patch(
    '/org',
    jwtVerifyMiddleware,
    authorize(['admin']),
    upload.fields([
        {name:"companyImg",maxCount:1}
    ]),
    RegisterACompany
);
export default router;