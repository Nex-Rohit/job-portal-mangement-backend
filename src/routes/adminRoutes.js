import express from 'express'
import { AdminRegister,AdminLogin, createAJob, updateAJob, getAJob, RegisterACompany, updateStatusOfApplication, getAllJobsPosted, getAllApplicationsByJobId, getCompanyDetails } from '../controller/adminController.js';
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
router.patch('/job/application/:id',jwtVerifyMiddleware,authorize(['admin']),updateStatusOfApplication);
router.get('/jobs',jwtVerifyMiddleware,authorize(['admin']),getAllJobsPosted);
router.get('/job/applications/all/:jobId',jwtVerifyMiddleware,authorize(['admin']),getAllApplicationsByJobId);
router.get('/org',jwtVerifyMiddleware,authorize(['admin']),getCompanyDetails);
export default router;