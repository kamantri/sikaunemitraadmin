
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Trash2, Plus, GraduationCap, Eye } from "lucide-react";

const fetchCourses = async () => {
  const response = await fetch('http://localhost:4000/api/courses');
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
};

export default function Courses() {
  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<any>(null);
  const [viewCourse, setViewCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    duration: '',
    level: 'beginner',
    image_url: ''
  });

  const { data: courses, isLoading, error, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses
  });

  const handleOpenDialog = (course?: any) => {
    if (course) {
      setEditCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        price: String(course.price),
        category: course.category || '',
        duration: course.duration || '',
        level: course.level || 'beginner',
        image_url: course.image_url || ''
      });
    } else {
      setEditCourse(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        duration: '',
        level: 'beginner',
        image_url: ''
      });
    }
    setIsOpen(true);
  };

  const handleViewCourse = (course: any) => {
    setViewCourse(course);
    setIsViewOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLevelChange = (value: string) => {
    setFormData(prev => ({ ...prev, level: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editCourse 
        ? `http://localhost:4000/api/courses/${editCourse.id}`
        : 'http://localhost:4000/api/courses';
      
      const method = editCourse ? 'PUT' : 'POST';
      
      const courseData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save course');
      }
      
      toast.success(editCourse ? 'Course updated successfully' : 'Course created successfully');
      setIsOpen(false);
      refetch();
      
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Error saving course');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete course');
      }
      
      toast.success('Course deleted successfully');
      refetch();
      
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Error deleting course');
    }
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Title"
    },
    {
      accessorKey: "category",
      header: "Category"
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }: any) => (
        <div className="capitalize">{row.original.level}</div>
      )
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }: any) => (
        <div>${Number(row.original.price).toFixed(2)}</div>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <div className="capitalize">{row.original.status}</div>
      )
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewCourse(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
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

  if (isLoading) return <div className="p-4">Loading courses...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading courses</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Course
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={courses || []}
        searchKey="title"
      />

      {/* Edit/Create Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            <DialogDescription>
              {editCourse
                ? "Edit the details of your course below"
                : "Fill in the details to create a new course"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    placeholder="e.g. 4 weeks"
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="level">Level</Label>
                  <Select value={formData.level} onValueChange={handleLevelChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
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
                <GraduationCap className="mr-2 h-4 w-4" />
                {editCourse ? 'Update' : 'Create'} Course
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>View Course</DialogTitle>
          </DialogHeader>

          {viewCourse && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">{viewCourse.title}</h2>
                <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                  <span className="capitalize">Level: {viewCourse.level}</span>
                  {viewCourse.category && <span>• Category: {viewCourse.category}</span>}
                  {viewCourse.duration && <span>• Duration: {viewCourse.duration}</span>}
                </div>
              </div>

              {viewCourse.image_url && (
                <img 
                  src={viewCourse.image_url} 
                  alt={viewCourse.title} 
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              )}

              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-medium mb-2">Description:</h3>
                <p className="whitespace-pre-wrap">{viewCourse.description}</p>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <span className="text-sm font-medium">Price: </span>
                  <span className="text-lg font-bold">${Number(viewCourse.price).toFixed(2)}</span>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsViewOpen(false);
                      handleOpenDialog(viewCourse);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsViewOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
