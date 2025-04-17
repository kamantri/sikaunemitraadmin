
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Sample teacher data
const teacherData = {
  id: "1",
  name: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  phone: "+977 9801234567",
  status: "Active",
  department: "Computer Science",
  qualification: "PhD in Computer Science",
  bio: "Dr. Aarav Sharma is a professor of Computer Science with over 10 years of teaching experience. He specializes in artificial intelligence and machine learning."
};

const TeacherEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const isNewTeacher = !id || id === "new";
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      qualification: "",
      bio: "",
      status: "Active",
      isActive: true
    }
  });
  
  useEffect(() => {
    if (isNewTeacher) {
      setLoading(false);
      return;
    }
    
    // In a real application, you would fetch the teacher data from the backend
    // For example:
    // const fetchTeacher = async () => {
    //   try {
    //     const response = await fetch(`/api/teachers/${id}`);
    //     const data = await response.json();
    //     form.reset({
    //       name: data.name,
    //       email: data.email,
    //       phone: data.phone || '',
    //       department: data.department || '',
    //       qualification: data.qualification || '',
    //       bio: data.bio || '',
    //       status: data.status,
    //       isActive: data.status === 'Active'
    //     });
    //   } catch (error) {
    //     console.error('Failed to fetch teacher:', error);
    //     toast({
    //       title: "Error",
    //       description: "Failed to load teacher data",
    //       variant: "destructive"
    //     });
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchTeacher();
    
    // For this demo, we'll use the sample data
    const timer = setTimeout(() => {
      form.reset({
        name: teacherData.name,
        email: teacherData.email,
        phone: teacherData.phone || '',
        department: teacherData.department || '',
        qualification: teacherData.qualification || '',
        bio: teacherData.bio || '',
        status: teacherData.status,
        isActive: teacherData.status === 'Active'
      });
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id, form, isNewTeacher]);
  
  const onSubmit = async (data: any) => {
    setSubmitting(true);
    
    try {
      // In a real application, you would save the data to the backend
      // For example:
      // const response = await fetch(`/api/teachers/${isNewTeacher ? '' : id}`, {
      //   method: isNewTeacher ? 'POST' : 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     ...data,
      //     status: data.isActive ? 'Active' : 'Inactive',
      //   }),
      // });
      
      // if (!response.ok) throw new Error('Failed to save teacher');
      
      // For this demo, we'll just show a success toast
      toast({
        title: `Teacher ${isNewTeacher ? 'created' : 'updated'}`,
        description: `The teacher has been successfully ${isNewTeacher ? 'created' : 'updated'}.`
      });
      
      navigate('/admin/teachers');
    } catch (error) {
      console.error('Failed to save teacher:', error);
      toast({
        title: "Error",
        description: `Failed to ${isNewTeacher ? 'create' : 'update'} teacher`,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
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
        <h1 className="text-2xl font-bold">
          {isNewTeacher ? "Add New Teacher" : "Edit Teacher"}
        </h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the teacher's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                          <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                          <SelectItem value="Business Management">Business Management</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualification</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter qualification" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          {field.value ? "Teacher account is active" : "Teacher account is inactive"}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Profile and teaching information</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter teacher's biography and experience" 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate('/admin/teachers')}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                <>
                  {isNewTeacher ? (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Teacher
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Teacher
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TeacherEdit;
