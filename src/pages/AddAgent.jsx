import { X } from "lucide-react";
import { useRef, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// ..
// ...
const AddAgent = ({ onClose }) => {
  const fileInputRef = useRef(null);

  // Form state
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Real Estate Agent");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  // Handle Add Agent
  const handleAddAgent = async () => {
    if (!fullName || !email || !phone || !role || !location) {
      toast.error("Please fill all required fields!");
      return;
    }

    setLoading(true);

  let imageUrl = null;


    if (imageFile) {
  const fileName = `agents/${Date.now()}_${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("agent-photos")
    .upload(fileName, imageFile);

  if (uploadError) {
    toast.error("Image upload failed: " + uploadError.message);
    setLoading(false);
    return;
  }

  const { data } = supabase.storage
    .from("agent-photos")
    .getPublicUrl(fileName);

  imageUrl = data.publicUrl;
}


    // Insert into Supabase table
    const { error } = await supabase.from("agents").insert([
      {
        full_name: fullName,
        email,
        phone,
        role,
        location,
        photo_url: imageUrl,
      },
    ]);

    if (error) {
      toast.error("Failed to add agent: " + error.message);
    } else {
      toast.success("Agent added successfully!");
      // Reset form
      setFullName("");
      setEmail("");
      setPhone("");
      setRole("Real Estate Agent");
      setLocation("");
      setPreview(null);
      setImageFile(null);

      // Close modal after 1.5s
      setTimeout(() => onClose(), 1500);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 sm:px-4">
      <div className="w-full max-w-md max-h-[90vh] rounded-2xl bg-white shadow-xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#F3F4F6]">
          <h2 className="text-base sm:text-lg font-bold text-[#111827]">
            Agent Photo
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 cursor-pointer text-[#9CA3AF]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-6">

          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div
              className="relative cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-4 border-[#E0E7FF] bg-[#F3F4F6] overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="Agent Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img src="/avatar.svg" className="w-14 h-7" />
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="mt-2 text-sm text-[#6B7280]">Agent Photo</p>
          </div>
          <div>
            <label className="text-sm font-medium text-[#374151]">
              Photo URL
            </label>
            <input
              type="text"
              placeholder="https://example.com/photo.jpg"
              onChange={(e) => setPreview(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-[#9CA3AF]">
              Upload image or paste URL
            </p>
          </div>
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-[#374151]">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Sarah Johnson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>

          {/* Role + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            >
              <option>REALTOR®</option>
              <option>Broker-in-Charge</option>
              <option>Manager</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex md:flex-row flex-col justify-between gap-3 px-6 py-4 border-t border-[#F3F4F6] bg-white">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#D1D5DB] px-16 py-3 text-sm font-medium text-[#374151]"
          >
            Cancel
          </button>

          <button
            onClick={handleAddAgent}
            disabled={loading}
            className="rounded-lg bg-[#4F46E5] shadow-md px-16 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Agent"}
          </button>
        </div>

      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AddAgent;
