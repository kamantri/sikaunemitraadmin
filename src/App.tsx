
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import BlogPosts from "./pages/admin/BlogPosts";
import Courses from "./pages/admin/Courses";
import Notes from "./pages/admin/Notes";
import Users from "./pages/admin/Users";
import StudentUsers from "./pages/admin/StudentUsers";
import TeacherUsers from "./pages/admin/TeacherUsers";
import TeacherView from "./pages/admin/TeacherView";
import TeacherEdit from "./pages/admin/TeacherEdit";
import AdminUsers from "./pages/admin/AdminUsers";
import Offers from "./pages/admin/Offers";
import Events from "./pages/admin/Events";
import Media from "./pages/admin/Media";
import Analytics from "./pages/admin/Analytics";
import Resources from "./pages/admin/Resources";
import FAQs from "./pages/admin/FAQs";
import Categories from "./pages/admin/Categories";
import Feedback from "./pages/admin/Feedback";
import Settings from "./pages/admin/Settings";
import Permissions from "./pages/admin/Permissions";
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from '@/components/ProtectedRoute';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={
              <PublicRoute>
                <Index />
              </PublicRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="blog-posts" element={<BlogPosts />} />
              <Route path="courses" element={<Courses />} />
              <Route path="notes" element={<Notes />} />
              <Route path="users" element={<Users />} />
              <Route path="students" element={<StudentUsers />} />
              <Route path="teachers" element={<TeacherUsers />} />
              <Route path="teachers/:id" element={<TeacherView />} />
              <Route path="teachers/:id/edit" element={<TeacherEdit />} />
              <Route path="admins" element={<AdminUsers />} />
              <Route path="offers" element={<Offers />} />
              <Route path="events" element={<Events />} />
              <Route path="media" element={<Media />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="resources" element={<Resources />} />
              <Route path="faqs" element={<FAQs />} />
              <Route path="categories" element={<Categories />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="settings" element={<Settings />} />
              <Route path="permissions" element={<Permissions />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
