import { Menu } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
// ..
export default function Topbar({ onMenuClick }) {
  const location = useLocation();

  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("/admin_img.png");
  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", user.id)
        .single();

      if (data) {
        setUserName(data.name || user.email);
        setAvatar(data.avatar_url || "/admin_img.png");
      } else {
        setUserName(user.email);
      }
    };

    fetchUser();
  }, []);

  const routeTitles = {
    "/": "Dashboard",
    "/blogs": "Blogs",
    "/add-blog": "Add Blog",
    "/edit-blog": "Edit Blog",
    "/properties": "Properties",
    "/add-property": "Add Property",
    "/edit-property": "Edit Property",
    "/messages": "Messages",
    "/settings": "Settings",
  };


  const currentTitle = routeTitles[location.pathname] || "Dashboard";

  return (
    <header className="h-15 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 md:px-10">


      <div className="flex items-center gap-3">

        <button onClick={onMenuClick} className="md:hidden text-gray-700">
          <Menu size={22} />
        </button>

        <h2 className="font-bold text-lg text-[#1F2937]">{currentTitle}</h2>
      </div>


      <div className="flex items-center gap-3">

        <div className="h-10 w-px bg-[#E5E7EB] hidden md:block mr-4" />

        <div className="flex flex-col text-right">
          <span className="text-sm text-[#111827] font-medium">
            {userName}
          </span>
          <span className="text-[#6B7280] text-xs">Admin</span>
        </div>

        <img
          src={avatar}
          alt="user"
          className="w-9 h-9 rounded-full object-cover"
        />
      </div>
    </header>
  );
}
