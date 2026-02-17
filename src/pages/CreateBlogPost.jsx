import { ArrowLeft, Upload, X } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useRef, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateBlogPost() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      if (data) {
        setUserName(data.name || user.email);

      } else {
        setUserName(user.email);
      }
    };

    fetchUser();
  }, []);
  console.log("Current user:", userName);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const removeImage = () => {
    setImage(null);
    fileInputRef.current.value = "";
  };

 const handlePublish = async () => {
  if (!title || !content) {
    toast.error("Title and content are required!");
    return;
  }

  setLoading(true);

  let imageUrl = null;

  // Upload image if selected
  if (image?.file) {
    const fileName = `${Date.now()}-${image.file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, image.file);

    if (uploadError) {
      toast.error("Image upload failed: " + uploadError.message);
      setLoading(false);
      return;
    }

    const { data } = supabase.storage
      .from("blog-images")
      .getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

  // Insert blog post into Supabase
  const { error } = await supabase.from("blogs").insert([
    {
      title,
      content,
      cover_image: imageUrl,
      author: userName,
    },
  ]);

  setLoading(false);

  if (error) {
    toast.error("Error creating blog post: " + error.message);
  } else {
    toast.success("Blog post created successfully!");
    navigate("/blogs");
  }
};

  return (
    <DashboardLayout>
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-2 mb-6" onClick={() => navigate("/blogs")}>
            <ArrowLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
            <h1 className="text-lg font-bold text-[#111827]">
              Create Blog Post
            </h1>
          </div>

          {/* Basic Information */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-[#111827] mb-4">
              Basic Information
            </h2>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-[#374151] mb-1">
                Post Title
              </label>
              <input
                type="text"
                placeholder="Enter blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#F2F2F2] text-sm outline-none placeholder-[#CCCCCC]"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">
                Content
              </label>
              <textarea
                rows={6}
                placeholder="Write your blog content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#F2F2F2] text-sm outline-none placeholder-[#CCCCCC] resize-none"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-[#111827] mb-4">
              Cover image
            </h2>

            {/* Hidden Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {!image ? (
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-[#D1D5DB] rounded-xl h-40 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition"
              >
                <Upload className="w-5 h-5 mb-2" />
                <span className="text-xs font-medium">Upload</span>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={image.preview}
                  alt="Preview"
                  className="h-40 w-full object-cover rounded-xl border"
                />

                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* Publish Button */}
          <div className="flex justify-end">
            <button
              onClick={handlePublish}
              disabled={loading}
              className="flex items-center gap-2 bg-[#5856D6] text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
