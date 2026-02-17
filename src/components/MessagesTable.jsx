import { HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

export default function MessagesTable() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestMessages();
  }, []);

  const fetchLatestMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <div className="w-10 h-10 border border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="text-lg font-semibold text-[#111827]">Recent Messages</h2>
        <button
          onClick={() => navigate("/messages")}
          className="cursor-pointer flex items-center gap-1 text-sm text-[#4B5563] font-medium"
        >
          View All <HiArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="hidden md:grid grid-cols-12 bg-[#F9FAFB] px-6 py-3 text-sm font-medium text-[#6B7280] border-[#E5E7EB] rounded-t-xl border">
        <div className="col-span-8">From</div>
        <div className="col-span-2 text-center">Date</div>
        <div className="col-span-2 text-center">Status</div>
      </div>

      {messages.map((msg) => (
        <div
          key={msg.id}
          className="px-6 py-4 border-b border-[#E5E7EB] last:border-b-0"
        >
          <div className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 md:gap-0">
            <div className="md:col-span-8 flex items-center gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {msg.first_name} {msg.last_name}
                </p>
                <p className="text-xs text-gray-400">{msg.email}</p>
              </div>
            </div>

            <div className="md:col-span-2 text-sm font-medium text-gray-900 text-center">
              {new Date(msg.created_at).toLocaleDateString()}
            </div>

            <div className="md:col-span-2 flex justify-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  msg.status === "Unread"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {msg.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
