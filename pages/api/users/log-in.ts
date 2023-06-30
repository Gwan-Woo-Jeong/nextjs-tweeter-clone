import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "lib/server/withSession";
import withHandler from "lib/server/withHandler";
import db from "lib/db";
import bcrypt from "bcrypt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uuid, password } = req.body;

  if (!uuid && !password) return res.status(400).json({ ok: false });

  const user = await db.user.findUnique({
    where: { uuid },
  });

  if (!user)
    return res.status(404).json({
      ok: false,
      message: "No user found",
    });

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid)
    return res.status(401).json({
      ok: false,
      message: "Wrong password",
    });

  req.session.user = {
    id: user.id,
  };

  await req.session.save();

  return res.status(200).json({
    ok: true,
  });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
