import asyncHandler from "../utils/asyncHandler.js";
import sendSuccess from "../utils/responseHandler.js";
import { sendError, sendValidationError } from "../utils/errorHandler.js";
import prisma from "../db/db.js";
import { signJwt } from "../utils/jwtSign.js";
import bcrypt from "bcrypt";

export const createRegisterHandler = ({
  allowedRoles,
  extraFields = [],
  extraValidation,
  modelName = "user",
}) =>
  asyncHandler(async (req, res, next) => {
    const errors = {};
    const { firstName, lastName, email, password, role, ...rest } = req.body;

    // Base validations
    if (!firstName) errors.firstName = "First name is required";
    if (!lastName) errors.lastName = "Last name is required";
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (!role) errors.role = "Role is required";

    // Extra field validations
    for (const field of extraFields) {
      if (!rest[field.key]) errors[field.key] = field.message;
    }

    if (role && !allowedRoles.includes(role.toLowerCase())) {
      errors.role = `Role must be one of: ${allowedRoles.join(", ")}`;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) errors.email = "Invalid email format";
    if (password && password.length < 8)
      errors.password = "Password must be at least 8 characters";

    if (extraValidation) extraValidation({ rest, errors });

    if (Object.keys(errors).length > 0) return sendValidationError(res, errors);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendError(res, 409, "User already exists with this email", {
        reason: "Database error",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Build extraData from extraFields
    const extraData = extraFields.reduce((acc, field) => {
      acc[field.key] = rest[field.key];
      return acc;
    }, {});

    // Admin flow — has organizationName, needs company creation
    if (extraData?.organizationName) {
      const result = await prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
          data: { companyName: extraData.organizationName },
        });

        // Remove organizationName so it doesn't spread into user data
        delete extraData.organizationName;

        const user = await tx.user.create({
          data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            companyId: company.id,
            ...extraData,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true,
            company: {
              select: { id: true, companyName: true },
            },
          },
        });

        return user;
      });

      const token = signJwt(
        { id: result.id, email: result.email, role: result.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return sendSuccess(res, 201, `${modelName} Created Successfully`, [
        {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          role: result.role,
          createdAt: result.createdAt,
          company: result.company,
          token,
        },
      ]);
    }

    // User flow — no company
    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword, role, ...extraData },
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
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return sendSuccess(res, 201, `${modelName} Created Successfully`, [
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        token,
      },
    ]);
  });



export const createLogin = ({allowedRoles,extraFields=[],modelName='user'})=>asyncHandler(async (req, res) => {
  const { email, password , ...rest} = req.body;
  const errors = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";

  for (const field of extraFields) {
      if (!rest[field.key]) errors[field.key] = field.message;
    }

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

  const role=user?.role;
  console.log(role);
  console.log(allowedRoles)
  if(!allowedRoles?.includes(user.role)){
    return sendError(res,400,`your role must be ${allowedRoles[0]}`);
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

