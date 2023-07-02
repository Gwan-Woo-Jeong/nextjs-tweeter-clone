import useMutation from "lib/client/useMutation";
import { cls, getTimeDifference } from "lib/client/utils";
import { useRouter } from "next/router";
import { TweetsResponse, TweetWithCounts } from "pages";
import React, { useEffect } from "react";
import { KeyedMutator } from "swr";

interface TweetProps extends TweetWithCounts {
  mutate?: KeyedMutator<TweetsResponse>;
  isLiked?: boolean;
}

export default function TweetItem({
  id,
  user,
  content,
  createdAt,
  _count,
  isLiked,
  mutate,
}: TweetProps) {
  const router = useRouter();
  const [toggleLike, { data, loading }] = useMutation(`api/tweets/${id}/like`);

  const onClickComments = () => {
    router.push(`tweet/${id}`);
  };

  const onClickLike = () => {
    if (loading) return;
    toggleLike({});
  };

  useEffect(() => {
    if (mutate && data && data?.ok) {
      mutate();
    }
  }, [data]);

  return (
    <div key={id} className="px-4 py-6 space-y-2 select-none">
      <div className="space-x-3">
        <span className="font-bold text-lg">{user.name}</span>
        <span className="text-gray-500 text-sm">
          {getTimeDifference(createdAt)}
        </span>
      </div>
      <p>{content}</p>
      <div className="flex space-x-2">
        {_count?.like !== undefined && (
          <button
            onClick={onClickComments}
            className="flex items-center space-x-0.5"
          >
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
            <span>{_count?.comment}</span>
          </button>
        )}
        {_count?.like !== undefined && (
          <button
            onClick={onClickLike}
            className="flex items-center space-x-0.5"
          >
            <svg
              className={cls(
                "w-5 h-5 inline-block",
                isLiked
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
            <span>{_count?.like}</span>
          </button>
        )}
      </div>
    </div>
  );
}
