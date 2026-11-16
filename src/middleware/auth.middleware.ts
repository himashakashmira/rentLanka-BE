import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rentlanka_super_secret_jwt_key_123";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "customer" | "host" | "admin" | string;
    name: string;
    email: string;
  };
}

// Verify JWT token
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Access denied. Authentication token required." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
      name: string;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token. Please log in again." });
  }
};

// Require Admin role
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ success: false, message: "Forbidden: Admin privileges required" });
    return;
  }
  next();
};

// Require Host or Admin role
export const requireHostOrAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || (req.user.role !== "host" && req.user.role !== "admin")) {
    res.status(403).json({ success: false, message: "Forbidden: Host or Admin privileges required" });
    return;
  }
  next();
};
