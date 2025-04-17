
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  FileQuestion, 
  Plus, 
  Search, 
  ChevronDown,
  ChevronUp, 
  Edit2, 
  Trash2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { useState } from "react";
import { toast } from "sonner";

// FAQ Category Type
type FAQCategory = {
  id: number;
  name: string;
  faqs: FAQ[];
};

// FAQ Type
type FAQ = {
  id: number;
  question: string;
  answer: string;
  isExpanded?: boolean;
  category: string;
  tags: string[];
};

const FAQsPage = () => {
  // Mock Data
  const faqCategories: FAQCategory[] = [
    {
      id: 1,
      name: "Getting Started",
      faqs: [
        {
          id: 1,
          question: "How do I create an account?",
          answer: "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill in your details including name, email, and password. You'll receive a verification email to confirm your account.",
          category: "Getting Started",
          tags: ["account", "registration", "sign up"]
        },
        {
          id: 2,
          question: "Is there a mobile app available?",
          answer: "Yes, we offer mobile apps for both iOS and Android platforms. You can download them from the App Store or Google Play Store by searching for 'Sikau'.",
          category: "Getting Started",
          tags: ["mobile", "app", "download"]
        },
        {
          id: 3,
          question: "How do I reset my password?",
          answer: "Click on the 'Forgot Password' link on the login page. Enter your email address and we'll send you instructions to reset your password. Check your spam folder if you don't see the email in your inbox.",
          category: "Getting Started",
          tags: ["password", "reset", "forgot"]
        }
      ]
    },
    {
      id: 2,
      name: "Courses",
      faqs: [
        {
          id: 4,
          question: "How do I enroll in a course?",
          answer: "Browse our course catalog and select the course you're interested in. On the course page, click the 'Enroll' button. If it's a paid course, you'll be directed to the payment page. For free courses, you'll get immediate access.",
          category: "Courses",
          tags: ["enrollment", "courses", "register"]
        },
        {
          id: 5,
          question: "Can I download course materials for offline use?",
          answer: "Yes, most course materials can be downloaded for offline use. Look for the download icon next to videos, PDFs, and other resources. Note that some premium content may have download restrictions.",
          category: "Courses",
          tags: ["download", "offline", "materials"]
        },
        {
          id: 6,
          question: "What happens if I can't complete a course in time?",
          answer: "Our courses are self-paced, so you can take as much time as you need. Once enrolled, you have lifetime access to the course materials. For courses with specific schedules, you can request an extension by contacting support.",
          category: "Courses",
          tags: ["deadlines", "completion", "time"]
        }
      ]
    },
    {
      id: 3,
      name: "Payments",
      faqs: [
        {
          id: 7,
          question: "What payment methods do you accept?",
          answer: "We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, and mobile payment options like Apple Pay and Google Pay. For some regions, we also support local payment methods.",
          category: "Payments",
          tags: ["payment", "credit card", "paypal"]
        },
        {
          id: 8,
          question: "How do refunds work?",
          answer: "If you're unsatisfied with a course, you can request a refund within 30 days of purchase. Go to your account settings, select the course, and click 'Request Refund'. Our team will review your request within 48 hours.",
          category: "Payments",
          tags: ["refund", "money back", "return"]
        },
        {
          id: 9,
          question: "Are there any discounts for bulk purchases?",
          answer: "Yes, we offer discounts for organizations or individuals purchasing multiple courses. Contact our sales team at sales@sikau.edu for information about bulk pricing and enterprise packages.",
          category: "Payments",
          tags: ["discount", "bulk", "organization"]
        }
      ]
    },
    {
      id: 4,
      name: "Technical Support",
      faqs: [
        {
          id: 10,
          question: "What should I do if videos won't play?",
          answer: "First, check your internet connection. Try refreshing the page or using a different browser. Make sure your browser is updated to the latest version. If problems persist, clear your browser cache and cookies, or contact our support team.",
          category: "Technical Support",
          tags: ["video", "playback", "streaming"]
        },
        {
          id: 11,
          question: "How do I contact technical support?",
          answer: "You can reach our technical support team through the 'Help' button in the bottom right corner of any page, by emailing support@sikau.edu, or by using the live chat feature during business hours (9AM-6PM EST, Monday-Friday).",
          category: "Technical Support",
          tags: ["contact", "help", "support"]
        }
      ]
    }
  ];

  // State for expanded FAQ items
  const [expandedFAQs, setExpandedFAQs] = useState<Record<number, boolean>>({});

  const toggleFAQ = (id: number) => {
    setExpandedFAQs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <Button onClick={() => toast.success("Add FAQ clicked")}>
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All FAQs</CardTitle>
                  <CardDescription>Manage your frequently asked questions</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search FAQs..." className="pl-8 w-[200px] md:w-[260px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqCategories.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <FileQuestion className="h-5 w-5 text-primary" />
                      {category.name}
                      <Badge variant="outline">{category.faqs.length}</Badge>
                    </h3>
                    <div className="space-y-2">
                      {category.faqs.map((faq) => (
                        <Collapsible
                          key={faq.id}
                          open={expandedFAQs[faq.id]}
                          onOpenChange={() => toggleFAQ(faq.id)}
                          className="border rounded-md overflow-hidden"
                        >
                          <CollapsibleTrigger className="w-full">
                            <div className="flex justify-between items-center p-4 hover:bg-muted/50 cursor-pointer">
                              <div className="font-medium text-left">{faq.question}</div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.info(`Editing: ${faq.question}`);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.error(`Deleted: ${faq.question}`);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                {expandedFAQs[faq.id] ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="p-4 pt-0 border-t">
                              <p className="text-muted-foreground">{faq.answer}</p>
                              <div className="flex gap-2 mt-2">
                                {faq.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="cursor-pointer">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>FAQ Categories</CardTitle>
              <CardDescription>Organize your FAQs by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {faqCategories.map((category) => (
                  <div 
                    key={category.id} 
                    className="flex justify-between items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => toast.info(`Selected category: ${category.name}`)}
                  >
                    <span>{category.name}</span>
                    <Badge variant="outline">{category.faqs.length}</Badge>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => toast.success("Add category clicked")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>FAQ Management</CardTitle>
              <CardDescription>Common actions for FAQs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("Import FAQs clicked")}
                >
                  Import FAQs
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("Export FAQs clicked")}
                >
                  Export FAQs
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("Generate from AI clicked")}
                >
                  Generate from AI
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("Reorder FAQs clicked")}
                >
                  Reorder FAQs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
