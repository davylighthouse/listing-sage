
import Navigation from "./Navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="ml-64 p-8 animate-fade-in">{children}</main>
    </div>
  );
};

export default Layout;
