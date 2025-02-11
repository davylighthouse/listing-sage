
import { useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UserBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-4 left-4 p-4 flex items-center gap-4 bg-white border border-gray-200 rounded-lg w-56">
      {user?.email && (
        <span className="text-sm text-gray-600 truncate">{user.email}</span>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/settings")}
        className="hover:bg-gray-100"
      >
        <Settings className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="hover:bg-gray-100"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default UserBar;
