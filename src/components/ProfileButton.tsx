"use client";

import { useRouter } from "next/navigation";

import { MoreHorizontal } from "lucide-react";

import UserAvatar from "@/components/UserAvatar";
import useUserInfo from "@/hooks/useUserInfo";

export default function ProfileButton() {
  const { username, handle } = useUserInfo();
  const router = useRouter();

  return (
    <button
      className="flex items-center gap-2 rounded-full p-3 text-start transition-colors duration-300 hover:bg-gray-200 text-sm text-gray-500"
      // go to the home page without any query params to allow the user to change their username and handle
      // see src/components/NameDialog.tsx for more details
      onClick={() => router.push("/")}
    >
      <UserAvatar />
      <div className="w-40 max-lg:hidden">
        <p className="text-sm font-bold">{username ?? "..."}</p>
        <p className="text-sm text-gray-500">{`@${handle}`}</p>
      </div>
      <div style={{ whiteSpace: 'nowrap' }}>切換使用者 </div>
      <MoreHorizontal size={24} className="max-lg:hidden" />
    </button>

  );
}
