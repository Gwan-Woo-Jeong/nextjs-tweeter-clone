import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "lib/server/withSession";
import withHandler from "lib/server/withHandler";
import db from "lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const tweet = await db.tweet.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      comment: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          like: true,
          comment: true,
        },
      },
    },
  });

  const isLiked = Boolean(
    await db.like.findFirst({
      where: {
        userId: req.session.user?.id,
        tweetId: +id.toString(),
      },
    })
  );

  if (!tweet) return res.status(404).json({ ok: false, message: "Not found" });

  return res.status(200).json({
    ok: true,
    tweet,
    isLiked,
  });
}

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: true })
);
