import ProfileButton from "./ProfileButton";

export default function Header() {
  return (
    // aside is a semantic html tag for side content
    <aside className="flex h-screen flex-col justify-between px-6 py-6">
      
      <ProfileButton />
    </aside>
  );
}

