
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookMarked, 
  FileText, 
  Filter, 
  Link, 
  MoreVertical, 
  Plus, 
  Search 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const ResourcesPage = () => {
  const resources = [
    { 
      id: 1, 
      title: "Beginner's Guide to Programming", 
      type: "document", 
      category: "Programming", 
      format: "PDF",
      views: 1250,
      downloads: 485,
      lastUpdated: "2023-09-15",
      status: "published"
    },
    { 
      id: 2, 
      title: "Mathematics Formula Sheet", 
      type: "document", 
      category: "Mathematics", 
      format: "PDF",
      views: 3120,
      downloads: 2210,
      lastUpdated: "2023-08-22",
      status: "published"
    },
    { 
      id: 3, 
      title: "Physics Laboratory Guide", 
      type: "document", 
      category: "Physics", 
      format: "PDF",
      views: 950,
      downloads: 630,
      lastUpdated: "2023-09-05",
      status: "published"
    },
    { 
      id: 4, 
      title: "English Literature Supplementary Readings", 
      type: "link", 
      category: "Literature", 
      format: "URL",
      views: 780,
      downloads: 0,
      lastUpdated: "2023-09-10",
      status: "published"
    },
    { 
      id: 5, 
      title: "Chemistry Lab Templates", 
      type: "document", 
      category: "Chemistry", 
      format: "DOCX",
      views: 540,
      downloads: 325,
      lastUpdated: "2023-08-18",
      status: "draft"
    },
  ];

  const categories = [
    { name: "Programming", count: 15 },
    { name: "Mathematics", count: 23 },
    { name: "Physics", count: 18 },
    { name: "Chemistry", count: 12 },
    { name: "Literature", count: 8 },
    { name: "History", count: 14 },
    { name: "Biology", count: 10 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <Button onClick={() => toast.success("Create resource clicked")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Resource Type</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="type-documents" />
                    <label htmlFor="type-documents" className="text-sm">Documents</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="type-videos" />
                    <label htmlFor="type-videos" className="text-sm">Videos</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="type-links" />
                    <label htmlFor="type-links" className="text-sm">External Links</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="type-templates" />
                    <label htmlFor="type-templates" className="text-sm">Templates</label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id={`category-${category.name.toLowerCase()}`} />
                        <label htmlFor={`category-${category.name.toLowerCase()}`} className="text-sm">{category.name}</label>
                      </div>
                      <Badge variant="outline">{category.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="status-published" />
                    <label htmlFor="status-published" className="text-sm">Published</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="status-draft" />
                    <label htmlFor="status-draft" className="text-sm">Draft</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="status-archived" />
                    <label htmlFor="status-archived" className="text-sm">Archived</label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Reset</Button>
                <Button className="flex-1">Apply</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>All Resources</CardTitle>
                  <CardDescription>Manage learning resources and materials</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search resources..." className="pl-8 w-[200px] md:w-[260px]" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All Resources</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="links">External Links</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-8 border-b px-4 py-3 text-sm font-medium">
                      <div className="col-span-3">Title</div>
                      <div className="col-span-1">Category</div>
                      <div className="col-span-1">Format</div>
                      <div className="col-span-1">Views</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-1">Actions</div>
                    </div>
                    {resources.map(resource => (
                      <div key={resource.id} className="grid grid-cols-8 items-center px-4 py-3 hover:bg-muted/50">
                        <div className="col-span-3 flex items-center gap-2">
                          {resource.type === 'document' ? (
                            <FileText className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Link className="h-4 w-4 text-green-500" />
                          )}
                          <span className="font-medium">{resource.title}</span>
                        </div>
                        <div className="col-span-1 text-sm">{resource.category}</div>
                        <div className="col-span-1 text-sm">{resource.format}</div>
                        <div className="col-span-1 text-sm">{resource.views.toLocaleString()}</div>
                        <div className="col-span-1">
                          <Badge variant={resource.status === 'published' ? 'default' : 'secondary'}>
                            {resource.status}
                          </Badge>
                        </div>
                        <div className="col-span-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toast.info(`Viewing ${resource.title}`)}>
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.info(`Editing ${resource.title}`)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success(`Downloaded ${resource.title}`)}>
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => toast.error(`Deleted ${resource.title}`)}
                                className="text-red-600"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="documents">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-8 border-b px-4 py-3 text-sm font-medium">
                      <div className="col-span-3">Title</div>
                      <div className="col-span-1">Category</div>
                      <div className="col-span-1">Format</div>
                      <div className="col-span-1">Views</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-1">Actions</div>
                    </div>
                    {resources
                      .filter(resource => resource.type === 'document')
                      .map(resource => (
                        <div key={resource.id} className="grid grid-cols-8 items-center px-4 py-3 hover:bg-muted/50">
                          <div className="col-span-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{resource.title}</span>
                          </div>
                          <div className="col-span-1 text-sm">{resource.category}</div>
                          <div className="col-span-1 text-sm">{resource.format}</div>
                          <div className="col-span-1 text-sm">{resource.views.toLocaleString()}</div>
                          <div className="col-span-1">
                            <Badge variant={resource.status === 'published' ? 'default' : 'secondary'}>
                              {resource.status}
                            </Badge>
                          </div>
                          <div className="col-span-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toast.info(`Viewing ${resource.title}`)}>
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.info(`Editing ${resource.title}`)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.success(`Downloaded ${resource.title}`)}>
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => toast.error(`Deleted ${resource.title}`)}
                                  className="text-red-600"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="links">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-8 border-b px-4 py-3 text-sm font-medium">
                      <div className="col-span-3">Title</div>
                      <div className="col-span-1">Category</div>
                      <div className="col-span-1">Format</div>
                      <div className="col-span-1">Views</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-1">Actions</div>
                    </div>
                    {resources
                      .filter(resource => resource.type === 'link')
                      .map(resource => (
                        <div key={resource.id} className="grid grid-cols-8 items-center px-4 py-3 hover:bg-muted/50">
                          <div className="col-span-3 flex items-center gap-2">
                            <Link className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{resource.title}</span>
                          </div>
                          <div className="col-span-1 text-sm">{resource.category}</div>
                          <div className="col-span-1 text-sm">{resource.format}</div>
                          <div className="col-span-1 text-sm">{resource.views.toLocaleString()}</div>
                          <div className="col-span-1">
                            <Badge variant={resource.status === 'published' ? 'default' : 'secondary'}>
                              {resource.status}
                            </Badge>
                          </div>
                          <div className="col-span-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toast.info(`Viewing ${resource.title}`)}>
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.info(`Editing ${resource.title}`)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.success(`Copied link for ${resource.title}`)}>
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => toast.error(`Deleted ${resource.title}`)}
                                  className="text-red-600"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
