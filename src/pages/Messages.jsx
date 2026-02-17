import { Mail } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { useEffect } from "react";



export default function Messages() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("contacts")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching messages:", error);
        } else {
            setMessages(data);
        }

        setLoading(false);
    };


    // ✅ Fixed search logic
    const filteredMessages = messages.filter((item) =>
        `${item.name} ${item.email} ${item.message}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredMessages.length / rowsPerPage) || 1;

    const paginatedMessages = filteredMessages.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    return (
        <DashboardLayout>
            <div className="px-4 py-4">
                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full sm:w-64 px-6 py-2 text-sm bg-[#F3F4F6] rounded-full outline-none"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-[#E5E7EB] shadow-sm rounded-xl">
                    <table className="min-w-[900px] w-full text-sm">
                        <thead className="bg-[#F9FAFB] text-[#6B7280]">
                            <tr>
                                <th className="text-left px-6 py-4 font-medium">Sender</th>
                                <th className="text-left px-6 py-4 font-medium">Message</th>
                                <th className="text-left px-6 py-4 font-medium">Date</th>
                                <th className="text-left px-6 py-4 font-medium">Status</th>
                                <th className="text-right px-6 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-16">
                                        <div className="flex justify-center items-center">
                                            <div className="w-10 h-10 border border-[#5856D6] border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedMessages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-400">
                                        No messages found
                                    </td>
                                </tr>
                            ) : (
                                paginatedMessages.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        {/* Sender */}
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {item.first_name} {item.last_name}
                                                </p>
                                                <p className="text-xs text-gray-400">{item.email}</p>
                                                <p className="text-xs text-gray-400">{item.phone}</p>
                                            </div>
                                        </td>

                                        {/* Message */}
                                        <td className="px-6 py-4 text-gray-600 max-w-md">
                                            <p className="line-clamp-2">{item.message}</p>
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {new Date(item.created_at).toLocaleString()}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 text-xs rounded-full font-medium bg-red-100 text-red-600">
                                               {item.status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <Mail
                                                onClick={() =>
                                                    navigate(`/message-detail/${item.id}`, {
                                                        state: { message: item },
                                                    })
                                                }
                                                className="w-4 h-4 text-gray-400 hover:text-indigo-600 cursor-pointer"
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-3 mt-4">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
                    >
                        Prev
                    </button>

                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
                    >
                        Next
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
