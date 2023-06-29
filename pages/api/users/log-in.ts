import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "lib/server/withSession";
import withHandler from "lib/server/withHandler";
import db from "lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, email } = req.body;

  if (!phone && !email) return res.status(400).json({ ok: false });

  const user = await db.user.findUnique({
    where: {
      ...{ ...(phone && { phone }) },
      ...{ ...(email && { email }) },
    },
  });

  if (!user)
    return res.status(404).json({
      ok: false,
      message: "No user found",
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
