
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <div className="max-w-4xl mx-auto text-center py-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    eBay Analytics Dashboard
                  </h1>
                  <p className="text-gray-600 mb-8">
                    Upload your eBay listing data and gain valuable insights to optimize your performance
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <a
                      href="/upload"
                      className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                    >
                      <h2 className="text-xl font-semibold mb-2">Upload Data</h2>
                      <p className="text-gray-600">
                        Import your eBay listing data via CSV
                      </p>
                    </a>
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
            }
          />
          <Route
            path="/upload"
            element={
              <Layout>
                <Upload />
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
