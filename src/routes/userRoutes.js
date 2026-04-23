import express from "express";
import {
  UserRegister,
  UserLogin,
  getUserDetails,
  updateUserDetails,
  AddEducationDetails,
  GetEducationDetails,
  applyForJob,
  getUserApplications,
  getJobById,
  getAllJobs,
} from "../controller/userController.js";
import { authorize } from "../middleware/authorize.js";
import jwtVerifyMiddleware from "../middleware/jwtVerifyMiddleware.js";
const router = express.Router();
import upload from "../utils/multer.js";

router.post("/sign-up", UserRegister);
router.post("/login", UserLogin);
router.get(
  "/profile",
  jwtVerifyMiddleware,
  authorize(["user"]),
  
  getUserDetails,
);
router.patch(
  "/profile",
  jwtVerifyMiddleware,
  authorize(["user"]),
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  ]),
  updateUserDetails,
);
router.post(
  "/education",
  jwtVerifyMiddleware,
  authorize(["user"]),
  AddEducationDetails,
);
router.get(
  "/education",
  jwtVerifyMiddleware,
  authorize(["user"]),
  GetEducationDetails,
);
router.post('/apply/:jobId',jwtVerifyMiddleware,authorize(['user']),applyForJob);
router.get('/application',jwtVerifyMiddleware,authorize(['user']),getUserApplications);
router.get('/job/:jobId',jwtVerifyMiddleware,authorize(['user']),getJobById);
router.get('/jobs',jwtVerifyMiddleware,authorize(['user']),getAllJobs)

export default router;
