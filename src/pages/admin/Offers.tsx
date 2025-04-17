
import { useState } from "react";
import { Tag, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, X, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Sample data
const offersData = [
  {
    id: "1",
    title: "Early Bird Discount",
    code: "EARLYBIRD25",
    discount: "25%",
    type: "Percentage",
    validFrom: "Jun 01, 2023",
    validUntil: "Jul 15, 2023",
    status: "Active",
    appliesTo: "All Courses",
    usageCount: 153
  },
  {
    id: "2",
    title: "Summer Special",
    code: "SUMMER2023",
    discount: "30%",
    type: "Percentage",
    validFrom: "Jul 01, 2023",
    validUntil: "Aug 31, 2023",
    status: "Active",
    appliesTo: "Selected Courses",
    usageCount: 87
  },
  {
    id: "3",
    title: "New User Offer",
    code: "NEWUSER",
    discount: "Rs. 500",
    type: "Fixed Amount",
    validFrom: "Jan 01, 2023",
    validUntil: "Dec 31, 2023",
    status: "Active",
    appliesTo: "First Purchase",
    usageCount: 312
  },
  {
    id: "4",
    title: "Flash Sale",
    code: "FLASH50",
    discount: "50%",
    type: "Percentage",
    validFrom: "May 15, 2023",
    validUntil: "May 20, 2023",
    status: "Expired",
    appliesTo: "Selected Courses",
    usageCount: 89
  },
  {
    id: "5",
    title: "Festive Offer",
    code: "DASHAIN2023",
    discount: "40%",
    type: "Percentage",
    validFrom: "Oct 01, 2023",
    validUntil: "Oct 31, 2023",
    status: "Scheduled",
    appliesTo: "All Courses",
    usageCount: 0
  },
];

const Offers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  const filteredOffers = offersData.filter(offer => 
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.appliesTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (id: string) => {
    navigate(`/admin/offers/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/offers/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    setSelectedOfferId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real application, you would delete the offer from the database
    toast({
      title: "Offer deleted",
      description: "The offer has been deleted successfully.",
    });
    setDeleteDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success";
      case "Expired": return "secondary";
      case "Scheduled": return "warning";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Tag className="mr-2 h-8 w-8" />
            Offers & Discounts
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage promotional offers and discount codes
          </p>
        </div>
        <Button onClick={() => navigate("/admin/offers/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Offer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>All Offers</CardTitle>
              <CardDescription>
                {filteredOffers.length} offers found
              </CardDescription>
            </div>
            <div className="w-full sm:w-auto flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search offers..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offer</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.length > 0 ? (
                  filteredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{offer.title}</p>
                          <p className="text-sm text-muted-foreground">{offer.appliesTo}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{offer.code}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{offer.discount}</span>
                        <span className="text-xs text-muted-foreground ml-1">({offer.type})</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(offer.status) as any}>{offer.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-sm">{offer.validFrom} to {offer.validUntil}</span>
                        </div>
                      </TableCell>
                      <TableCell>{offer.usageCount} uses</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(offer.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(offer.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(offer.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No offers found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this offer?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the offer
              and make the discount code invalid.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
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

export default Offers;
