import { sendError } from "../utils/errorHandler.js";

export const authorize = (allowedRoles) => {
  return (req, res, next) => {

    if (!req.user) {
      return sendError(res, 401, "Unauthorized", { reason: "Authentication required" });
    }

    const userRole = req.user.role;

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      return sendError(res, 403, "Forbidden", {
        reason: `Access restricted to: ${allowedRoles.join(", ")}`
      });
    }

  };
};