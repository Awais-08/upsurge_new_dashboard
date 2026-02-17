import { ArrowLeft, Upload, Save } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../config/supabaseClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProperty() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        category: "",
        city: "",
        state: "",
        bedrooms: "",
        bathrooms: "",
        sqft: "",
        description: "",
        status: "Active",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (images.length >= 4) {
            toast.error("Maximum 4 images allowed");
            return;
        }

        setUploading(true);

        const fileName = `${Date.now()}-${file.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("property-images")
            .upload(fileName, file, { cacheControl: "3600", upsert: false });

        if (uploadError) {
            toast.error(uploadError.message);
            setUploading(false);
            return;
        }

        const { data: publicData } = supabase.storage
            .from("property-images")
            .getPublicUrl(fileName);

        setImages([...images, publicData.publicUrl]);
        setUploading(false);
    };

    const handleSubmit = async () => {
        setLoading(true);

        const cleanPrice = Number(formData.price.replace(/,/g, ""));

        const { error } = await supabase.from("properties").insert([
            {
                ...formData,
                price: cleanPrice,
                images,
            },
        ]);

        if (error) {
            toast.error(error.message);
            setLoading(false);
            return;
        }

        toast.success("Property Added Successfully");
        navigate("/properties");
    };


    return (
        <DashboardLayout>  <div className="p-6 max-w-4xl mx-auto">

            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate("/properties")}>
                <ArrowLeft className="w-5 h-5 text-gray-600" />
                <h1 className="text-lg font-bold text-[#111827]">
                    Add New Property
                </h1>
            </div>


            <div className="grid grid-cols-1   lg:grid-cols-[2fr_1fr] gap-6">


                <div className="space-y-6">

                    <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-xl p-6">
                        <h2 className="font-semibold text-[#111827] mb-4">
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            <Input
                                label="Property Title"
                                name="title" onChange={handleChange}
                                placeholder="Enter Property title"
                                className="w-full bg-[#F2F2F2] rounded-lg px-4 py-3 text-sm placeholder-[#CCCCCC]"
                                labelClassName="block text-sm font-medium text-[#374151] mb-2"
                            />




                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Price ($)" name="price" onChange={handleChange} placeholder="$0.0" className="w-full bg-[#F2F2F2] rounded-lg px-4 py-3 text-sm  placeholder-[#CCCCCC]"
                                    labelClassName="block text-sm font-medium text-[#374151] mb-2" />
                                <Input label="Category" name="category" onChange={handleChange} placeholder="Enter category" className="w-full bg-[#F2F2F2] rounded-lg px-4 py-3 text-sm  placeholder-[#CCCCCC]"
                                    labelClassName="block text-sm font-medium text-[#374151] mb-2" />
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="City" name="city" onChange={handleChange} placeholder="Enter city" className="w-full bg-[#F2F2F2] rounded-lg px-4 py-3 text-sm  placeholder-[#CCCCCC]"
                                    labelClassName="block text-sm font-medium text-[#374151] mb-2" />
                                <Input label="State" name="state" onChange={handleChange} placeholder="Enter State" className="w-full bg-[#F2F2F2] rounded-lg px-4 py-3 text-sm  placeholder-[#CCCCCC]"
                                    labelClassName="block text-sm font-medium text-[#374151] mb-2" />
                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Input label="Bedrooms" name="bedrooms" onChange={handleChange} placeholder="0" className="w-full bg-[#F2F2F2] rounded-lg px-4 py-3 text-sm  placeholder-[#CCCCCC]"
                                    labelClassName="block text-sm font-medium text-[#374151] mb-2" />
                                <Input label="Bathrooms" name="bathrooms" onChange={handleChange} placeholder="0" className="w-full bg-[#F2F2F2] rounded-lg px-4 py-3 text-sm  placeholder-[#CCCCCC]"
                                    labelClassName="block text-sm font-medium text-[#374151] mb-2" />
                                <Input label="Sqft" name="sqft" onChange={handleChange} placeholder="0" className="w-full bg-[#F2F2F2] rounded-lg px-4 py-3 text-sm  placeholder-[#CCCCCC]"
                                    labelClassName="block text-sm font-medium text-[#374151] mb-2" />
                            </div>


                            <div>
                                <label className="text-sm font-medium text-[#374151] mb-1 block">
                                    Description
                                </label>
                                <textarea name="description"
                                    onChange={handleChange}
                                    placeholder="Describe the property..."
                                    rows={4}
                                    className="w-full  rounded-lg px-4 py-3 text-sm bg-[#F2F2F2]  placeholder-[#CCCCCC]"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-xl p-6">
                        <h2 className="font-semibold text-[#111827] mb-4">
                            Property Images
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[0, 1, 2, 3].map((index) => (
                                <div key={index} className="relative h-28 rounded-xl overflow-hidden">

                                    {images[index] ? (
                                        <img
                                            src={images[index]}
                                            alt="property"
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    ) : (
                                        <label className="border-2 border-dashed border-[#D1D5DB] rounded-xl h-28 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-indigo-500">
                                            <Upload className="w-5 h-5 mb-1" />
                                            <span className="text-xs font-medium">
                                                Upload
                                            </span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(e, index)}
                                            />
                                        </label>
                                    )}

                                </div>
                            ))}
                        </div>
                    </div>


                </div>

                {/* RIGHT SIDE */}
                <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-xl p-6 h-fit">
                    <h2 className="font-semibold text-[#111827] mb-4">
                        Status & Visibility
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-[#374151] font-medium mb-1 block">
                                Status
                            </label>
                            <select name="status"
                                onChange={handleChange} className="w-full border text-[#111827] bg-[#F4F4F4] border-gray-200 rounded-lg px-4 py-3 text-sm">
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Sold</option>
                            </select>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg"
                        >
                            <Save size={16} />
                            {loading ? "Saving..." : "Save Property"}
                        </button>
                    </div>
                </div>
            </div>
        </div></DashboardLayout>

    );
}

const Input = ({ label, placeholder, name, className, onChange, labelClassName }) => (
    <div>
        <label className={labelClassName || "text-sm text-gray-600 mb-1 block"}>
            {label}
        </label>
        <input
            type="text"
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            className={
                className ||
                "w-full border border-gray-200 bg-white rounded-lg px-4 py-3 text-sm"
            }
        />
    </div>
);
