
import { Link, useLocation } from "react-router-dom";
import { BarChart3, FileSpreadsheet, Upload, List, Map, Package, Trophy } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard", icon: BarChart3 },
    { to: "/upload", label: "Upload", icon: Upload },
    { to: "/data", label: "Raw Data", icon: FileSpreadsheet },
    { to: "/listings", label: "Listings", icon: List },
    { to: "/products", label: "Products", icon: Package },
    { to: "/mapping", label: "Mapping", icon: Map },
    { to: "/league-table", label: "League Table", icon: Trophy },
  ];

  return (
    <nav className="fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-primary">eBay Analytics</h1>
      </div>
      <div className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
