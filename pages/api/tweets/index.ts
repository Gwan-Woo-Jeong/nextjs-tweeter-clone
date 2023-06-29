import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "lib/server/withSession";
import withHandler from "lib/server/withHandler";
import db from "lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { content } = req.body;

    if (!content) return res.status(400).json({ ok: false });

    const tweet = await db.tweet.create({
      data: {
        content,
        user: {
          connect: {
            id: req.session.user?.id,
          },
        },
      },
    });

    return res.status(201).json({
      ok: true,
      tweet,
    });
  } else if (req.method === "GET") {
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler, isPrivate: true })
);
