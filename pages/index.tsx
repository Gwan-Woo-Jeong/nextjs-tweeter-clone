import TweetItem from "@components/item";
import TextArea from "@components/textarea";
import { Like, Tweet, User } from "@prisma/client";
import useMutation from "lib/client/useMutation";
import useUser from "lib/client/useUser";
import { cls } from "lib/client/utils";
import Image from "next/image";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface TweetForm {
  content: string;
}

export interface TweetWithCounts extends Tweet {
  user: User;
  _count: {
    like: number;
    comment: number;
  };
  like: Like[];
}

export interface TweetsResponse {
  ok: boolean;
  tweets: TweetWithCounts[];
}

export interface PostTweetResponse {
  ok: boolean;
  tweet: Tweet;
}

export default function Home() {
  const { user } = useUser();
  const { data: tweetsData, mutate } = useSWR<TweetsResponse>("api/tweets");
  const [postTweet, { data: postData, loading }] =
    useMutation<PostTweetResponse>("api/tweets");

  const { register, handleSubmit, reset, watch } = useForm<TweetForm>();

  const watchContent = watch("content");

  const onValid = (form: TweetForm) => {
    if (loading) return;
    postTweet(form);
    reset();
  };

  useEffect(() => {
    if (postData && postData?.ok) mutate();
  }, [postData]);

  const twitterLogoSrc =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png?20220821125553";

  return (
    <div className="max-h-[80vh] px-14 py-10 overflow-y-scroll">
      <div className={cls("pb-8", tweetsData?.tweets ? "border-b" : "")}>
        <div className="flex justify-between px-4 mb-6">
          <div>
            <div className="font-extrabold text-2xl">Welcome</div>
            <div className="text-xl">{user?.name}</div>
          </div>
          <Image
            loader={() => twitterLogoSrc}
            src={twitterLogoSrc}
            width={50}
            height={50}
            objectFit="contain"
          />
        </div>
        <TextArea
          onSubmit={handleSubmit(onValid)}
          register={register("content", { required: true })}
          disabled={watchContent === ""}
          placeholder="What's happening?"
        />
      </div>
      <div className="divide-y">
        {tweetsData?.tweets?.map((tweet) => (
          <TweetItem
            {...tweet}
            mutate={mutate}
            isLiked={tweet.like.some((e) => e.userId === user?.id)}
          />
        ))}
      </div>
    </div>
  );
}
