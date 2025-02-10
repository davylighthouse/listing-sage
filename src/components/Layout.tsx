
import Navigation from "./Navigation";
import UserBar from "./UserBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <UserBar />
      <main className="ml-64 p-8 animate-fade-in">{children}</main>
    </div>
  );
};

export default Layout;
