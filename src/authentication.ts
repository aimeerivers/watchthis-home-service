import axios from "axios";
import dotenv from "dotenv";
import type express from "express";
import { NextFunction, Response } from "express";

export interface RequestWithUser extends express.Request {
  user?: {
    _id: string;
    username: string;
  };
}

dotenv.config();

const userServiceUrl = process.env.USER_SERVICE_URL;

export const findUserFromSession = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const sessionCookie = req.cookies["connect.sid"];

  if (!sessionCookie) {
    return next();
  }

  try {
    const response = await axios.get(userServiceUrl + "/api/v1/session", {
      headers: {
        Cookie: `connect.sid=${sessionCookie}`,
      },
    });

    if (response.status === 200) {
      req.user = response.data.user;
    }
    return next();
  } catch (error) {
    return next();
  }
};
