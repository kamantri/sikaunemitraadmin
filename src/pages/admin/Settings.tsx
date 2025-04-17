
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Save, 
  Upload,
  AlertTriangle,
  User,
  Mail,
  Bell,
  Lock,
  Globe,
  Database,
  Shield,
  Key
} from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Button onClick={() => toast.success("Settings saved successfully")}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure general platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Platform Name</Label>
                <Input id="site-name" defaultValue="Sikau" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-description">Platform Description</Label>
                <Input id="site-description" defaultValue="Online learning platform for students and professionals" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" defaultValue="support@sikau.edu" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="support-phone">Support Phone</Label>
                <Input id="support-phone" defaultValue="+1 (555) 123-4567" />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="text-base font-medium">Logo & Branding</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-md bg-gray-100 flex items-center justify-center">
                    <span className="text-2xl font-bold">SK</span>
                  </div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Logo
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label className="text-base font-medium">Platform Features</Label>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="comments">Enable User Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to leave comments on courses and blogs
                    </p>
                  </div>
                  <Switch id="comments" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="registration">Public Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register on the platform
                    </p>
                  </div>
                  <Switch id="registration" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the platform in maintenance mode (only admins can access)
                    </p>
                  </div>
                  <Switch id="maintenance" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure timezone and localization preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <select id="timezone" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="EST" selected>EST (Eastern Standard Time)</option>
                    <option value="PST">PST (Pacific Standard Time)</option>
                    <option value="IST">IST (Indian Standard Time)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <select id="language" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                    <option value="en" selected>English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <select id="date-format" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                    <option value="MM/DD/YYYY" selected>MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <select id="currency" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                    <option value="USD" selected>USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-detect">Auto-detect User Location</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically set timezone and language based on user location
                  </p>
                </div>
                <Switch id="auto-detect" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure which email notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="user-sign-up">User Sign-up</Label>
                  <p className="text-sm text-muted-foreground">
                    Send welcome email when a new user registers
                  </p>
                </div>
                <Switch id="user-sign-up" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="course-enrollment">Course Enrollment</Label>
                  <p className="text-sm text-muted-foreground">
                    Send confirmation when a user enrolls in a course
                  </p>
                </div>
                <Switch id="course-enrollment" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="course-completion">Course Completion</Label>
                  <p className="text-sm text-muted-foreground">
                    Send certificate email when a user completes a course
                  </p>
                </div>
                <Switch id="course-completion" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-content">New Content</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify users when new courses or content is published
                  </p>
                </div>
                <Switch id="new-content" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Send promotional emails about special offers
                  </p>
                </div>
                <Switch id="marketing" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Admin Notifications</CardTitle>
              <CardDescription>Configure notifications for administrators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="admin-user-sign-up">New User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a new user registers
                  </p>
                </div>
                <Switch id="admin-user-sign-up" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="admin-purchase">New Purchase</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a course is purchased
                  </p>
                </div>
                <Switch id="admin-purchase" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="admin-contact">Contact Form Submissions</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a user submits the contact form
                  </p>
                </div>
                <Switch id="admin-contact" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="admin-review">New Reviews</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a course receives a new review
                  </p>
                </div>
                <Switch id="admin-review" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="admin-error">System Errors</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about system errors and exceptions
                  </p>
                </div>
                <Switch id="admin-error" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Settings</CardTitle>
              <CardDescription>Configure user authentication options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="min-password">Minimum Password Length</Label>
                <Input id="min-password" type="number" defaultValue="8" min="6" max="24" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="password-complexity">Require Complex Passwords</Label>
                  <p className="text-sm text-muted-foreground">
                    Passwords must include uppercase, lowercase, numbers, and symbols
                  </p>
                </div>
                <Switch id="password-complexity" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require two-factor authentication for all administrator accounts
                  </p>
                </div>
                <Switch id="two-factor-auth" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="session-timeout">Auto-Logout After Inactivity</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out users after a period of inactivity
                  </p>
                </div>
                <Switch id="session-timeout" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session-duration">Session Duration (minutes)</Label>
                <Input id="session-duration" type="number" defaultValue="60" min="15" max="1440" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="social-login">Allow Social Login</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable sign-in with Google, Facebook, and other social accounts
                  </p>
                </div>
                <Switch id="social-login" defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Configure data privacy and retention options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-collection">User Data Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Collect usage data to improve platform experience
                  </p>
                </div>
                <Switch id="data-collection" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cookie-consent">Require Cookie Consent</Label>
                  <p className="text-sm text-muted-foreground">
                    Show cookie consent banner to comply with privacy regulations
                  </p>
                </div>
                <Switch id="cookie-consent" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data-retention">User Data Retention Period (days)</Label>
                <p className="text-sm text-muted-foreground">
                  How long to retain user data after account deletion
                </p>
                <Input id="data-retention" type="number" defaultValue="90" min="30" max="365" />
              </div>
              
              <div className="p-4 border rounded-md bg-yellow-50 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Data Protection Notice</h4>
                  <p className="text-sm text-yellow-700">
                    Make sure all privacy settings comply with relevant data protection regulations 
                    such as GDPR, CCPA, and other applicable laws in your region.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Configure the visual appearance of the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="color-theme">Color Theme</Label>
                  <select id="color-theme" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                    <option value="default" selected>Default</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Preference</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input id="primary-color" type="color" defaultValue="#4f46e5" className="w-12 h-10 p-1" />
                    <Input defaultValue="#4f46e5" className="flex-1" />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="font-family">Font Family</Label>
                  <select id="font-family" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                    <option value="inter" selected>Inter</option>
                    <option value="roboto">Roboto</option>
                    <option value="open-sans">Open Sans</option>
                    <option value="montserrat">Montserrat</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font-size">Base Font Size</Label>
                  <select id="font-size" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                    <option value="small">Small</option>
                    <option value="medium" selected>Medium</option>
                    <option value="large">Large</option>
                    <option value="x-large">Extra Large</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="rounded-corners">Rounded Corners</Label>
                  <p className="text-sm text-muted-foreground">
                    Use rounded corners for buttons and cards
                  </p>
                </div>
                <Switch id="rounded-corners" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations">Enable Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Show subtle animations for UI interactions
                  </p>
                </div>
                <Switch id="animations" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="custom-css">Allow Custom CSS</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable administrators to add custom CSS styles
                  </p>
                </div>
                <Switch id="custom-css" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>Configure the layout and structure of pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="layout-type">Dashboard Layout</Label>
                <select id="layout-type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                  <option value="sidebar" selected>Sidebar Navigation</option>
                  <option value="top-nav">Top Navigation</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content-width">Content Width</Label>
                <select id="content-width" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                  <option value="fixed" selected>Fixed Width</option>
                  <option value="full">Full Width</option>
                  <option value="contained">Contained</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sticky-header">Sticky Header</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep the header visible when scrolling down
                  </p>
                </div>
                <Switch id="sticky-header" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="collapsible-sidebar">Collapsible Sidebar</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to collapse the sidebar
                  </p>
                </div>
                <Switch id="collapsible-sidebar" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="footer-visibility">Show Footer</Label>
                  <p className="text-sm text-muted-foreground">
                    Display the footer on all pages
                  </p>
                </div>
                <Switch id="footer-visibility" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Integrations</CardTitle>
              <CardDescription>Configure payment processing options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 12C16 9.79 14.21 8 12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 18C22 19.1 21.1 20 20 20C18.9 20 18 19.1 18 18C18 16.9 18.9 16 20 16C21.1 16 22 16.9 22 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <Label htmlFor="stripe">Stripe</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Process payments via Stripe
                  </p>
                </div>
                <Switch id="stripe" defaultChecked />
              </div>
              
              <div className="space-y-2 ml-7">
                <Label htmlFor="stripe-key">API Key</Label>
                <Input id="stripe-key" type="password" defaultValue="sk_test_****************************" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 15C9 12.5 10 10 15 10C20 10 21 12.5 21 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 10C7.5 10 5 8.5 5 5C5 3.5 6 2 9 2C12 2 13 3.5 13 5C13 8.5 10.5 10 10 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 15C14.5 15 12 13.5 12 10C12 8.5 13 7 16 7C19 7 20 8.5 20 10C20 13.5 17.5 15 17 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.1 21.4C8.9 21.8 8.5 22 8 22H4C3.4 22 3 21.6 3 21V20.9C3 19.3 4.3 18 5.9 18H9C9.6 18 10 18.4 10 19V21.4C10 21.7 9.9 22 9.8 22.2C9.7 22.4 9.5 22.5 9.3 22.6C9.2 22.6 9.2 21.8 9.1 21.4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 22H18C17.5 22 17.1 21.8 16.9 21.4C16.8 21.8 16.8 22.6 16.7 22.6C16.5 22.5 16.3 22.4 16.2 22.2C16.1 22 16 21.7 16 21.4V19C16 18.4 16.4 18 17 18H20.1C21.7 18 23 19.3 23 20.9V21C23 21.6 22.6 22 22 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Process payments via PayPal
                  </p>
                </div>
                <Switch id="paypal" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="tax-calculations">Automatic Tax Calculations</Label>
                  <p className="text-sm text-muted-foreground">
                    Calculate and apply taxes based on customer location
                  </p>
                </div>
                <Switch id="tax-calculations" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="invoices">Generate Invoices</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate PDF invoices for purchases
                  </p>
                </div>
                <Switch id="invoices" defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>External Services</CardTitle>
              <CardDescription>Connect to third-party services and APIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <Label htmlFor="mailchimp">Mailchimp</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sync user data with Mailchimp for email marketing
                  </p>
                </div>
                <Switch id="mailchimp" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    <Label htmlFor="google-analytics">Google Analytics</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track user behavior with Google Analytics
                  </p>
                </div>
                <Switch id="google-analytics" defaultChecked />
              </div>
              
              <div className="space-y-2 ml-7">
                <Label htmlFor="ga-tracking-id">Tracking ID</Label>
                <Input id="ga-tracking-id" defaultValue="UA-123456789-1" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    <Label htmlFor="aws-s3">AWS S3 Storage</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Store uploaded files in Amazon S3
                  </p>
                </div>
                <Switch id="aws-s3" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    <Label htmlFor="oauth">OAuth Providers</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enable login with Google, Facebook, and other OAuth providers
                  </p>
                </div>
                <Switch id="oauth" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
