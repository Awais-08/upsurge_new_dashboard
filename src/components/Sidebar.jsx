import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    MessageSquare,
    FileText,
    Info,
    User,
    LogOut,
    X,
} from "lucide-react";
import { useEffect } from "react";
import { MdAccountCircle } from "react-icons/md";

export default function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        onClose();
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("auth");
        navigate("/login", { replace: true });
    };

    return (
        <>

            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/30 z-40 md:hidden"
                />
            )}


            <aside
                className={`
          fixed md:static top-0 left-0 z-50
          h-full w-64 bg-white border-r border-[#E5E7EB]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
            >

                <div className="flex items-center justify-between px-6  border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="w-14 h-14" />
                        <h1 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#76411E] to-[#FAB28D]">
                            UPSURGE REALTY
                        </h1>
                    </div>


                    <button onClick={onClose} className="md:hidden text-gray-600">
                        <X size={20} />
                    </button>
                </div>


                <nav className="space-y-2 flex-1 px-4 py-6">
                    <Item to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                    <Item to="/properties" icon={<FileText size={18} />} label="Properties" />
                    <Item to="/messages" icon={<MessageSquare size={18} />} label="Messages" />
                    <Item to="/blogs" icon={<FileText size={18} />} label="Blogs" />
                    <Item to="/agents" icon={<MdAccountCircle size={18} />} label="Agents" />
                    <Item to="/about" icon={<Info size={18} />} label="About Us" />
                    <Item to="/profile" icon={<User size={18} />} label="Profile" />
                </nav>


                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-7 py-6 text-sm font-medium
          text-[#DC2626] hover:bg-red-50 transition"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </aside>
        </>
    );
}


const Item = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
      ${isActive
                ? "bg-[#EFF6FF] text-[#5856D6]"
                : "text-[#4B5563] hover:bg-gray-100"
            }`
        }
    >
        {icon}
        {label}
    </NavLink>
);
