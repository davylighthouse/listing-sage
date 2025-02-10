
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Upload from "./pages/Upload";
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
                <div className="text-center py-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to eBay Analytics
                  </h1>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Get started by uploading your eBay listing data through the
                    Upload page
                  </p>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
