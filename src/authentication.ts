import dotenv from "dotenv";
import type express from "express";
import { NextFunction, Response } from "express";

export interface RequestWithUser extends express.Request {
  user?: {
    _id: string;
    username: string;
  };
}

type SessionData = {
  user: {
    _id: string;
    username: string;
  };
};

dotenv.config();

const userServiceUrl = process.env.USER_SERVICE_URL ?? "http://localhost:8583";

export const findUserFromSession = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const sessionCookie = req.cookies["connect.sid"];

  if (!sessionCookie) {
    return next();
  }

  try {
    const response = await fetch(userServiceUrl + "/api/v1/session", {
      method: "GET",
      headers: {
        Cookie: `connect.sid=${sessionCookie}`,
      },
    });

    if (response.ok) {
      const data = (await response.json()) as SessionData;
      req.user = data.user;
    }
    return next();
  } catch (error) {
    return next();
  }
};
