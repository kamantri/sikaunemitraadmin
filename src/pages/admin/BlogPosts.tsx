
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Trash2, Plus, FileText } from "lucide-react";

const fetchBlogs = async () => {
  const response = await fetch('http://localhost:4000/api/blogs');
  if (!response.ok) throw new Error('Failed to fetch blogs');
  return response.json();
};

export default function BlogPosts() {
  const [isOpen, setIsOpen] = useState(false);
  const [editBlog, setEditBlog] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featured_image: '',
    status: 'draft'
  });

  const { data: blogs, isLoading, error, refetch } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs
  });

  const handleOpenDialog = (blog?: any) => {
    if (blog) {
      setEditBlog(blog);
      setFormData({
        title: blog.title,
        content: blog.content,
        featured_image: blog.featured_image || '',
        status: blog.status
      });
    } else {
      setEditBlog(null);
      setFormData({
        title: '',
        content: '',
        featured_image: '',
        status: 'draft'
      });
    }
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editBlog 
        ? `http://localhost:4000/api/blogs/${editBlog.id}`
        : 'http://localhost:4000/api/blogs';
      
      const method = editBlog ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save blog');
      }
      
      toast.success(editBlog ? 'Blog updated successfully' : 'Blog created successfully');
      setIsOpen(false);
      refetch();
      
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Error saving blog');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }
      
      toast.success('Blog deleted successfully');
      refetch();
      
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Error deleting blog');
    }
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Title"
    },
    {
      accessorKey: "author_name",
      header: "Author"
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <div className="capitalize">{row.original.status}</div>
      )
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }: any) => {
        return new Date(row.original.created_at).toLocaleDateString();
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

  if (isLoading) return <div className="p-4">Loading blogs...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading blogs</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Blog
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={blogs || []}
        searchKey="title"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editBlog ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
            <DialogDescription>
              {editBlog
                ? "Edit the details of your blog post below"
                : "Fill in the details to create a new blog post"}
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
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  rows={8}
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
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
                <FileText className="mr-2 h-4 w-4" />
                {editBlog ? 'Update' : 'Create'} Blog Post
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
