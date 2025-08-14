import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Routes, Route, Navigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import LoginPage from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"
import Calls from "@/pages/Calls"
import Agents from "@/pages/Agents"
import Unauthorized from "@/pages/Unauthorized"
import NotFound from "@/pages/NotFound"

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="calls" element={<Calls />} />
        <Route path="agents" element={<Agents />} />
        <Route
          path="scorecards"
          element={
            <div className="flex-1 bg-dashboard-bg p-6">
              <div className="text-center text-muted-foreground">
                Score Card Forms - Coming Soon
              </div>
            </div>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute requiredRole="admin">
              <div className="flex-1 bg-dashboard-bg p-6">
                <div className="text-center text-muted-foreground">
                  Admin Settings
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <div className="flex-1 bg-dashboard-bg p-6">
              <div className="text-center text-muted-foreground">
                Reports - Coming Soon
              </div>
            </div>
          }
        />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const App = () => {
  return (
    <TooltipProvider>
      <AppRoutes />
      <Toaster />
      <Sonner />
    </TooltipProvider>
  )
}

export default App;
