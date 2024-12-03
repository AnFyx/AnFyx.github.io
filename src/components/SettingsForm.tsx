'use client';

import { updateProfile } from "@/actions";
import { Profile } from "@prisma/client";
import { Button, Switch, TextArea, TextField } from "@radix-ui/themes";
import { IconCloudUpload } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SettingsForm({
  profile,
  role,
}: {
  profile: Profile | null;
  role: string;
}) {
  const router = useRouter();
  const fileInRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar || null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle file upload and avatar preview
  useEffect(() => {
    if (file) {
      const data = new FormData();
      data.set("file", file);
      fetch("/api/upload", {
        method: "POST",
        body: data,
      })
        .then((response) => response.json())
        .then((url) => setAvatarUrl(url))
        .catch((error) => console.error("Upload error:", error));
    }
  }, [file]);

  // Initialize dark mode state
  useEffect(() => {
    const theme = window.localStorage.getItem("theme") || "light";
    setIsDarkMode(theme === "dark");
  }, []);

  const handleThemeChange = (isDark: boolean) => {
    const html = document.querySelector("html");
    const theme = isDark ? "dark" : "light";
    if (html) {
      html.dataset.theme = theme;
    }
    localStorage.setItem("theme", theme);
    setIsDarkMode(isDark);
    window.location.reload();
  };

  return (
    <form
      action={async (data: FormData) => {
        await updateProfile(data, role);
        router.push("/profile");
        router.refresh();
      }}
    >
      {/* Avatar Section */}
      <input type="hidden" name="avatar" value={avatarUrl || ""} />
      <div className="flex gap-4 items-center">
        <div>
          <div className="bg-gray-400 size-24 rounded-full overflow-hidden aspect-square shadow-md shadow-gray-400">
            <img
              className="object-cover w-full h-full"
              src={avatarUrl || "./default_avatar.jpg"}
              alt="User Avatar"
            />
          </div>
        </div>
        <div>
          <input
            type="file"
            ref={fileInRef}
            className="hidden"
            onChange={(ev) => setFile(ev.target.files?.[0] || null)}
          />
          <Button
            type="button"
            variant="surface"
            onClick={() => fileInRef.current?.click()}
          >
            <IconCloudUpload />
            Change avatar
          </Button>
        </div>
      </div>

      {/* User Info Fields */}
      <p className="mt-2 font-bold">Username</p>
      <TextField.Root
        name="username"
        defaultValue={profile?.username || ""}
        placeholder="your_username"
        required
      />
      <p className="mt-2 font-bold">Name</p>
      <TextField.Root
        name="name"
        defaultValue={profile?.name || String(profile?.username)}
        placeholder="John Doe"
      />
      <p className="mt-2 font-bold">Subtitle</p>
      <TextField.Root
        name="subtitle"
        defaultValue={profile?.subtitle || ""}
        placeholder="Graphic Designer"
      />
      <p className="mt-2 font-bold">Bio</p>
      <TextArea name="bio" defaultValue={profile?.bio || ""} />

      {/* Dark Mode Toggle */}
      <label className="flex gap-2 items-center mt-4">
        <span>Dark mode</span>
        <Switch
          checked={isDarkMode}
          onCheckedChange={handleThemeChange}
        />
      </label>

      {/* Save Button */}
      <div className="mt-6 flex justify-center">
        <Button variant="solid">Save settings</Button>
      </div>
    </form>
  );
}
