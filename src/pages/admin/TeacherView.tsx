
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, Award, Book, Clock, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Sample teacher data
// In a real application, you would fetch this data from the backend
const teacherData = {
  id: "1",
  name: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  phone: "+977 9801234567",
  status: "Active",
  joinDate: "Jan 15, 2023",
  lastActive: "2 hours ago",
  department: "Computer Science",
  qualification: "PhD in Computer Science",
  bio: "Dr. Aarav Sharma is a professor of Computer Science with over 10 years of teaching experience. He specializes in artificial intelligence and machine learning.",
  courses: [
    { id: "1", title: "Introduction to Python Programming", students: 45, rating: 4.8 },
    { id: "2", title: "Advanced Data Structures", students: 32, rating: 4.6 },
    { id: "3", title: "Machine Learning Fundamentals", students: 38, rating: 4.9 },
  ],
  courseCount: 3
};

const TeacherView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teacher, setTeacher] = useState(teacherData);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    // In a real application, you would fetch the teacher data from the backend
    // For example:
    // const fetchTeacher = async () => {
    //   try {
    //     const response = await fetch(`/api/teachers/${id}`);
    //     const data = await response.json();
    //     setTeacher(data);
    //   } catch (error) {
    //     console.error('Failed to fetch teacher:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchTeacher();
    
    // For this demo, we'll just simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const handleEdit = () => {
    navigate(`/admin/teachers/${id}/edit`);
  };
  
  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    // In a real application, you would delete the teacher from the database
    // For example:
    // const deleteTeacher = async () => {
    //   try {
    //     await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
    //     toast({ title: "Teacher deleted", description: "The teacher has been deleted successfully" });
    //     navigate('/admin/teachers');
    //   } catch (error) {
    //     console.error('Failed to delete teacher:', error);
    //     toast({ title: "Error", description: "Failed to delete teacher", variant: "destructive" });
    //   }
    // };
    // deleteTeacher();
    
    // For this demo, we'll just show a success toast
    toast({
      title: "Teacher deleted",
      description: "The teacher account has been deleted successfully."
    });
    setDeleteDialogOpen(false);
    navigate('/admin/teachers');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success";
      case "Inactive": return "secondary";
      case "Pending": return "warning";
      default: return "default";
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/admin/teachers')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teachers
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.name}`} alt={teacher.name} />
                <AvatarFallback className="text-3xl">{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="mt-4">{teacher.name}</CardTitle>
            <Badge variant={getStatusColor(teacher.status) as any} className="mt-2">{teacher.status}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{teacher.phone}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Joined: {teacher.joinDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Last active: {teacher.lastActive}</span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Department: {teacher.department}</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Qualification: {teacher.qualification}</span>
              </div>
              <div className="flex items-start">
                <Book className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                <span>Courses: {teacher.courseCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Biography</h3>
                  <p className="mt-2">{teacher.bio}</p>
                </div>
                <Separator />
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="courses">
            <TabsList>
              <TabsTrigger value="courses">Courses ({teacher.courses.length})</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            <TabsContent value="courses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Courses</CardTitle>
                  <CardDescription>Courses taught by {teacher.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teacher.courses.map(course => (
                      <div key={course.id} className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-muted-foreground">{course.students} students enrolled</div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-amber-600 mr-1">{course.rating}</div>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFC107" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Students</CardTitle>
                  <CardDescription>Students enrolled in {teacher.name}'s courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No student data available.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Recent activities of {teacher.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No activity data available.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this teacher?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the teacher account 
              and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherView;
