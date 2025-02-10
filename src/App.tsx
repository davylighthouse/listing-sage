
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout>
                  <div className="max-w-4xl mx-auto text-center py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      eBay Analytics Dashboard
                    </h1>
                    <p className="text-gray-600 mb-8">
                      Upload your eBay listing data and gain valuable insights to optimize your performance
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-2xl mx-auto">
                      <a
                        href="/dashboard"
                        className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                      >
                        <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
                        <p className="text-gray-600">
                          View insights and performance metrics
                        </p>
                      </a>
                    </div>
                  </div>
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/upload"
            element={
              <AuthGuard>
                <Layout>
                  <Upload />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Layout>
                  <Dashboard />
                </Layout>
              </AuthGuard>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
