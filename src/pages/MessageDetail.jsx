import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, MailOpen, Mail, Phone, Calendar } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { supabase } from "../config/supabaseClient";

export default function MessageDetail() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const message = state?.message;
    console.log("Message detail:", message);
    if (!message) {
        return (
            <DashboardLayout>
                <p className="text-center mt-20 text-gray-500">
                    Message not found
                </p>
            </DashboardLayout>
        );
    }
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this message?");
        if (!confirmDelete) return;

        const { error } = await supabase
            .from("contacts")
            .delete()
            .eq("id", message.id);

        if (error) {
            console.error(error);
            alert("Error deleting message");
        } else {
            alert("Message deleted successfully");
            navigate(-1);
        }
    };
    const handleMarkAsRead = async () => {
        const { error } = await supabase
            .from("contacts")
            .update({ status: "Read" })
            .eq("id", message.id);

        if (error) {
            console.error(error);
            alert("Error updating status");
        } else {
            alert("Marked as read");
            navigate(-1);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-6 max-w-4xl mx-auto">


                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <div className="flex flex-wrap gap-2">

                        <button
                            onClick={handleMarkAsRead}
                            className="flex font-medium items-center gap-2 px-4 py-2 border border-[#D1D5DB] text-[#374151] rounded-lg text-sm"
                        >
                            <MailOpen size={16} />
                            Mark as Read
                        </button>

                        <button
                            onClick={handleDelete}
                            className="flex font-medium items-center gap-2 px-4 py-2 bg-[#FF4141] text-white rounded-lg text-sm"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>

                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

                    {/* Sender Info */}
                    <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-xl p-4 sm:p-6">

                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#DBEAFE] flex items-center justify-center text-indigo-600 font-bold text-lg sm:text-xl">
                                {message.first_name?.charAt(0)}


                            </div>

                            <h3 className="mt-2 sm:mt-4 font-bold text-[#111827] text-sm sm:text-base">
                                {message.first_name} {message.last_name}
                            </h3>

                            <span className={`mt-1 sm:mt-2 px-3 py-1 text-xs rounded-full ${message.status === "Unread"
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {message.status}
                            </span>
                        </div>


                        <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 text-sm text-gray-600">


                            {/* Email */}
                            <div className="flex items-start gap-3">
                                <Mail className="w-4 h-4  text-[#6B7280] mt-1" />
                                <div className="flex flex-col gap-2">
                                    <span className="font-medium text-sm text-[#6B7280]">Email</span>
                                    <span className="text-[#2563EB] text-sm break-all">{message.email}</span>
                                </div>
                            </div>
                            {/* Phone */}
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-[#6B7280]" />
                                <div className="flex flex-col gap-2">     <span className="font-medium text-sm text-[#6B7280]">Phone</span>
                                    <span className="text-[#111827] text-sm">{message.phone}</span></div>

                            </div>

                            {/* Date */}
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4  text-[#6B7280]" />
                                <div className="flex flex-col gap-2"><span className="font-medium text-sm text-[#6B7280]">Date</span>
                                    <span className="text-[#111827] text-sm">{new Date(message.created_at).toLocaleString()}
                                    </span></div>

                            </div>

                        </div>

                    </div>

                    {/* Message Content */}
                    <div className="space-y-6">
                        <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-xl p-4 sm:p-6">

                            <h4 className="font-semibold text-sm mb-2 text-[#111827]">Message Content</h4>
                            <p className="bg-[#F9FAFB] px-4 py-4 sm:py-5 rounded-lg border border-[#F3F4F6] text-sm text-[#374151]">
                                {message.message}</p>
                        </div>

                        <div className="bg-white border border-[#E5E7EB] bg-[#F9FAFB] shadow-sm rounded-xl p-6">
                            <h4 className="font-semibold text-[#111827] mb-2 text-sm">Reply to {message.name}</h4>
                            <textarea
                                placeholder="Type your reply here..."
                                className="w-full h-28 sm:h-32 border border-[#E5E7EB] placeholder-[#CCCCCC] bg-[#F9FAFB] rounded-lg p-3 sm:p-4 text-sm outline-none"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button className="w-full sm:w-auto bg-[#5856D6] shadow-md text-white px-6 py-2 rounded-lg text-sm font-medium">
                                Send Reply
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
