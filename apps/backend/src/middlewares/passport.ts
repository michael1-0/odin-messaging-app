import passport from "passport";
import { prisma } from "../db/prisma.ts";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import type { DoneCallback } from "passport";
import type { JwtPayload } from "jsonwebtoken";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "secret",
    },
    async (jwtPayload: JwtPayload, done: DoneCallback) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: Number(jwtPayload.sub) },
          omit: { password: true },
        });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false)
        }
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

export default passport;
