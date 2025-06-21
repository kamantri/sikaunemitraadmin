import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";  // Remove TabsContent
import { Button } from "@/components/ui/button";
import { 
  Area,
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Line,  // Remove this unused import
  LineChart,  // Remove this unused import
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { 
  ArrowUpRight, 
  BarChart2,  // Remove this unused import
  BookOpen, 
  FileText, 
  GraduationCap, Megaphone,
  PlusCircle, 
  Users,
  StickyNote 
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AccessLocationMap from "@/components/admin/AccessLocationMap";

const data = [
  {
    name: "Jan",
    total: 1480,
  },
  {
    name: "Feb",
    total: 2304,
  },
  {
    name: "Mar",
    total: 2850,
  },
  {
    name: "Apr",
    total: 3200,
  },
  {
    name: "May",
    total: 2956,
  },
  {
    name: "Jun",
    total: 3967,
  },
  {
    name: "Jul",
    total: 4300,
  },
  {
    name: "Aug",
    total: 5120,
  },
  {
    name: "Sep",
    total: 6000,
  },
  {
    name: "Oct",
    total: 5400,
  },
  {
    name: "Nov",
    total: 4800,
  },
  {
    name: "Dec",
    total: 5840,
  },
];

const usersByMonth = [
  {
    name: "Jan",
    students: 580,
    teachers: 120,
  },
  {
    name: "Feb",
    students: 620,
    teachers: 130,
  },
  {
    name: "Mar",
    students: 700,
    teachers: 150,
  },
  {
    name: "Apr",
    students: 800,
    teachers: 180,
  },
  {
    name: "May",
    students: 870,
    teachers: 220,
  },
  {
    name: "Jun",
    students: 950,
    teachers: 230,
  },
];

const quickStats = [
  {
    title: "Total Users",
    value: "2,945",
    icon: Users,
    change: "+12.5%",
    changeType: "positive",
    link: "/admin/all-users"
  },
  {
    title: "Total Courses",
    value: "89",
    icon: BookOpen,
    change: "+7.2%",
    changeType: "positive",
    link: "/admin/courses"
  },{
    title: "Blog Posts",
    value: "157",
    icon: FileText,
    change: "+10.1%",
    changeType: "positive",
    link: "/admin/blogs"
  },
  // {
  //   title: "Active Teachers",
  //   value: "268",
  //   icon: GraduationCap,
  //   change: "+4.3%",
  //   changeType: "positive",
  //   link: "/admin/teachers"
  // },
  {
    title: "Ads",
    value: "157",
    icon: Megaphone,
    change: "+1.1%",
    changeType: "negative",
    link: "/admin/ads"
  },
  {
    title: "Study Notes",
    value: "245",
    icon: StickyNote,
    change: "+15.3%",
    changeType: "positive",
    link: "/admin/notes"
  }
];

const Dashboard = () => {
  const [chartView, setChartView] = useState("revenue");

  return (
    <div className="p-0 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/admin/courses">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Course
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/notes">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Note
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        {quickStats.map((stat, i) => (
          <Card key={i} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className={`mr-1 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span> 
                from last month
              </p>
              <Button asChild variant="ghost" className="p-0 h-auto mt-2 text-primary text-xs font-semibold">
                <Link to={stat.link} className="flex items-center">
                  View All
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Overview</CardTitle>
              <Tabs defaultValue="revenue" value={chartView} onValueChange={setChartView} className="w-[240px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>
              {chartView === "revenue" ? "Monthly revenue for the current year" : "New user registrations"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              {chartView === "revenue" ? (
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              ) : (
                <BarChart data={usersByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#8884d8" name="Students" />
                  <Bar dataKey="teachers" fill="#82ca9d" name="Teachers" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9 mr-3 bg-gray-100">
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">SA</span>
                </span>
                <div className="ml-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Sarita Adhikari</p>
                  <p className="text-sm text-muted-foreground">
                    Enrolled in "Advanced Nepali Literature"
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9 mr-3 bg-gray-100">
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">RB</span>
                </span>
                <div className="ml-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Ramesh Bhattarai</p>
                  <p className="text-sm text-muted-foreground">
                    Published new note: "Mathematics Formula Sheet"
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9 mr-3 bg-gray-100">
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-green-100 text-green-700 text-sm font-semibold">KP</span>
                </span>
                <div className="ml-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Kamal Pradhan</p>
                  <p className="text-sm text-muted-foreground">
                    Posted new blog article: "Importance of Cultural Education"
                  </p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9 mr-3 bg-gray-100">
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">SK</span>
                </span>
                <div className="ml-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Sushila Karki</p>
                  <p className="text-sm text-muted-foreground">
                    Updated course: "Beginner Nepali Language"
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AccessLocationMap className="col-span-1 lg:col-span-7" />
    </div>
  );
};

export default Dashboard;
