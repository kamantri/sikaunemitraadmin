
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Trash2, Plus, User } from "lucide-react";
import { apiService } from "@/utils/api";
import { UserData } from "@/models/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


// Remove the old fetchUsers function and use apiService
const fetchUsers = async () => {
  try {
    const response = await apiService.users.getAll();
    console.log('Users data:', response); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export default function Users() {
  const [isOpen, setIsOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    password: '',
    role: 'student',
    status: 'active'
  });

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  const handleOpenDialog = (user?: any) => {
    if (user) {
      setEditUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Don't show password
        role: user.role,
        status: user.status || 'active' // Add status field
      });
    } else {
      setEditUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        status: 'active' // Default status for new users
      });
    }
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Then modify your handleSubmit function:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editUser) {
        await apiService.users.update(editUser.id!, formData);
        toast.success('User updated successfully');
      } else {
        await apiService.auth.userRegister(formData);
        toast.success('User created successfully');
      }
      
      setIsOpen(false);
      refetch();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error(error.message || 'Error saving user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await apiService.users.delete(id);
      toast.success('User deleted successfully');
      refetch();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Error deleting user');
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name || 'user'}`} 
                alt={user.name || 'User'} 
              />
              <AvatarFallback className="bg-gray-100 dark:bg-gray-800">
                {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : '??'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name || 'Unknown User'}</p>
              <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                {user.email || 'No email'}
              </p>
            </div>
          </div>
        );
      },
    },
    
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }: any) => (
        <div className="capitalize">{row.original.role}</div>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.original.status || 'active';
        const statusColors = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          inactive: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
          banned: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      }
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }: any) => (
        <div className="text-sm text-muted-foreground">
          {row.original.email || 'No email'}
        </div>
      )
    },
    {
      accessorKey: "last_login",
      header: "Last Active",
      cell: ({ row }: any) => {
        return row.original.last_login 
          ? new Date(row.original.last_login).toLocaleDateString()
          : 'Never';
      }
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }: any) => {
        const dateString = row.original.created_at;
        if (!dateString) return 'N/A';
        
        try {
          // Parse the date string (format: YYYY-MM-DD HH:MM:SS)
          const [datePart, timePart] = dateString.split(' ');
          const [year, month, day] = datePart.split('-');
          const date = new Date(`${year}-${month}-${day}T${timePart}`);
          
          return isNaN(date.getTime()) 
            ? 'Invalid Date' 
            : date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
        } catch {
          return 'Invalid Date';
        }
      }
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenDialog(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading users</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold"> All Users</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users || []}
        searchKey="email"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editUser
                ? "Edit the user details below"
                : "Fill in the details to create a new user"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* <div className="grid gap-2">
                <Label htmlFor="password">
                  {editUser ? "Password (leave empty to keep current)" : "Password"}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editUser}
                />
              </div> */}

              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

             {/* Add this to your form inside the DialogContent, after the role Select */}
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <User className="mr-2 h-4 w-4" />
                {editUser ? 'Update' : 'Create'} User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
