import Header from "@components/header";
import TweetItem from "@components/item";
import TextArea from "@components/textarea";
import { Comment, Tweet, User } from "@prisma/client";
import useMutation from "lib/client/useMutation";
import useUser from "lib/client/useUser";
import { cls, getTimeDifference } from "lib/client/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface CommentForm {
  comment: string;
}

export interface CommentWithUser extends Comment {
  user: User;
}

interface DetailedTweet extends Tweet {
  user: User;
  _count: {
    like: number;
    comment: number;
  };
  comment: CommentWithUser[];
}

interface TweetResponse {
  ok: boolean;
  tweet: DetailedTweet;
  isLiked: boolean;
}

interface PostCommentResponse {
  ok: boolean;
  comment: Comment;
}

export default function Detail() {
  const { user } = useUser();
  const router = useRouter();

  const { data: tweetData, mutate } = useSWR<TweetResponse>(
    router.query?.id ? `/api/tweets/${router.query.id}` : null
  );

  const [postComment, { data: commentData, loading }] =
    useMutation<PostCommentResponse>(`/api/tweets/${router.query.id}/comment`);

  const { register, handleSubmit, reset, watch } = useForm<CommentForm>();

  const [toggleLike, { data: likeData, loading: likeLoading }] = useMutation(
    `/api/tweets/${router.query.id}/like`
  );

  useEffect(() => {
    if (likeData && likeData?.ok) {
      mutate();
    }
  }, [likeData]);

  const onClickLike = () => {
    if (likeLoading) return;
    toggleLike({});
  };

  const watchComment = watch("comment");

  const onValid = (form: CommentForm) => {
    if (loading) return;
    postComment(form);
    reset();
  };

  const onBackClick = () => {
    router.replace("/");
  };

  useEffect(() => {
    if (commentData && commentData?.ok) mutate();
  }, [commentData]);

  const twitterLogoSrc =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png?20220821125553";

  return (
    <>
      <Header onClick={onBackClick} text="All Tweets" />
      <div className="max-h-[80vh] px-10 py-6 overflow-y-scroll">
        <div
          className={cls(
            "pb-8",
            tweetData?.tweet.comment && tweetData.tweet.comment.length > 0
              ? "border-b"
              : ""
          )}
        >
          <div className="flex justify-between px-4 mb-6">
            <div>
              <div className="font-extrabold text-2xl">Tweet by</div>
              <div className="text-xl">{tweetData?.tweet.user.name}</div>
            </div>
            <Image
              loader={() => twitterLogoSrc}
              src={twitterLogoSrc}
              width={50}
              height={50}
              objectFit="contain"
            />
          </div>
          <div className="px-4 mb-8">
            <p className="w-full min-h-[50px]">{tweetData?.tweet.content}</p>
            <div className="flex flex-1 content-between items-center">
              <div className="flex flex-1 space-x-2">
                <span className="flex items-center space-x-0.5">
                  <svg
                    className="w-5 h-5 inline-block fill-sky-50 stroke-gray-600"
                    data-darkreader-inline-stroke=""
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                    ></path>
                  </svg>
                  <span>{tweetData?.tweet._count.comment}</span>
                </span>
                <button
                  onClick={onClickLike}
                  className="flex flex-1 items-center space-x-0.5"
                >
                  <svg
                    className={cls(
                      "w-5 h-5 inline-block",
                      tweetData?.isLiked
                        ? "fill-red-600 stroke-red-600"
                        : "fill-red-100 stroke-red-300 hover:fill-red-500 hover:stroke-red-700"
                    )}
                    data-darkreader-inline-stroke=""
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    ></path>
                  </svg>
                  <span>{tweetData?.tweet._count.like}</span>
                </button>
              </div>
              <span className="text-gray-500 text-sm text-right">
                {tweetData?.tweet.createdAt &&
                  getTimeDifference(tweetData.tweet.createdAt)}
              </span>
            </div>
          </div>
          <TextArea
            onSubmit={handleSubmit(onValid)}
            register={register("comment", { required: true })}
            disabled={!watchComment}
            placeholder="Leave a comment"
          />
        </div>
        <div className="divide-y">
          {tweetData?.tweet.comment?.map((comment) => (
            <TweetItem
              id={comment.id}
              userId={comment.userId}
              user={comment.user}
              content={comment.comment}
              createdAt={comment.createdAt}
              updatedAt={comment.updatedAt}
            />
          ))}
        </div>
      </div>
    </>
  );
}
