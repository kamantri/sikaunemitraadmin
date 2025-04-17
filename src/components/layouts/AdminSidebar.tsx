
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  Image, 
  BarChart2, 
  MessageCircle, 
  Settings, 
  BookMarked,
  FileQuestion,
  Tag,
  Calendar,
  Shield,
  GraduationCap,
  UserCog,
  ShieldCheck,
  StickyNote
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const mainMenuItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { 
      title: "Users", 
      url: "/admin/users", 
      icon: Users,
      subItems: [
        { title: "All Users", url: "/admin/users" },
        { title: "Students", url: "/admin/students" },
        { title: "Teachers", url: "/admin/teachers" },
        { title: "Administrators", url: "/admin/admins" }
      ]
    },
    { title: "Blogs", url: "/admin/blogs", icon: FileText },
    { title: "Courses", url: "/admin/courses", icon: BookOpen },
    { title: "Notes", url: "/admin/notes", icon: StickyNote },
    { title: "Media", url: "/admin/media", icon: Image },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart2 }
  ];

  const contentItems = [
    { title: "Resources", url: "/admin/resources", icon: BookMarked },
    { title: "FAQs", url: "/admin/faqs", icon: FileQuestion },
    { title: "Categories", url: "/admin/categories", icon: Tag },
    { title: "Events", url: "/admin/events", icon: Calendar },
    { title: "Offers", url: "/admin/offers", icon: Tag },
    { title: "Feedback", url: "/admin/feedback", icon: MessageCircle },
  ];

  const configItems = [
    { title: "Settings", url: "/admin/settings", icon: Settings },
    { title: "Permissions", url: "/admin/permissions", icon: Shield },
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-bold">SM</span>
          </div>
          <h1 className="text-xl font-bold">Sikau Admin</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url) || (item.subItems && item.subItems.some(sub => isActive(sub.url)))}>
                    {item.subItems ? (
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </div>
                    ) : (
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                  
                  {item.subItems && (
                    <SidebarMenuSub>
                      {item.subItems.map(subItem => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={isActive(subItem.url)}>
                            <Link to={subItem.url}>{subItem.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
