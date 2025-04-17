
import { useState } from "react";
import { UserCog, Eye, Edit, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";

// Sample data
const teachersData = [
  {
    id: "1",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    status: "Active",
    joinDate: "Jan 15, 2023",
    lastActive: "2 hours ago",
    department: "Computer Science",
    courseCount: 3
  },
  {
    id: "2",
    name: "Priya Adhikari",
    email: "priya.adhikari@example.com",
    status: "Active",
    joinDate: "Feb 03, 2023",
    lastActive: "5 hours ago",
    department: "Digital Marketing",
    courseCount: 2
  },
  {
    id: "3",
    name: "Bijay Gurung",
    email: "bijay.gurung@example.com",
    status: "Active",
    joinDate: "Feb 18, 2023",
    lastActive: "1 day ago",
    department: "Graphic Design",
    courseCount: 1
  },
  {
    id: "4",
    name: "Anita Karki",
    email: "anita.karki@example.com",
    status: "Inactive",
    joinDate: "Mar 10, 2023",
    lastActive: "3 weeks ago",
    department: "Business Management",
    courseCount: 0
  },
];

interface Teacher {
  id: string;
  name: string;
  email: string;
  status: string;
  joinDate: string;
  lastActive: string;
  department: string;
  courseCount: number;
}

const TeacherUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleView = (id: string) => {
    navigate(`/admin/teachers/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/teachers/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    setSelectedUserId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real application, you would delete the user from the database
    toast({
      title: "Teacher deleted",
      description: "The teacher account has been deleted successfully.",
    });
    setDeleteDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success";
      case "Inactive": return "secondary";
      case "Pending": return "warning";
      default: return "default";
    }
  };

  const columns: ColumnDef<Teacher>[] = [
    {
      accessorKey: "name",
      header: "Teacher",
      cell: ({ row }) => {
        const teacher = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.name}`} alt={teacher.name} />
              <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{teacher.name}</p>
              <p className="text-sm text-muted-foreground">{teacher.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "courseCount",
      header: "Courses",
      cell: ({ row }) => {
        const courseCount = row.original.courseCount;
        return (
          <Badge variant="outline">{courseCount} courses</Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={getStatusColor(status) as any}>{status}</Badge>
        );
      },
    },
    {
      accessorKey: "joinDate",
      header: "Join Date",
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const teacher = row.original;
        
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Open menu</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleView(teacher.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(teacher.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDelete(teacher.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <UserCog className="mr-2 h-8 w-8" />
            Teachers
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage teacher accounts and course assignments
          </p>
        </div>
        <Button onClick={() => navigate("/admin/teachers/new")}>
          <UserPlus className="mr-2 h-4 w-4" />
          New Teacher
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Teachers</CardTitle>
          <CardDescription>{teachersData.length} teachers found</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={teachersData}
            searchKey="name"
          />
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this teacher?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the teacher account 
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeacherUsers;
