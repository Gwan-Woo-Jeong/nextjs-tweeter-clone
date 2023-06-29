import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "lib/server/withHandler";
import db from "lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, email, name } = req.body;

  if (!phone && !email) return res.status(400).json({ ok: false });

  const existingUser = await db.user.findFirst({
    where: {
      ...{ ...(phone && { phone }) },
      ...{ ...(email && { email }) },
    },
  });

  if (existingUser)
    return res.status(409).json({ ok: false, message: "User already exists" });

  await db.user.create({
    data: {
      ...{ ...(phone && { phone }) },
      ...{ ...(email && { email }) },
      name,
    },
  });

  return res.json({
    ok: true,
  });
}

export default withHandler({ methods: ["POST"], handler });
