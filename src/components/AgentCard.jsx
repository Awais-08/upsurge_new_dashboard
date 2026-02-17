
import { FiGlobe } from "react-icons/fi";


export default function AgentCard({ agent }) {
    return (
        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">


            <div className="relative">
                <img
                    src={agent.photo_url}
                    alt={agent.name}
                    className="w-full h-56 object-cover"
                />

                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-sm px-4 py-1.5 rounded-full shadow">
                    View Profile
                </button>
            </div>


            <div className="p-4 flex flex-col gap-3 flex-1">
                <h3 className="font-semibold text-lg  text-[#0F172A]">
                    {agent.full_name}
                </h3>

                <span className="text-[#2563EB] text-sm font-medium mt-0">
                    {agent.role}
                </span>

                <span className="text-xs text-[#9CA3AF]">{agent.license || "Lic: NC-123456"}</span>

                <div className="space-y-3 text-sm text-[#4B5563]">
                    <p className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F9FAFB] border border-[#E5E7EB]">
                            <img
                                src="/email.svg"
                                alt="Email"
                                className="w-4 h-4 filter font-bold text-[#4B5563] brightness-0 "
                            />
                        </span>
                        {agent.email}
                    </p>

                    <p className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F9FAFB] border border-[#E5E7EB]">
                            <img
                                src="/location.svg"
                                alt="Office"
                                className="w-4 h-4 filter font-bold text-[#4B5563] brightness-0 "
                            />
                        </span>
                        Office: {agent.location}
                    </p>

                    <p className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F9FAFB] border border-[#E5E7EB]">
                            <img
                                src="/call.svg"
                                alt="Phone"
                                className="w-4 h-4 filter font-bold text-[#4B5563] brightness-0 "
                            />
                        </span>
                        Cell: {agent.phone}
                    </p>

                    <p className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F9FAFB] border border-[#E5E7EB]">
                            <FiGlobe className="text-[#4B5563]" />
                        </span>
                        Visit Website
                    </p>
                </div>

                {/* Buttons */}
                 <div className="flex gap-3 pt-3">
          <button className="flex-1 bg-[#5856D6] text-white py-2 rounded-md text-sm">
            Contact
          </button>
          <button className="flex-1 border border-[#E5E7EB] text-sm rounded-md">
            Listings
          </button>
        </div>
            </div>
        </div>
    );
}
