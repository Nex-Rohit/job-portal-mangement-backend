import prisma from "../db/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendError, sendValidationError } from "../utils/errorHandler.js";
import sendSuccess from "../utils/responseHandler.js";
import { signJwt } from "../utils/jwtSign.js";
import bcrypt from "bcrypt";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";
import { createRegisterHandler, createLogin } from "./sharedContoller.js";

export const AdminRegister = createRegisterHandler({
  allowedRoles: ["admin"],
  modelName: "admin",
  extraFields: [
    { key: "organizationName", message: "Organization Name is required" },
  ],
});

export const AdminLogin = createLogin({
  allowedRoles: ["admin"],
});

export const RegisterACompany = asyncHandler(async (req, res) => {
  const adminId = req.user?.id;
  if (!adminId) {
    return sendError(res, 401, "Unauthorized access", {
      reason: "Authentication error",
    });
  }
  if (!req.user?.role === "admin") {
    return sendError(res, 403, "Forbidden access", {
      reason: "Authorization error",
    });
  }


  const admin = await prisma.user.findUnique({
    where: {
      id: adminId,
    },
    select: {
      companyId: true,
    },
  });

  const updateData = {};
  if (req.files?.companyImg) {
    // delete old photo from cloudinary if exists
    const existing = await prisma.company.findUnique({
      where: { id: admin.companyId },select:{
        companyName:true
      }
    });
    if (existing?.company_img) {
      await deleteFromCloudinary(existing.company_img, "image");
    }

    const result = await uploadToCloudinary(
      req.files.companyImg[0].path,
      "job-portal/company-photos",
      "image",
    );
    updateData.company_img = result.secure_url;
    updateData.companyName=existing.companyName;
  }

  if (Object.keys(updateData).length === 0) {
    return sendError(res, 400, "Nothing to Update", {
      reason: "Send company image for upload",
    });
  }

  const company = await prisma.company.upsert({
    where: {
      id: admin.companyId,
    },
    update: updateData,
    create: updateData,
    select: {
      id: true,
      companyName: true,
      company_img: true,
      jobsPosted: true,
      selectedCand: true,
      rejectedCand: true,
    },
  });

  const formattedComp = [company].flat().map((c) => ({
    companyName: c.companyName,
    company_img: c.company_img,
    jobsPosted: c.jobsPosted,
    rejectedCand: c.rejectedCand,
    selectedCand: c.selectedCand,
  }));

  return sendSuccess(
    res,
    201,
    "Company registered successfully",
    formattedComp,
  );
});

export const createAJob = asyncHandler(async (req, res) => {
  const { jobTitle, jobDesc, experience, salary, jobType, jobRole, location } =
    req.body;
  const errors = {};
  const adminId = req.user.id;
  const JOBTYPE = [
    "fulltime",
    "parttime",
    "remote",
    "hybrid",
    "internship",
    "contract",
  ];

  const JOBROLETYPE = [
    "softwere_engineer",
    "fullstack_developer",
    "backend_developer",
    "frontend_developer",
    "dotnet_developer",
  ];

  if (!adminId) {
    return sendError(res, 401, "Unauthorized access", {
      reason: "Authentication error",
    });
  }
  if (!req.user.role === "admin") {
    return sendError(res, 403, "Forbidden access", {
      reason: "Authorization error",
    });
  }

  if (!jobTitle) errors.jobTitle = "Job Title is required";
  if (!jobDesc) errors.jobDesc = "Job Description is required";
  if (!experience)
    errors.experience = "What is the experience for this job role ?";
  if (!salary) errors.salary = "Use a amount as 10L-20L per year or none";
  if (!jobType) errors.jobType = "What type of job is this ?";
  if (!jobRole) errors.jobRole = "What is the required role for this job ?";
  if (!location) errors.location = "Where is the location for the job ?";

  const SavableJobRole=jobRole?.split(" ").join("_");
//   console.log(SavableJobRole);
  if(!JOBROLETYPE.includes(SavableJobRole))errors.jobRole="Job role must be one of the listed";
  if(!JOBTYPE.includes(jobType))errors.jobType="Job type must be one of the listed"




  if (Object.keys(errors).length > 0) {
    return sendValidationError(res, errors);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: adminId,
    },
    select: {
      companyId: true,
    },
  });

  if (!user) {
    return sendError(res, 400, "User does not exists", {
      reason: "Database error",
    });
  }

  const job = await prisma.job.create({
    data: {
      title: jobTitle,
      description: jobDesc,
      jobType: jobType,
      jobRole: SavableJobRole,
      location: location,
      salary: salary,
      experience: experience,
      adminId: adminId,
      companyId: user.companyId,
    },
  });

  if (!job) {
    return sendError(res, 500, "Unable to create a Job", {
      reason: "Database error",
    });
  }

  return sendSuccess(res, 201, "Job created Successfully");
});

export const getAJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id;

  if (!adminId) {
    return sendError(res, 401, "Unauthorized access", {
      reason: "Authentication error",
    });
  }
  if (!req.user.role === "admin") {
    return sendError(res, 403, "Forbidden access", {
      reason: "Authorization error",
    });
  }
  if (!id) {
    return (
      sendError(res, 403, "Job id is required"),
      {
        reason: "Invalid Id",
      }
    );
  }

  const job = await prisma.job.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      location: true,
      salary: true,
      experience: true,
      description: true,
      jobType: true,
      jobRole: true,
      company: {
        select: {
          id: true,
          companyName: true,
          company_img: true,
        },
      },
    },
  });

  if (!job) {
    return sendError(res, 404, "No job found associated with this id", {
      reason: "Database error",
    });
  }

  const formattedJob = [job].flat().map((j) => ({
    id: j.id,
    title: j.title,
    description: j.description,
    location: j.location,
    experience: j.experience,
    salary: j.salary,
    jobType: j.jobType,
    jobRole: j.jobRole,
    companyName: j.company.companyName,
    company_img: j.company.company_img,
  }));
  return sendSuccess(res, 201, `Job fetched with id: ${id} `, formattedJob);
});

export const updateAJob = asyncHandler(async (req, res) => {
  const { ...rest } = req.body;
});
