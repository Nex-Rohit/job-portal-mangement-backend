import asyncHandler from "../utils/asyncHandler.js";
import { sendError, sendValidationError } from "../utils/errorHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendSuccess from "../utils/responseHandler.js";
import prisma from "../db/db.js";
import { signJwt } from "../utils/jwtSign.js";
// import {uploadToCloudinary, deleteFromCloudinary} from "../utils/cloudinaryUpload.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";

export const UserRegister = asyncHandler(async (req, res, next) => {
  const errors = {};
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName) errors.firstName = "First name is required";
  if (!lastName) errors.lastName = "Last name is required";
  if (!email) errors.email = "Email name is required";
  if (!password) errors.password = "password name is required";
  if (!role) errors.role = "Are you a Job seekar or Recruiter";

  if (role && !["user"].includes(role.toLowerCase())) {
    errors.role = "Role must be User";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  if (password && password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  if (Object.keys(errors).length > 0) {
    return sendValidationError(res, errors);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return sendError(res, 409, "User already exists with this email", {
      reason: "Database error",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  //   create user

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const token = signJwt(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  const newUser = {
    user,
    token: token,
  };

  const formatedUser = [newUser].flat().map((detail) => ({
    id: detail.user.id,
    firstName: detail.user.firstName,
    lastName: detail.user.lastName,
    email: detail.user.email,
    role: detail.user.role,
    createdAt: detail.user.createdAt,
    token: detail.token,
  }));

  return sendSuccess(res, 201, "User Created Successfully", formatedUser);
});

export const UserLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const errors = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";

  if (Object.keys(errors).length > 0) {
    return sendValidationError(res, errors);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return sendError(res, 404, "User not found with this email", {
      reason: "Database error",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return sendError(res, 401, "Invalid password", {
      reason: "Authentication error",
    });
  }

  const token = signJwt(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  const newUser = {
    user,
    token: token,
  };
  const formatedUser = [newUser].flat().map((detail) => ({
    id: detail.user.id,
    firstName: detail.user.firstName,
    lastName: detail.user.lastName,
    email: detail.user.email,
    role: detail.user.role,
    createdAt: detail.user.createdAt,
    token: detail.token,
  }));

  return sendSuccess(res, 200, "Login successful", formatedUser[0]);
});

export const AddEducationDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const errors = {};
  if (!userId) {
    return sendError(res, 401, "Unauthorized access", {
      reason: "Authentication error",
    });
  }
  if (!req.user.role === "user") {
    return sendError(res, 403, "Forbidden access", {
      reason: "Authorization error",
    });
  }

  const {
    graduationClg,
    graduationPerc,
    postGradClg,
    postGradPerc,
    intermediateSchool,
    intermediatePerc,
  } = req.body;

  const educationData = {
    graduationClg,
    graduationPerc,
    postGradClg,
    postGradPerc,
    intermediateSchool,
    intermediatePerc,
  };
  const education = await prisma.education.upsert({
    where: { userId },
    update: { ...educationData },
    create: {
      ...educationData,
      userId,
      user: { connect: { id: userId } },
    },
    select: {
      id: true,
      graduationClg: true,
      graduationPerc: true,
      postGradClg: true,
      postGradPerc: true,
      intermediateSchool: true,
      intermediatePerc: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
    },
  });

  const formatedEducationDetails = [education].flat().map((detail) => ({
    graduationClg: detail.graduationClg,
    graduationPerc: detail.graduationPerc,
    postGradClg: detail.postGradClg,
    postGradPerc: detail.postGradPerc,
    intermediateSchool: detail.intermediateSchool,
    intermediatePerc: detail.intermediatePerc,
    createdAt: detail.createdAt,
    firstName: detail.user.firstName,
    lastName: detail.user.lastName,
    email: detail.user.email,
  }));

  return sendSuccess(
    res,
    201,
    "Education details added successfully",
    formatedEducationDetails,
  );
});

export const GetEducationDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return sendError(res, 401, "Unauthorized access", {
      reason: "Authentication error",
    });
  }
  if (!req.user.role === "user") {
    return sendError(res, 403, "Forbidden access", {
      reason: "Authorization error",
    });
  }
  const educationDetails = await prisma.education.findMany({
    where: {
      user: { id: userId },
    },
    select: {
      id: true,
      graduationClg: true,
      graduationPerc: true,
      postGradClg: true,
      postGradPerc: true,
      intermediateSchool: true,
      intermediatePerc: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
    },
  });

  const formatedEducationDetails = [educationDetails].flat().map((detail) => ({
    graduationClg: detail.graduationClg,
    graduationPerc: detail.graduationPerc,
    postGradClg: detail.postGradClg,
    postGradPerc: detail.postGradPerc,
    intermediateSchool: detail.intermediateSchool,
    intermediatePerc: detail.intermediatePerc,
    createdAt: detail.createdAt,
    firstName: detail.user.firstName,
    lastName: detail.user.lastName,
    email: detail.user.email,
  }));

  return sendSuccess(
    res,
    200,
    "Education details retrieved successfully",
    formatedEducationDetails,
  );
});

export const updateUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // they are updated internally when user applies/gets selected/rejected
  const RESTRICTED_FIELDS = ["appliedCount", "selectedCount", "rejectedCount"];

  const updateData = {};

  if (req.files?.profilePhoto) {
    // delete old photo from cloudinary if exists
    const existing = await prisma.userDetails.findUnique({ where: { userId } });
    if (existing?.profilePhotoPublicId) {
      await deleteFromCloudinary(existing.profilePhotoPublicId, "image");
    }

    const result = await uploadToCloudinary(
      req.files.profilePhoto[0].path,
      "job-portal/profile-photos",
      "image",
    );
    updateData.profilePhoto = result.secure_url;
    updateData.profilePhotoPublicId = result.public_id; // ✅ save public_id
  }

  if (req.files?.resume) {
    // delete old resume from cloudinary if exists
    const existing = await prisma.userDetails.findUnique({ where: { userId } });
    if (existing?.resumePublicId) {
      await deleteFromCloudinary(existing.resumePublicId, "raw");
    }

    const result = await uploadToCloudinary(
      req.files.resume[0].path,
      "job-portal/resumes",
      "raw",
    );
    updateData.resumeLink = result.secure_url;
    updateData.resumePublicId = result.public_id;
  }

  // ── check nothing to update ───────────────────────────────
  if (Object.keys(updateData).length === 0) {
    return sendError(res, 400, "Nothing to update", {
      reason: "Send profilePhoto or resume file",
    });
  }

  // ── upsert ────────────────────────────────────────────────
  const userDetails = await prisma.userDetails.upsert({
    where: { userId },
    update: updateData,
    create: { userId, ...updateData },
    select: {
      id: true,
      profilePhoto: true,
      resumeLink: true,
      appliedCount: true,
      selectedCount: true,
      rejectedCount: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  const formatedUserDetails = [userDetails].flat().map((detail) => ({
    profilePhoto: detail.profilePhoto,
    resumeLink: detail.resumeLink,
    appliedCount: detail.appliedCount,
    selectedCount: detail.selectedCount,
    rejectedCount: detail.rejectedCount,
    createdAt: detail.createdAt,
    firstName: detail.user.firstName,
    lastName: detail.user.lastName,
    email: detail.user.email,
  }));

  return sendSuccess(
    res,
    200,
    "Profile updated successfully",
    formatedUserDetails,
  );
});

export const getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return sendError(res, 401, "Unauthorized access", {
      reason: "Authentication error",
    });
  }
  if (!req.user.role === "user") {
    return sendError(res, 403, "Forbidden access", {
      reason: "Authorization error",
    });
  }
  const userDetails = await prisma.userDetails.findUnique({
    where: { userId },
    select: {
      id: true,
      profilePhoto: true,
      resumeLink: true,
      appliedCount: true,
      selectedCount: true,
      rejectedCount: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
  if (!userDetails) {
    return sendError(res, 404, "User details not found", {
      reason: "Database error",
    });
  }

  const formatedUserDetails = [userDetails].flat().map((detail) => ({
    profilePhoto: detail.profilePhoto,
    resumeLink: detail.resumeLink,
    appliedCount: detail.appliedCount,
    selectedCount: detail.selectedCount,
    rejectedCount: detail.rejectedCount,
    createdAt: detail.createdAt,
    firstName: detail.user.firstName,
    lastName: detail.user.lastName,
    email: detail.user.email,
  }));
  return sendSuccess(
    res,
    200,
    "User details retrieved successfully",
    formatedUserDetails,
  );
});

export const logoutUser = asyncHandler(async (req, res) => {
  // For JWT, logout is typically handled on the client side by deleting the token.
  // Optionally, you can implement token blacklisting on the server side if needed.
  return sendSuccess(res, 200, "Logout successful");
});

export const applyForJob = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const jobId = req.params.jobId;

  if (!req.user || req.user.role !== "user") {
    return sendError(res, 403, "Forbidden access", {
      reason: "Authorization error",
    });
  }

  if (!jobId) {
    return sendError(res, 400, "Job ID is required", {
      reason: "Validation error",
    });
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });
  if (!job) {
    return sendError(res, 404, "Job not found", {
      reason: "Database error",
    });
  }

  const user = await prisma.userDetails.findUnique({
    where: { userId },
  });

  if (!user) {
    return sendError(res, 404, "User details not found", {
      reason: "Database error",
    });
  }
  user.appliedCount += 1;
  await prisma.userDetails.update({
    where: { userId },
    data: { appliedCount: user.appliedCount },
  });
  const application = await prisma.application.create({
    data: {
      user: { connect: { id: userId } },
      job: { connect: { id: jobId } },
      status: "pending",
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      job: {
        select: {
          title: true,
          description: true,
          location: true,
          salary: true,
          jobRole: true,
          jobType: true,
        },
      },
    },
  });
  const formatedApplication = application.map((app) => ({
    applicationId: app.id,
    status: app.status,
    appliedAt: app.createdAt,
    jobTitle: app.job.title,
    jobDescription: app.job.description,
    jobLocation: app.job.location,
    jobSalary: app.job.salary,
    jobRole: app.job.jobRole,
    jobType: app.job.jobType,
  }));
  return sendSuccess(
    res,
    200,
    "Applied for job successfully",
    formatedApplication,
  );
});

export const getUserApplications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!req.user || req.user.role !== "user") {
    return sendError(res, 403, "Forbidden access", {
      reason: "Authorization error",
    });
  }

  const applications = await prisma.application.findMany({
    where: { userId },
    select: {
      id: true,
      status: true,
      createdAt: true,
      job: {
        select: {
          title: true,
          jobType: true,
          jobRole: true,
          experience: true,
          salary: true,
          location: true,
          company: {
            select: {
              companyName: true,
              company_img: true,
            },
          },
        },
      },
    },
  });
  if (!applications) {
    return sendError(res, 404, "No applications found for this user", {
      reason: "Database error",
    });
  }
  const formattedApplications = [applications].flat().map((app) => ({
    applicationId: app.id,
    status: app.status,
    appliedAt: app.createdAt,
    jobTitle: app.job.title,
    jobType: app.job.jobType,
    jobRole: app.job.jobRole,
    experience: app.job.experience,
    salary: app.job.salary,
    location: app.job.location,
    companyName: app.job.company.companyName,
    companyImage: app.job.company.company_img,
  }));

  return sendSuccess(
    res,
    200,
    "User applications retrieved successfully",
    formattedApplications,
  );
});

export const getJobById = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;
  const userId = req.user.id;

  if (!req.user || req.user.role !== "user") {
    return sendError(res, 403, "Forbidden access", {
      reason: "Authorization error",
    });
  }
  if (!jobId) {
    return sendError(res, 400, "Job ID is required", {
      reason: "Validation error",
    });
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      title: true,
      description: true,
      location: true,
      salary: true,
      jobRole: true,
      jobType: true,
      company: {
        select: {
          companyName: true,
          company_img: true,
        },
      },
    },
  });
  if (!job) {
    return sendError(res, 404, "Job not found", {
      reason: "Database error",
    });
  }

  const formattedJob = [job].flat().map((j) => ({
    title: j.title,
    description: j.description,
    location: j.location,
    salary: j.salary,
    jobRole: j.jobRole,
    jobType: j.jobType,
    companyName: j.company.companyName,
    companyImage: j.company.company_img,
  }));
  return sendSuccess(
    res,
    200,
    "Job details retrieved successfully",
    formattedJob,
  );
});

export const getAllJobs = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "user") {
    return sendError(res, 403, "Forbidden access", {
      reason: "Authorization error",
    });
  }

  const jobs = await prisma.job.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      salary: true,
      jobRole: true,
      jobType: true,
      company: {
        select: {
          companyName: true,
          company_img: true,
        },
      },
    },
  });

  if (!jobs) {
    return sendError(res, 404, "No jobs found", {
      reason: "Database error",
    });
  }
  const formattedJobs = [jobs].flat().map((job) => ({
    id: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    salary: job.salary,
    jobRole: job.jobRole,
    jobType: job.jobType,
    companyName: job.company.companyName,
    companyImage: job.company.company_img,
  }));
  return sendSuccess(
    res,
    200,
    "All jobs retrieved successfully",
    formattedJobs,
  );
});

