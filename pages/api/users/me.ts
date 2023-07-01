import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "lib/server/withSession";
import withHandler from "lib/server/withHandler";
import db from "lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const profile = await db.user.findUnique({
    where: {
      id: req.session.user?.id,
    },
  });

  return res.status(200).json({
    ok: true,
    profile,
  });
}

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: true })
);
