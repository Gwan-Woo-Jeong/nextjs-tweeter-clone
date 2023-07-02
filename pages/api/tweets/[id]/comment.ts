import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "lib/server/withSession";
import withHandler from "lib/server/withHandler";
import db from "lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  const { comment } = req.body;

  if (!comment) return res.status(400).json({ ok: false });

  await db.comment.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      tweet: {
        connect: {
          id: +id.toString(),
        },
      },
      comment,
    },
  });

  return res.status(201).json({
    ok: true,
    comment,
  });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
