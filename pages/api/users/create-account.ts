import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "lib/server/withHandler";
import db from "lib/db";
import bcrypt from "bcrypt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uuid, name, password } = req.body;

  if (!uuid && !name && !password) return res.status(400).json({ ok: false });

  const existingUser = await db.user.findFirst({
    where: { uuid },
  });

  if (existingUser)
    return res.status(409).json({ ok: false, message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      uuid,
      password: hashed,
      name,
    },
  });

  return res.json({
    ok: true,
  });
}

export default withHandler({ methods: ["POST"], handler });
