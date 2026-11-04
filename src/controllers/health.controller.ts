import { Request, Response } from "express";

export const checkHealth = (req: Request, res: Response) => {
    res.status(200).json({
        status: "OK",
        message: "RentLanka Backend API is running successfully!",
        timestamp: new Date().toISOString()
    });
};

