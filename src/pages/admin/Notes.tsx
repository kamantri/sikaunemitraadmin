
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Trash2, Plus, FileText, Eye, File, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const fetchNotes = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:4000/api/notes', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch notes');
  return response.json();
};

export default function Notes() {
  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    grade: '',
    subject: '',
    price: '0',
    fileUrl: '',
    fileType: ''
  });

  const { data: notes, isLoading, error, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes
  });

  const handleOpenDialog = (note?: any) => {
    if (note) {
      setSelectedNote(note);
      setFormData({
        title: note.title || '',
        content: note.content || '',
        category: note.category || '',
        grade: note.grade || '',
        subject: note.subject || '',
        price: note.price?.toString() || '0',
        fileUrl: note.file_url || '',
        fileType: note.file_type || ''
      });
    } else {
      setSelectedNote(null);
      setFormData({
        title: '',
        content: '',
        category: '',
        grade: '',
        subject: '',
        price: '0',
        fileUrl: '',
        fileType: ''
      });
    }
    setIsOpen(true);
  };

  const handleViewNote = (note: any) => {
    setSelectedNote(note);
    setIsViewOpen(true);
  };

  const handleDeletePrompt = (note: any) => {
    setSelectedNote(note);
    setIsDeleteOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = selectedNote 
        ? `http://localhost:4000/api/notes/${selectedNote.id}`
        : 'http://localhost:4000/api/notes';
      
      const method = selectedNote ? 'PUT' : 'POST';
      
      const noteData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(noteData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save note');
      }
      
      toast.success(selectedNote ? 'Note updated successfully' : 'Note created successfully');
      setIsOpen(false);
      refetch();
      
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Error saving note');
    }
  };

  const handleDelete = async () => {
    if (!selectedNote) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/notes/${selectedNote.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
      
      toast.success('Note deleted successfully');
      setIsDeleteOpen(false);
      refetch();
      
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Error deleting note');
    }
  };

  const handleTogglePinned = async (noteId: number, isPinned: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/notes/${noteId}/pin`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle pin status');
      }
      
      toast.success(`Note ${isPinned ? 'unpinned' : 'pinned'} successfully`);
      refetch();
      
    } catch (error) {
      console.error('Error toggling pin status:', error);
      toast.error('Error updating note');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }: any) => (
        <div className="flex items-center">
          {row.original.pinned && <Pin className="h-3 w-3 mr-2 text-amber-500" />}
          <span>{row.original.title}</span>
        </div>
      )
    },
    {
      accessorKey: "category",
      header: "Category"
    },
    {
      accessorKey: "subject",
      header: "Subject"
    },
    {
      accessorKey: "grade",
      header: "Grade"
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }: any) => `$${Number(row.original.price).toFixed(2)}`
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }: any) => formatDate(row.original.created_at)
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewNote(row.original)}
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
            title={row.original.pinned ? "Unpin" : "Pin"}
            onClick={() => handleTogglePinned(row.original.id, row.original.pinned)}
          >
            <Pin className={`h-4 w-4 ${row.original.pinned ? "text-amber-500" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500"
            onClick={() => handleDeletePrompt(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) return <div className="p-4">Loading notes...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading notes</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            Study Notes
          </h1>
          <p className="text-muted-foreground">
            Manage study materials and lecture notes
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Note
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={notes || []}
        searchKey="title"
      />

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Note Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedNote && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{selectedNote.title}</h2>
                  <Badge>{selectedNote.category}</Badge>
                </div>
                <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
                  <span>Grade: {selectedNote.grade || 'N/A'}</span>
                  <span>•</span>
                  <span>Subject: {selectedNote.subject || 'N/A'}</span>
                </div>
              </div>
              
              {selectedNote.file_url && (
                <div className="border rounded-md p-3 bg-muted/30 flex items-center gap-3">
                  <File className="h-6 w-6 text-blue-500" />
                  <div className="flex-1">
                    <a href={`http://localhost:4000${selectedNote.file_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      View attached document
                    </a>
                    <p className="text-xs text-muted-foreground">{selectedNote.file_type}</p>
                  </div>
                </div>
              )}
              
              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-medium mb-2">Content:</h3>
                <div className="whitespace-pre-wrap">{selectedNote.content}</div>
              </div>
              
              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <span className="text-sm font-medium">Price: </span>
                  <span className="text-lg font-bold">${Number(selectedNote.price).toFixed(2)}</span>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsViewOpen(false);
                      handleOpenDialog(selectedNote);
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

      {/* Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedNote ? 'Edit Note' : 'Create New Note'}</DialogTitle>
            <DialogDescription>
              {selectedNote
                ? "Edit your note details below"
                : "Fill in the details to create a new study note"}
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
                  rows={6}
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fileUrl">File URL (optional)</Label>
                <Input
                  id="fileUrl"
                  name="fileUrl"
                  value={formData.fileUrl}
                  onChange={handleInputChange}
                  placeholder="e.g. /uploads/file.pdf"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fileType">File Type (optional)</Label>
                <Input
                  id="fileType"
                  name="fileType"
                  value={formData.fileType}
                  onChange={handleInputChange}
                  placeholder="e.g. application/pdf"
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
                <FileText className="mr-2 h-4 w-4" />
                {selectedNote ? 'Update' : 'Create'} Note
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
