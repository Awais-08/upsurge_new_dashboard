import { HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

const PropertiesTable = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestProperties();
  }, []);

  const fetchLatestProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        // Map status to colors
        const mappedData = data.map((item) => ({
          ...item,
          statusColor:
            item.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600",
        }));
        setProperties(mappedData);
      }
    } catch (err) {
      console.error(err);
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
    <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-5">
        <h2 className="text-lg font-semibold text-[#111827]">Recent Properties</h2>
        <button
          onClick={() => navigate("/properties")}
          className="flex items-center gap-1 text-sm text-[#4B5563] font-medium hover:text-indigo-600 transition"
        >
          View All <HiArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="hidden md:grid grid-cols-12 bg-[#F9FAFB] px-6 py-3 text-sm font-medium text-[#6B7280] border-t border-b border-[#E5E7EB]">
        <div className="col-span-8">Property</div>
        <div className="col-span-2 text-right">Price</div>
        <div className="col-span-2 text-center">Status</div>
      </div>

      {properties.map((item) => (
        <div key={item.id} className="px-4 sm:px-6 py-4 border-b border-[#E5E7EB] last:border-b-0">
          <div className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-4">
            <div className="md:col-span-8 flex items-center gap-4">
              <img src={item.images} alt={item.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.city}</p>
              </div>
            </div>
            <div className="md:col-span-2 text-sm font-medium text-gray-900 md:text-right">
              <span className="md:hidden text-gray-500 mr-1">Price:</span>
              ${item.price}
            </div>
            <div className="md:col-span-2 md:flex md:justify-center">
              <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${item.statusColor}`}>
                {item.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertiesTable;
