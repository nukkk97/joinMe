import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useTweet() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postTweet = async ({
    handle,
    content,
    startTime,
    endTime,
    replyToTweetId,
  }: {
    handle: string;
    content: string;
    replyToTweetId?: number;
    startTime?: string,
    endTime?: string,
  }) => {
    setLoading(true);

    const res = await fetch("/api/tweets", {
      method: "POST",
      body: JSON.stringify({
        handle,
        content,
        startTime,
        endTime,
        replyToTweetId,
      }),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    const ID = await res.json();
    //alert(ID.body[0].tweetID);
    // router.refresh() is a Next.js function that refreshes the page without
    // reloading the page. This is useful for when we want to update the UI
    // from server components.
    router.refresh();
    setLoading(false);

    return ID.body[0].tweetID;
  };

  return {
    postTweet,
    loading,
  };
}
