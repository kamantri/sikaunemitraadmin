
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Plus, FileImage, Copy, ExternalLink, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fetchMedia = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:4000/api/media', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch media');
  return response.json();
};

export default function Media() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: media, isLoading, error, refetch } = useQuery({
    queryKey: ['media'],
    queryFn: fetchMedia
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setUploading(true);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:4000/api/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      
      toast.success('File uploaded successfully');
      setIsOpen(false);
      setFile(null);
      refetch();
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(`http://localhost:4000${path}`);
    toast.success('Path copied to clipboard');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      
      toast.success('File deleted successfully');
      refetch();
      
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Error deleting file');
    }
  };

  const isImage = (type: string) => type.startsWith('image/');

  const columns = [
    {
      accessorKey: "file_name",
      header: "File Name"
    },
    {
      accessorKey: "file_type",
      header: "Type"
    },
    {
      accessorKey: "file_size",
      header: "Size",
      cell: ({ row }: any) => {
        const sizeInKb = Math.round(row.original.file_size / 1024);
        return sizeInKb > 1024 
          ? `${(sizeInKb / 1024).toFixed(2)} MB` 
          : `${sizeInKb} KB`;
      }
    },
    {
      accessorKey: "created_at",
      header: "Uploaded",
      cell: ({ row }: any) => {
        return new Date(row.original.created_at).toLocaleDateString();
      }
    },
    {
      accessorKey: "file_path",
      header: "Preview",
      cell: ({ row }: any) => {
        if (isImage(row.original.file_type)) {
          return (
            <div className="relative w-10 h-10 overflow-hidden rounded border">
              <img 
                src={`http://localhost:4000${row.original.file_path}`}
                alt={row.original.file_name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          );
        }
        return <FileImage className="h-5 w-5 text-gray-500" />;
      }
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCopyPath(row.original.file_path)}
            title="Copy path"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open(`http://localhost:4000${row.original.file_path}`, '_blank')}
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500"
            onClick={() => handleDelete(row.original.id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const renderGallery = () => {
    if (!media || media.length === 0) return null;

    const images = media.filter(item => isImage(item.file_type));
    
    if (images.length === 0) return null;

    return (
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Image Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative pb-[100%]"> {/* 1:1 aspect ratio */}
                  <img 
                    src={`http://localhost:4000${item.file_path}`}
                    alt={item.file_name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 text-xs truncate">{item.file_name}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) return <div className="p-4">Loading media...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading media</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload New File
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={media || []}
        searchKey="file_name"
      />

      {renderGallery()}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New File</DialogTitle>
            <DialogDescription>
              Select a file from your computer to upload to the media library.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  required
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
              <Button type="submit" disabled={!file || uploading}>
                <Image className="mr-2 h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
