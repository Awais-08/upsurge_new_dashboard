import { useState, useEffect } from "react";
import AgentCard from "../components/AgentCard";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import AddAgent from "./AddAgent";
import { supabase } from "../config/supabaseClient";
// const agents = [
//     {
//         name: "Helen Edwards-Jackson",
//         role: "Broker-in-Charge",
//         license: "29256",
//         email: "helen@upsurgerealty.com",
//         image: "/agent1.png",
//         office: "(704) 555-0101",
//         cell: "(704) 555-0102",
//     },
//     {
//         name: "James Edwards III",
//         role: "REALTOR®",
//         license: "340034",
//         email: "james@upsurgerealty.com",
//         image: "/agent2.jpg",
//         office: "(704) 555-0101",
//         cell: "(704) 555-0102",
//     },
//     {
//         name: "Nathalie Fongang",
//         role: "REALTOR®",
//         license: "313452",
//         email: "nathalia@upsurgerealty.com",
//         office: "(704) 555-0101",
//         cell: "(704) 555-0102",
//         image: "/agent3.jpg",
//     },
//     {
//         id: 4,
//         name: "Trever Swint",
//         role: "REALTOR®",
//         license: "Lic: NC-123456",
//         email: "trever@upsurgerealty.com",
//         office: "(704) 555-0101",
//         cell: "(704) 555-0102",
//         image: "/agent4.jpg",
//         description: "With over 15 years of experience in the Charlotte real estate market,Helen brings unparalleled expertise and dedication to every transaction.As our Broker-in -Charge, she leads our team with integrity and a commitment to excellence.Her deep understanding of luxury properties and investment opportunities has helped countless clients achieve their real estate goals.",
//     },
//     {
//         id: 5,
//         name: "Trever Swint",
//         role: "REALTOR®",
//         license: "Lic: NC-123456",
//         email: "trever@upsurgerealty.com",
//         office: "(704) 555-0101",
//         cell: "(704) 555-0102",
//         image: "/agent4.jpg",
//         description: "With over 15 years of experience in the Charlotte real estate market,Helen brings unparalleled expertise and dedication to every transaction.As our Broker-in -Charge, she leads our team with integrity and a commitment to excellence.Her deep understanding of luxury properties and investment opportunities has helped countless clients achieve their real estate goals.",
//     },
//     {
//         id: 6,
//         name: "Trever Swint",
//         role: "REALTOR®",
//         license: "Lic: NC-123456",
//         email: "trever@upsurgerealty.com",
//         office: "(704) 555-0101",
//         cell: "(704) 555-0102",
//         image: "/agent4.jpg",
//         description: "With over 15 years of experience in the Charlotte real estate market,Helen brings unparalleled expertise and dedication to every transaction.As our Broker-in -Charge, she leads our team with integrity and a commitment to excellence.Her deep understanding of luxury properties and investment opportunities has helped countless clients achieve their real estate goals.",
//     },
//     {
//         id: 7,
//         name: "Trever Swint",
//         role: "REALTOR®",
//         license: "Lic: NC-123456",
//         email: "trever@upsurgerealty.com",
//         office: "(704) 555-0101",
//         cell: "(704) 555-0102",
//         image: "/agent4.jpg",
//         description: "With over 15 years of experience in the Charlotte real estate market,Helen brings unparalleled expertise and dedication to every transaction.As our Broker-in -Charge, she leads our team with integrity and a commitment to excellence.Her deep understanding of luxury properties and investment opportunities has helped countless clients achieve their real estate goals.",
//     },
// ];
export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAgent, setShowAddAgent] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  // Fetch agents from Supabase
  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching agents:", error.message);
      } else {
        setAgents(data);
      }
      setLoading(false);
    };

    fetchAgents();
  }, []);

  const totalPages = Math.ceil(agents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAgents = agents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <DashboardLayout>
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAddAgent(true)}
            className="cursor-pointer flex items-center gap-2 bg-[#5856D6] text-white px-7 py-2 rounded-lg text-sm font-medium shadow-md"
          >
            + Add Agent
          </button>
        </div>

       {loading ? (
  <div className="flex justify-center items-center mt-10">
    <div className="w-12 h-12 border border-[#5856D6] border-t-transparent rounded-full animate-spin"></div>
  </div>
) : agents.length === 0 ? (
  <p className="text-center text-gray-500 mt-10">No agents found.</p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {currentAgents.map((agent) => (
      <AgentCard key={agent.id} agent={agent} />
    ))}
  </div>
)}


        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded-md border disabled:opacity-40"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm rounded-md border ${
                  currentPage === i + 1
                    ? "bg-[#5856D6] text-white border-[#5856D6]"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded-md border disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showAddAgent && <AddAgent onClose={() => setShowAddAgent(false)} />}
    </DashboardLayout>
  );
}
