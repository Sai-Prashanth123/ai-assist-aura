import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { MeetingGenerator } from "@/components/MeetingGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, FileText, Video, Brain, Zap } from "lucide-react";

const stats = [
  { label: "Knowledge Files", value: "24", icon: FileText, color: "text-primary" },
  { label: "Active Meetings", value: "3", icon: Video, color: "text-accent" },
  { label: "AI Suggestions", value: "127", icon: Brain, color: "text-warning" },
  { label: "Success Rate", value: "94%", icon: TrendingUp, color: "text-accent" },
];

const Index = () => {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-8 shadow-medium">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-medium">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">AI-Powered Sales Assistant</h1>
                <p className="text-muted-foreground">Intelligent conversation support for better sales outcomes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                <Zap className="h-3 w-3 mr-1" />
                AI Active
              </Badge>
              <Badge variant="secondary">Real-time Analysis</Badge>
              <Badge variant="secondary">Smart Suggestions</Badge>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-subtle hover:shadow-medium transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload Section */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Upload Knowledge Base
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload />
            </CardContent>
          </Card>

          {/* Meeting Generator Section */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                AI Meeting Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MeetingGenerator />
            </CardContent>
          </Card>
        </div>


      </div>
    </Layout>
  );
};

export default Index;
