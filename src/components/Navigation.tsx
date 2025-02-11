
import { Link, useLocation } from "react-router-dom";
import { BarChart3, FileSpreadsheet, Upload, List, Map, Package, Trophy, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const mainLinks = [
    { to: "/", label: "Dashboard", icon: BarChart3 },
    { to: "/league-table", label: "League Table", icon: Trophy },
    { to: "/products", label: "Products", icon: Package },
    { to: "/listings", label: "Listings", icon: List },
    { to: "/upload", label: "Upload", icon: Upload },
  ];

  const settingsLinks = [
    { to: "/data", label: "Raw Data", icon: FileSpreadsheet },
    { to: "/mapping", label: "Mapping", icon: Map },
  ];

  return (
    <nav className="fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-primary">eBay Analytics</h1>
      </div>
      <div className="space-y-2">
        {mainLinks.map(({ to, label, icon: Icon }) => {
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

        <div>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 ${
              ['/data', '/mapping'].includes(location.pathname) ? 'bg-primary text-white' : ''
            }`}
          >
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isSettingsOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {settingsLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === to
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

