
import { Link, useLocation } from "react-router-dom";
import { BarChart3, FileSpreadsheet, Upload, List, Map, Package, Trophy, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const location = useLocation();

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`w-full flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 ${
                ['/data', '/mapping'].includes(location.pathname) ? 'bg-primary text-white' : ''
              }`}
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" side="right">
            {settingsLinks.map(({ to, label, icon: Icon }) => (
              <DropdownMenuItem key={to} asChild>
                <Link
                  to={to}
                  className="flex items-center px-2 py-2 cursor-pointer"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navigation;

