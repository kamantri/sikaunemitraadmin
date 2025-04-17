
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  MoreVertical, 
  Plus, 
  Search, 
  Tag,
  Edit2,
  Trash2
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  parent?: string;
  children?: string[];
};

const CategoriesPage = () => {
  const categories: Category[] = [
    {
      id: 1,
      name: "Programming",
      slug: "programming",
      description: "Computer programming languages and development",
      count: 32,
      children: ["Web Development", "Mobile Development"]
    },
    {
      id: 2,
      name: "Web Development",
      slug: "web-development",
      description: "Frontend and backend web technologies",
      count: 18,
      parent: "Programming"
    },
    {
      id: 3,
      name: "Mobile Development",
      slug: "mobile-development",
      description: "iOS, Android and cross-platform development",
      count: 14,
      parent: "Programming"
    },
    {
      id: 4,
      name: "Data Science",
      slug: "data-science",
      description: "Analysis and processing of large datasets",
      count: 26,
      children: ["Machine Learning"]
    },
    {
      id: 5,
      name: "Machine Learning",
      slug: "machine-learning",
      description: "Algorithms and models for making predictions",
      count: 15,
      parent: "Data Science"
    },
    {
      id: 6,
      name: "Business",
      slug: "business",
      description: "Management, marketing, and entrepreneurship",
      count: 28,
      children: ["Marketing", "Finance"]
    },
    {
      id: 7,
      name: "Marketing",
      slug: "marketing",
      description: "Digital and traditional marketing strategies",
      count: 17,
      parent: "Business"
    },
    {
      id: 8,
      name: "Finance",
      slug: "finance",
      description: "Personal and corporate financial management",
      count: 11,
      parent: "Business"
    },
    {
      id: 9,
      name: "Design",
      slug: "design",
      description: "Graphic, UI/UX, and product design",
      count: 24
    },
    {
      id: 10,
      name: "Languages",
      slug: "languages",
      description: "Foreign language learning and practice",
      count: 19
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Button onClick={() => toast.success("Add category clicked")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>All Categories</CardTitle>
                  <CardDescription>Manage content classification categories</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search categories..." className="pl-8 w-[200px] md:w-[260px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b px-4 py-3 text-sm font-medium">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-3">Description</div>
                  <div className="col-span-2">Slug</div>
                  <div className="col-span-1 text-center">Items</div>
                  <div className="col-span-2">Actions</div>
                </div>
                
                {categories.map(category => (
                  <div key={category.id} className="grid grid-cols-12 items-center px-4 py-3 hover:bg-muted/50">
                    <div className="col-span-4 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium">{category.name}</div>
                        {category.parent && (
                          <div className="text-xs text-muted-foreground">
                            Parent: {category.parent}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-3 text-sm text-muted-foreground">{category.description}</div>
                    <div className="col-span-2 text-sm">/{category.slug}</div>
                    <div className="col-span-1 text-center">
                      <Badge variant="outline">{category.count}</Badge>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toast.info(`Editing ${category.name}`)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500"
                        onClick={() => toast.error(`Deleted ${category.name}`)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info(`View ${category.name} items`)}>
                            View Items
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info(`Add subcategory to ${category.name}`)}>
                            Add Subcategory
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info(`Set ${category.name} as featured`)}>
                            Set as Featured
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Category Structure</CardTitle>
              <CardDescription>View and organize category hierarchy</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              <div className="space-y-2">
                {categories
                  .filter(c => !c.parent)
                  .map(category => (
                    <div key={category.id} className="space-y-1">
                      <div 
                        className="flex justify-between items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => toast.info(`Selected ${category.name}`)}
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Badge variant="outline">{category.count}</Badge>
                      </div>
                      
                      {category.children && (
                        <div className="ml-6 pl-2 border-l space-y-1">
                          {category.children.map((childName, index) => {
                            const childCategory = categories.find(c => c.name === childName);
                            if (!childCategory) return null;
                            
                            return (
                              <div 
                                key={index}
                                className="flex justify-between items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                                onClick={() => toast.info(`Selected ${childName}`)}
                              >
                                <div className="flex items-center gap-2">
                                  <Tag className="h-4 w-4" />
                                  <span>{childName}</span>
                                </div>
                                <Badge variant="outline">{childCategory.count}</Badge>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>Quick actions for categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("Reorder categories clicked")}
                >
                  Reorder Categories
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("Bulk edit clicked")}
                >
                  Bulk Edit
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("Import categories clicked")}
                >
                  Import Categories
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("Export categories clicked")}
                >
                  Export Categories
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
