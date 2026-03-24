import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma.ts";
import { AppError } from "../errors/AppError.ts";

function getHealth(req: Request, res: Response) {
  res.json({ status: "ok" });
}

async function postSignup(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  try {
    const hash = await bcrypt.hash(body.password, 10);
    const newUser = await prisma.user.create({
      data: { email: body.email, password: hash },
    });

    const jwtPayload = {
      sub: newUser.id,
      iat: Math.floor(Date.now() / 1000),
    };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET || "secret", {
      expiresIn: "8h",
    });

    return res.json({ token: token, userId: newUser.id });
  } catch (error) {
    return next(error);
  }
}

async function postLogin(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      throw new AppError("No user found or incorrect password", 404);
    }

    const match = await bcrypt.compare(body.password, user.password);
    if (!match) {
      throw new AppError("No user found or incorrect password", 404);
    }

    const jwtPayload = {
      sub: user.id,
      iat: Math.floor(Date.now() / 1000),
    };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET || "secret", {
      expiresIn: "8h",
    });

    return res.json({ token: token, userId: user.id });
  } catch (error) {
    return next(error);
  }
}

export { getHealth, postSignup, postLogin };
