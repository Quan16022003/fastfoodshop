import jwt from "jsonwebtoken";
import * as config from "../configs/auth.config.js";
import db from "../models/index.js";

const { user: User, role: Role } = db;

// Hàm helper để kiểm tra role
const checkUserRole = async (userId, roleName) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const roles = await Role.find({ _id: { $in: user.roles } });
    return roles.some(role => role.name === roleName);
  } catch (err) {
    throw err;
  }
};

const verifyToken = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, config.secret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const isAdmin = await checkUserRole(req.userId, "admin");
    if (!isAdmin) {
      return res.status(403).send({ message: "Require Admin Role!" });
    }
    next();
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const isModerator = async (req, res, next) => {
  try {
    const isMod = await checkUserRole(req.userId, "moderator");
    if (!isMod) {
      return res.status(403).send({ message: "Require Moderator Role!" });
    }
    next();
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

export const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};;