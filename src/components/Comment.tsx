

import { Separator } from "@/components/ui/separator";
import { getAvatar } from "@/lib/utils";


type TweetProps = {
  username?: string;
  handle?: string;
  id: number;
  authorName: string;
  authorHandle: string;
  content: string;
  likes: number;
  createdAt: Date;
  liked?: boolean;
};

// note that the Tweet component is also a server component
// all client side things are abstracted away in other components
export default function Tweet({
  authorName,
  authorHandle,
  content,
}: TweetProps) {
  return (
    <>
        <div className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getAvatar(authorName)}
            alt="avatar"
            className="h-12 w-12 rounded-full"
          />
          <article className="flex grow flex-col break-all">
            <p className="font-bold">
              {authorName}
              <span className="ml-2 font-normal text-gray-400">
                @{authorHandle}
              </span>
              {/*<time className="ml-2 font-normal text-gray-400">
                <TimeText date={createdAt} format="h:mm A · D MMM YYYY" />
              </time>*/}
            </p>
            {/* `white-space: pre-wrap` tells html to render \n and \t chracters  */}
            <article className="mt-2 whitespace-pre-wrap">{content}</article>
            <div className="my-2 flex items-center justify-between gap-4 text-gray-400">
              {/*<button className="rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10 hover:text-brand">
                <MessageCircle size={20} className="-scale-x-100" />
              </button>
              <button className="rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10 hover:text-brand">
                <Repeat2 size={22} />
              </button>
              
              <button className="rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10 hover:text-brand">
                <Share size={18} />
            </button>*/}
            </div>
          </article>
        </div>
      <Separator />
    </>
  );
}
