
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  attendees: number;
};

const EventsPage = () => {
  const events: Event[] = [
    {
      id: "1",
      title: "Annual Education Conference",
      date: "2023-10-15",
      location: "Virtual",
      status: "upcoming",
      attendees: 250,
    },
    {
      id: "2",
      title: "Teacher Development Workshop",
      date: "2023-09-05",
      location: "Main Campus",
      status: "completed",
      attendees: 45,
    },
    {
      id: "3",
      title: "Student Orientation",
      date: "2023-11-20",
      location: "Auditorium",
      status: "upcoming",
      attendees: 180,
    },
    {
      id: "4",
      title: "Online Learning Seminar",
      date: "2023-08-12",
      location: "Virtual",
      status: "completed",
      attendees: 120,
    },
    {
      id: "5",
      title: "Career Fair",
      date: "2023-10-25",
      location: "Exhibition Hall",
      status: "upcoming",
      attendees: 300,
    },
  ];

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge 
            variant={
              status === "upcoming" ? "outline" : 
              status === "ongoing" ? "default" : 
              status === "completed" ? "secondary" : 
              "destructive"
            }
          >
            {status}
          </Badge>
        );
      }
    },
    {
      accessorKey: "attendees",
      header: "Attendees",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast.success(`Viewing ${event.title}`)}
            >
              View
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast.success(`Editing ${event.title}`)}
            >
              Edit
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <Button onClick={() => toast.success("Create new event")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Events Calendar</CardTitle>
              <CardDescription>View and manage all scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6 border rounded-md mb-4">
                <div className="flex flex-col items-center text-center text-muted-foreground">
                  <Calendar className="h-10 w-10 mb-2" />
                  <p>Calendar view will be implemented here</p>
                </div>
              </div>
              <DataTable columns={columns} data={events} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events that will take place in the future</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={columns} 
                data={events.filter(event => event.status === "upcoming")} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="past" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Past Events</CardTitle>
              <CardDescription>Events that have already taken place</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={columns} 
                data={events.filter(event => event.status === "completed")} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsPage;
