"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";

export default function EditProperty() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const property = state?.property;

  // Redirect if no property is passed
  useEffect(() => {
    if (!property) navigate("/properties");
  }, [property, navigate]);

  const [title, setTitle] = useState(property?.title || "");
  const [location, setLocation] = useState(property?.city || "");
  const [price, setPrice] = useState(property?.price || "");
  const [status, setStatus] = useState(property?.status || "Active");
  const [image, setImage] = useState(property?.image || "");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle selecting a new image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    setLoading(true);

    let imageUrl = property.image;

    // Upload new image if selected
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, imageFile, { upsert: true });

      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }

      // Get public URL of uploaded image
      const { data } = supabase.storage.from("property-images").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    // Update property in Supabase
    const { error } = await supabase
      .from("properties")
      .update({
        title,
        city: location,
        price,
        status,
        images:[ imageUrl],
      })
      .eq("id", property.id); // match property by id

    if (error) {
      alert("Update failed: " + error.message);
      setLoading(false);
      return;
    }

    alert("Property updated successfully!");
    navigate("/properties");
  };

  if (!property) return null;

  return (
    <DashboardLayout>
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <ArrowLeft
              className="w-5 h-5 text-gray-600 cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h1 className="text-lg font-bold text-[#111827]">Edit Property</h1>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter property title"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-sm outline-none placeholder-gray-400"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter property location"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-sm outline-none placeholder-gray-400"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter property price"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-sm outline-none placeholder-gray-400"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-sm outline-none"
              >
                <option value="Active">Active</option>
                <option value="Sold">Sold</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Property Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
                {image ? (
                  <img src={image} alt="Property" className="h-full object-contain" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 mb-2" />
                    <span className="text-xs font-medium">Upload Image</span>
                  </>
                )}
              </div>
            </div>

            {/* Date Added */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Date Added</label>
              <input
                type="text"
                value={property.created_at ? property.created_at.slice(0, 10) : "N/A"}
                readOnly
                className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-sm outline-none text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-end">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Property"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
