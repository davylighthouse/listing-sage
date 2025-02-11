
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import RawData from "./pages/RawData";
import Mapping from "./pages/Mapping";
import Products from "./pages/Products";
import ProductDashboard from "./components/products/ProductDashboard";
import MetricPriorities from "./pages/MetricPriorities";
import LeagueTable from "./pages/LeagueTable";

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
                  <Navigate to="/dashboard" replace />
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
          <Route
            path="/listings"
            element={
              <AuthGuard>
                <Layout>
                  <Listings />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/listings/:itemId"
            element={
              <AuthGuard>
                <Layout>
                  <ListingDetail />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/data"
            element={
              <AuthGuard>
                <Layout>
                  <RawData />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/products"
            element={
              <AuthGuard>
                <Layout>
                  <Products />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/products/:productId"
            element={
              <AuthGuard>
                <Layout>
                  <ProductDashboard />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/mapping"
            element={
              <AuthGuard>
                <Layout>
                  <Mapping />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/metrics"
            element={
              <AuthGuard>
                <Layout>
                  <MetricPriorities />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/league-table"
            element={
              <AuthGuard>
                <Layout>
                  <LeagueTable />
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
