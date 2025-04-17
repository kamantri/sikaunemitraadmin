import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Shield, 
  Search, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Edit, 
  ShieldAlert,
  ShieldCheck,
  UserCog,
  Lock,
  FileCheck,
  Settings,
  Key
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

// Role type definition
type Role = {
  id: number;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
  isSystem?: boolean;
};

// Permission type definition
type Permission = {
  id: string;
  name: string;
  description: string;
  category: string;
};

const PermissionsPage = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const roles: Role[] = [
    {
      id: 1,
      name: "Administrator",
      description: "Full access to all features and settings",
      usersCount: 5,
      permissions: ["manage_users", "manage_content", "manage_settings", "view_analytics", "manage_payments"],
      isSystem: true
    },
    {
      id: 2,
      name: "Content Manager",
      description: "Create and manage courses and educational content",
      usersCount: 12,
      permissions: ["manage_content", "view_analytics"]
    },
    {
      id: 3,
      name: "Student Support",
      description: "Assist students and manage support tickets",
      usersCount: 8,
      permissions: ["view_users", "respond_to_support"]
    },
    {
      id: 4,
      name: "Teacher",
      description: "Create courses and interact with students",
      usersCount: 25,
      permissions: ["create_courses", "view_students", "grade_assignments"]
    },
    {
      id: 5,
      name: "Finance Manager",
      description: "Manage payments and financial records",
      usersCount: 3,
      permissions: ["manage_payments", "view_analytics", "generate_reports"]
    }
  ];

  const permissions: Permission[] = [
    { id: "manage_users", name: "Manage Users", description: "Create, edit, and delete user accounts", category: "Users" },
    { id: "view_users", name: "View Users", description: "View user profiles and information", category: "Users" },
    { id: "manage_content", name: "Manage Content", description: "Create, edit, and delete courses and content", category: "Content" },
    { id: "create_courses", name: "Create Courses", description: "Create new courses and lessons", category: "Content" },
    { id: "view_students", name: "View Students", description: "View student profiles and progress", category: "Users" },
    { id: "grade_assignments", name: "Grade Assignments", description: "Review and grade student assignments", category: "Content" },
    { id: "manage_settings", name: "Manage Settings", description: "Configure system settings", category: "Administration" },
    { id: "view_analytics", name: "View Analytics", description: "Access analytics and reports", category: "Analytics" },
    { id: "manage_payments", name: "Manage Payments", description: "Process payments and refunds", category: "Finance" },
    { id: "generate_reports", name: "Generate Reports", description: "Create and export system reports", category: "Analytics" },
    { id: "respond_to_support", name: "Respond to Support", description: "Handle support tickets and inquiries", category: "Support" }
  ];

  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const filteredRoles = searchQuery
    ? roles.filter(role => 
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : roles;

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditDialogOpen(true);
  };

  const handleViewPermissions = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">Access Control</h1>
          <p className="text-muted-foreground">Manage roles and permissions for system users</p>
        </div>
        <Button onClick={() => toast.success("Create role clicked")} className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Create New Role
        </Button>
      </div>

      <Tabs defaultValue="roles" className="bg-white rounded-lg shadow-sm">
        <div className="px-6 pt-6">
          <TabsList className="grid grid-cols-3 w-full md:w-[400px] bg-slate-100 p-1 rounded-lg">
            <TabsTrigger value="roles" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex gap-2 items-center">
              <Shield className="h-4 w-4" />
              <span>Roles</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex gap-2 items-center">
              <Key className="h-4 w-4" />
              <span>Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="user-roles" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex gap-2 items-center">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="roles" className="space-y-6 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search roles..." 
                className="pl-8 w-full md:w-[300px] border-slate-200 rounded-lg" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                Total: {roles.length} roles
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                System: {roles.filter(r => r.isSystem).length}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">
                Custom: {roles.filter(r => !r.isSystem).length}
              </Badge>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[250px]">Role</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="text-center w-[80px]">Users</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map(role => (
                  <TableRow key={role.id} className="group hover:bg-blue-50/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${role.isSystem ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                          {role.isSystem ? <ShieldCheck className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="font-medium">{role.name}</div>
                          {role.isSystem && (
                            <div className="text-xs text-muted-foreground">
                              System role
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{role.description}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 flex gap-1 items-center">
                          <Users className="h-3 w-3" />
                          {role.usersCount}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 opacity-90 group-hover:opacity-100">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditRole(role)}
                          disabled={role.isSystem}
                          className="text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100"
                          onClick={() => handleViewPermissions(role)}
                        >
                          <FileCheck className="h-3.5 w-3.5 mr-1" />
                          Permissions
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="permissions" className="space-y-6 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">System Permissions</h2>
              <p className="text-muted-foreground">Manage available permissions and their assignments</p>
            </div>
            <Button
              onClick={() => toast.success("Add permission clicked")}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Permission
            </Button>
          </div>
          
          <div className="grid gap-6">
            {Object.entries(permissionsByCategory).map(([category, perms]) => (
              <Card key={category} className="overflow-hidden border-slate-200">
                <CardHeader className="bg-slate-50 border-b border-slate-200 py-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-full">
                      {category === "Users" ? <Users className="h-4 w-4" /> :
                       category === "Content" ? <FileCheck className="h-4 w-4" /> :
                       category === "Administration" ? <Settings className="h-4 w-4" /> :
                       category === "Analytics" ? <ShieldAlert className="h-4 w-4" /> :
                       category === "Finance" ? <ShieldCheck className="h-4 w-4" /> :
                       <Shield className="h-4 w-4" />}
                    </div>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="w-[250px]">Permission</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {perms.map(permission => (
                        <TableRow key={permission.id} className="group">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="bg-indigo-50 text-indigo-500 p-1 rounded">
                                <Key className="h-3 w-3" />
                              </div>
                              {permission.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{permission.description}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toast.info(`Editing permission: ${permission.name}`)}
                              className="opacity-80 group-hover:opacity-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="user-roles" className="space-y-6 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">User Role Assignments</h2>
              <p className="text-muted-foreground">Manage which users have which roles</p>
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-8 w-full md:w-[260px] border-slate-200" />
            </div>
          </div>
          
          <Card className="border-slate-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Assigned Roles</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="group hover:bg-blue-50/40">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">JD</div>
                        <div className="font-medium">John Doe</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">john.doe@example.com</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">Administrator</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast.info("Editing roles for John Doe")}
                        className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 opacity-80 group-hover:opacity-100"
                      >
                        <UserCog className="h-3.5 w-3.5 mr-1" />
                        Edit Roles
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow className="group hover:bg-blue-50/40">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">JS</div>
                        <div className="font-medium">Jane Smith</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">jane.smith@example.com</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">Content Manager</Badge>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Teacher</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast.info("Editing roles for Jane Smith")}
                        className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 opacity-80 group-hover:opacity-100"
                      >
                        <UserCog className="h-3.5 w-3.5 mr-1" />
                        Edit Roles
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow className="group hover:bg-blue-50/40">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">RJ</div>
                        <div className="font-medium">Robert Johnson</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">robert.j@example.com</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200">Finance Manager</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast.info("Editing roles for Robert Johnson")}
                        className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 opacity-80 group-hover:opacity-100"
                      >
                        <UserCog className="h-3.5 w-3.5 mr-1" />
                        Edit Roles
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow className="group hover:bg-blue-50/40">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">AT</div>
                        <div className="font-medium">Alice Thompson</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">alice.t@example.com</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 border-teal-200">Student Support</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast.info("Editing roles for Alice Thompson")}
                        className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 opacity-80 group-hover:opacity-100"
                      >
                        <UserCog className="h-3.5 w-3.5 mr-1" />
                        Edit Roles
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Role: {selectedRole?.name}</DialogTitle>
            <DialogDescription>Modify role details and settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="role-name" className="text-sm font-medium">Role Name</label>
                <Input id="role-name" defaultValue={selectedRole?.name} className="border-slate-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="role-status" className="text-sm font-medium">Status</label>
                <div className="flex items-center gap-2 h-10">
                  <Switch defaultChecked id="role-status" />
                  <label htmlFor="role-status" className="text-sm text-muted-foreground">Active</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role-description" className="text-sm font-medium">Description</label>
              <Input id="role-description" defaultValue={selectedRole?.description} className="border-slate-200" />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-slate-200">
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success("Role saved successfully");
                setIsEditDialogOpen(false);
              }} className="bg-gradient-to-r from-indigo-500 to-blue-600">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Permissions Dialog */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={`p-1.5 rounded-full ${selectedRole?.isSystem ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                {selectedRole?.isSystem ? <ShieldCheck className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
              </div>
              <span>Role Permissions: {selectedRole?.name}</span>
            </DialogTitle>
            <DialogDescription>Configure permissions for this role</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
            {Object.entries(permissionsByCategory).map(([category, perms]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <div className="bg-indigo-50 text-indigo-600 p-1 rounded">
                      {category === "Users" ? <Users className="h-3.5 w-3.5" /> :
                       category === "Content" ? <FileCheck className="h-3.5 w-3.5" /> :
                       category === "Administration" ? <Settings className="h-3.5 w-3.5" /> :
                       category === "Analytics" ? <ShieldAlert className="h-3.5 w-3.5" /> :
                       category === "Finance" ? <ShieldCheck className="h-3.5 w-3.5" /> :
                       <Shield className="h-3.5 w-3.5" />}
                    </div>
                    {category}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Select all</span>
                    <Switch />
                  </div>
                </div>
                <div className="space-y-3 border rounded-md p-3 bg-slate-50/50 border-slate-200">
                  {perms.map(permission => (
                    <div key={permission.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-white">
                      <Checkbox 
                        id={permission.id}
                        defaultChecked={selectedRole?.permissions.includes(permission.id)}
                        onCheckedChange={() => toast.info(`Updated permission: ${permission.name}`)}
                        className="mt-1"
                      />
                      <div>
                        <label
                          htmlFor={permission.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.name}
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center border-t pt-4">
            <div className="text-sm text-muted-foreground">
              {selectedRole?.permissions.length} permissions assigned
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsPermissionsDialogOpen(false)} className="border-slate-200">
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success("Permissions updated successfully");
                setIsPermissionsDialogOpen(false);
              }} className="bg-gradient-to-r from-indigo-500 to-blue-600">
                Save Permissions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermissionsPage;
