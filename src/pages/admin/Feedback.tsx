
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Filter, 
  MessageCircle, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Mail, 
  Flag, 
  BarChart2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Feedback = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "new" | "replied" | "resolved" | "pending";
  source: "contact" | "review" | "survey" | "app";
  rating?: number;
  priority: "low" | "medium" | "high" | "urgent";
};

const FeedbackPage = () => {
  const feedback: Feedback[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      subject: "Course Navigation Issues",
      message: "I'm having trouble navigating between course modules. The 'Next' button isn't working consistently, and sometimes it skips chapters.",
      date: "2023-09-15",
      status: "new",
      source: "contact",
      priority: "medium"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      subject: "Amazing Python Course",
      message: "I just completed the Python for Beginners course and it was fantastic! The instructor explained concepts clearly and the projects were engaging.",
      date: "2023-09-14",
      status: "replied",
      source: "review",
      rating: 5,
      priority: "low"
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      subject: "Certificate Download Error",
      message: "I completed a course but I'm unable to download my certificate. Every time I click the download button, I get an error saying 'Request failed'.",
      date: "2023-09-12",
      status: "pending",
      source: "contact",
      priority: "high"
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      subject: "Content Suggestion",
      message: "I would love to see more advanced courses on artificial intelligence and machine learning. The current offerings are great for beginners but we need more in-depth material.",
      date: "2023-09-10",
      status: "new",
      source: "survey",
      priority: "low"
    },
    {
      id: 5,
      name: "David Taylor",
      email: "david.taylor@example.com",
      subject: "Mobile App Crashes",
      message: "The iOS app keeps crashing when I try to watch videos in full screen mode. I'm using an iPhone 12 with the latest iOS version.",
      date: "2023-09-08",
      status: "resolved",
      source: "app",
      priority: "urgent"
    },
    {
      id: 6,
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      subject: "Payment Issue",
      message: "I was charged twice for the same course. My bank statement shows two identical transactions on September 2nd. Please help resolve this issue.",
      date: "2023-09-05",
      status: "pending",
      source: "contact",
      priority: "urgent"
    },
    {
      id: 7,
      name: "Robert Garcia",
      email: "robert.garcia@example.com",
      subject: "Course Content Outdated",
      message: "The JavaScript Frameworks course contains information about React that is outdated. Many of the examples use deprecated APIs and don't work with current versions.",
      date: "2023-09-01",
      status: "new",
      source: "review",
      rating: 2,
      priority: "medium"
    }
  ];

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'replied': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: Feedback['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-500';
      case 'medium': return 'bg-blue-500';
      case 'high': return 'bg-yellow-500';
      case 'urgent': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getSourceIcon = (source: Feedback['source']) => {
    switch (source) {
      case 'contact': return <Mail className="h-4 w-4" />;
      case 'review': return <Star className="h-4 w-4" />;
      case 'survey': return <BarChart2 className="h-4 w-4" />;
      case 'app': return <Flag className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        <Badge variant="outline" className="cursor-pointer" onClick={() => toast.info("Generating report")}>
          Generate Report
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Feedback Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Satisfaction Rate</span>
                  <span>78%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">New</span>
                  </div>
                  <span className="text-sm font-medium">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Replied</span>
                  </div>
                  <span className="text-sm font-medium">27</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Resolved</span>
                  </div>
                  <span className="text-sm font-medium">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="text-sm font-medium">12</span>
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="text-sm font-medium mb-2">By Source</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Contact Form</span>
                    </div>
                    <span className="text-sm font-medium">42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Reviews</span>
                    </div>
                    <span className="text-sm font-medium">36</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Surveys</span>
                    </div>
                    <span className="text-sm font-medium">18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-red-500" />
                      <span className="text-sm">App Feedback</span>
                    </div>
                    <span className="text-sm font-medium">6</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Sentiment</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">65%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsDown className="h-4 w-4 text-red-500" />
                      <span className="text-sm">35%</span>
                    </div>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>All Feedback</CardTitle>
                  <CardDescription>View and manage user feedback</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search feedback..." className="pl-8 w-[200px] md:w-[260px]" />
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
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  <div className="rounded-md border">
                    {feedback.map((item) => (
                      <div 
                        key={item.id} 
                        className="border-b last:border-0 p-4 hover:bg-muted/50 cursor-pointer"
                        onClick={() => toast.info(`Viewing feedback from ${item.name}`)}
                      >
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              {item.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {getSourceIcon(item.source)}
                              <span className="ml-1 text-xs capitalize">{item.source}</span>
                            </div>
                            <div className={`h-2 w-2 rounded-full ${getPriorityColor(item.priority)}`}></div>
                            <div className={`h-2 w-2 rounded-full ${getStatusColor(item.status)}`}></div>
                            <div className="text-xs text-muted-foreground">{item.date}</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">{item.subject}</div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.message}
                          </p>
                        </div>
                        {item.rating && (
                          <div className="flex items-center mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < item.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex gap-1">
                            <Badge variant={item.priority === 'urgent' ? 'destructive' : item.priority === 'high' ? 'default' : 'secondary'}>
                              {item.priority}
                            </Badge>
                            <Badge variant={
                              item.status === 'new' ? 'outline' : 
                              item.status === 'replied' ? 'secondary' : 
                              item.status === 'resolved' ? 'default' : 'outline'
                            }>
                              {item.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.success(`Replied to ${item.name}`);
                              }}
                            >
                              Reply
                            </Button>
                            {item.status !== 'resolved' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success(`Marked ${item.subject} as resolved`);
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Mark Resolved
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="new">
                  <div className="rounded-md border">
                    {feedback
                      .filter(item => item.status === 'new')
                      .map((item) => (
                        <div 
                          key={item.id} 
                          className="border-b last:border-0 p-4 hover:bg-muted/50 cursor-pointer"
                          onClick={() => toast.info(`Viewing feedback from ${item.name}`)}
                        >
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                {item.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-muted-foreground">{item.email}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {getSourceIcon(item.source)}
                                <span className="ml-1 text-xs capitalize">{item.source}</span>
                              </div>
                              <div className={`h-2 w-2 rounded-full ${getPriorityColor(item.priority)}`}></div>
                              <div className="text-xs text-muted-foreground">{item.date}</div>
                            </div>
                          </div>
                          <div>
                            <div className="font-medium mb-1">{item.subject}</div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.message}
                            </p>
                          </div>
                          {item.rating && (
                            <div className="flex items-center mt-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < item.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          )}
                          <div className="flex justify-between items-center mt-2">
                            <Badge variant={item.priority === 'urgent' ? 'destructive' : item.priority === 'high' ? 'default' : 'secondary'}>
                              {item.priority}
                            </Badge>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success(`Replied to ${item.name}`);
                                }}
                              >
                                Reply
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success(`Marked ${item.subject} as resolved`);
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Mark Resolved
                              </Button>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="pending">
                  <div className="rounded-md border">
                    {feedback
                      .filter(item => item.status === 'pending')
                      .map((item) => (
                        // ... similar structure to 'new' tab
                        <div 
                          key={item.id} 
                          className="border-b last:border-0 p-4 hover:bg-muted/50 cursor-pointer"
                          onClick={() => toast.info(`Viewing feedback from ${item.name}`)}
                        >
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                {item.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-muted-foreground">{item.email}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {getSourceIcon(item.source)}
                                <span className="ml-1 text-xs capitalize">{item.source}</span>
                              </div>
                              <div className={`h-2 w-2 rounded-full ${getPriorityColor(item.priority)}`}></div>
                              <div className="text-xs text-muted-foreground">{item.date}</div>
                            </div>
                          </div>
                          <div>
                            <div className="font-medium mb-1">{item.subject}</div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.message}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <Badge variant={item.priority === 'urgent' ? 'destructive' : item.priority === 'high' ? 'default' : 'secondary'}>
                              {item.priority}
                            </Badge>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success(`Follow up with ${item.name}`);
                                }}
                              >
                                Follow Up
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success(`Marked ${item.subject} as resolved`);
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Mark Resolved
                              </Button>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="resolved">
                  <div className="rounded-md border">
                    {feedback
                      .filter(item => item.status === 'resolved')
                      .map((item) => (
                        // ... similar structure to 'new' tab
                        <div 
                          key={item.id} 
                          className="border-b last:border-0 p-4 hover:bg-muted/50 cursor-pointer"
                          onClick={() => toast.info(`Viewing feedback from ${item.name}`)}
                        >
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                {item.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-muted-foreground">{item.email}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {getSourceIcon(item.source)}
                                <span className="ml-1 text-xs capitalize">{item.source}</span>
                              </div>
                              <div className={`h-2 w-2 rounded-full ${getPriorityColor(item.priority)}`}></div>
                              <Badge variant="outline" className="text-green-500 border-green-500">Resolved</Badge>
                              <div className="text-xs text-muted-foreground">{item.date}</div>
                            </div>
                          </div>
                          <div>
                            <div className="font-medium mb-1">{item.subject}</div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.message}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <Badge variant="secondary">{item.priority}</Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.info(`Reopening ${item.subject}`);
                              }}
                            >
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Reopen
                            </Button>
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

export default FeedbackPage;
