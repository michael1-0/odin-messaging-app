import type { Request, Response } from "express";

function getHealth(req: Request, res: Response) {
  res.json({ status: "ok" });
}

export { getHealth };
