import { Pencil, Trash2, Plus } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 5;

  // Fetch blogs from Supabase
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true); // start loading
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching blogs:", error.message);
      } else {
        setBlogs(data);
      }
      setLoading(false); // stop loading
    };

    fetchBlogs();
  }, []);

  // Filtered and paginated blogs
  const filteredBlogs = blogs.filter((item) =>
    `${item.title} ${item.author || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Delete blog
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog post?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white px-4 rounded-xl">

        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-64 px-7 py-2 text-sm bg-[#F3F4F6] rounded-full outline-none"
          />

          <button
            onClick={() => navigate("/add-blog")}
            className="flex items-center gap-2 bg-[#5856D6] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md"
          >
            <Plus size={16} />
            Add Post
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl shadow-md">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="bg-[#F9FAFB] text-[#6B7280]">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Post</th>
                <th className="text-left px-6 py-3 font-medium">Date</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-center px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center">
                    {/* Spinner */}
                    <div className="w-10 h-10 mx-auto border border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : paginatedBlogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No blogs found.
                  </td>
                </tr>
              ) : (
                paginatedBlogs.map((item) => (
                  <tr key={item.id} className="border-b border-[#E5E7EB] last:border-b-0">
                    {/* Post */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.cover_image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300"}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.author || "By Admin"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-700">
                      {item.created_at ? new Date(item.created_at).toISOString().slice(0, 10) : "-"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          item.status === "Published" ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEF9C3] text-[#854D0E]"
                        }`}
                      >
                        {item.status || "Draft"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex gap-4 text-gray-400">
                        <Pencil
                          size={16}
                          className="cursor-pointer hover:text-indigo-600"
                          onClick={() => navigate(`/edit-blog/${item.id}`, { state: { blog: item } })}
                        />
                        <Trash2
                          size={16}
                          className="cursor-pointer hover:text-red-500"
                          onClick={() => handleDelete(item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-3 py-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}
