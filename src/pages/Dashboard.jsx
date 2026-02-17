import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import PropertiesTable from "../components/PropertiesTable";
import MessagesTable from "../components/MessagesTable";
import { Home, MessageSquare, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
// iii
export default function Dashboard() {
const [totalProperties, setTotalProperties] = useState(0);
const [totalBlogs, setTotalBlogs] = useState(0);
const [totalMessages, setTotalMessages] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchCounts = async () => {

      const { count: propertyCount } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true });


      const { count: blogCount } = await supabase
        .from("blogs")
        .select("*", { count: "exact", head: true });


      const { count: messageCount } = await supabase
        .from("contacts")
        .select("*", { count: "exact", head: true });

      setTotalProperties(propertyCount || 0);
      setTotalBlogs(blogCount || 0);
      setTotalMessages(messageCount || 0);
    };

    fetchCounts();
  }, []);

  return (
    <DashboardLayout>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 mb-6">
        <StatCard
          title="Total Properties"
          value={totalProperties}
          icon={<img src="/logo.svg" className="w-5 h-5 text-[#4B5563]" />}
          bg="bg-[#EFF6FF]"
        />
        <StatCard
          title="Total Messages"
          value={totalMessages}
          icon={<MessageSquare size={18} />}
          bg="bg-[#F0FDF4]"
        />
        <StatCard
          title="Total Blogs"
          value={totalBlogs}
          icon={<FileText size={18} />}
          bg="bg-[#FAF5FF]"
        />
      </div>


      <div className="flex flex-wrap gap-4 px-4 my-4">

        <button
          onClick={() => navigate("/add-property")}
          className="flex items-center gap-2 text-sm bg-[#5856D6] text-white px-4 py-1 rounded-lg font-medium hover:bg-[#4b45c9] transition"
        >
          <span className="text-xl">+</span> Add Property
        </button>


        <button
          onClick={() => navigate("/add-blog")}
          className="flex items-center gap-2 text-sm border border-gray-300 text-gray-700 px-4 py-1 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          <span className="text-xl">+</span> Add Blog Post
        </button>


        <button
          onClick={() => navigate("/about")}
          className="border border-gray-300 text-sm text-gray-700 px-4 py-1 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Edit About Us
        </button>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-4">
        <PropertiesTable />
        <MessagesTable />
      </div>

    </DashboardLayout>
  );
}
