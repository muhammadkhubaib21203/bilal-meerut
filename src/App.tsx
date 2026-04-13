import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const Index = lazy(() => import("./pages/Index.tsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.tsx"));
const AdminPanelPage = lazy(() => import("./pages/admin/AdminPanelPage.tsx"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin" element={<AdminPanelPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
