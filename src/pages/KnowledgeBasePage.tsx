import { useState } from "react";
import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Eye, 
  Trash2, 
  FileText, 
  Calendar,
  TrendingUp,
  Database,
  Zap,
  Brain,
  BarChart3,
  Settings,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KnowledgeItem {
  id: string;
  name: string;
  type: 'pdf' | 'txt' | 'docx';
  size: string;
  uploadDate: string;
  status: 'processed' | 'processing' | 'error';
  preview: string;
  category: 'product' | 'sales' | 'support' | 'pricing' | 'general';
  aiScore: number;
  usage: number;
}

const mockData: KnowledgeItem[] = [
  {
    id: '1',
    name: 'Product Specifications.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    status: 'processed',
    preview: 'Comprehensive product specifications including technical details, features, and compatibility information for enterprise solutions...',
    category: 'product',
    aiScore: 95,
    usage: 847
  },
  {
    id: '2',
    name: 'Sales Playbook.docx',
    type: 'docx',
    size: '1.8 MB',
    uploadDate: '2024-01-14',
    status: 'processed',
    preview: 'Complete sales methodology covering qualification, discovery, presentation, and closing techniques with real-world examples...',
    category: 'sales',
    aiScore: 92,
    usage: 623
  },
  {
    id: '3',
    name: 'Pricing Guidelines.txt',
    type: 'txt',
    size: '156 KB',
    uploadDate: '2024-01-13',
    status: 'processing',
    preview: 'Current pricing structure, discount policies, and competitive positioning strategies for different market segments...',
    category: 'pricing',
    aiScore: 0,
    usage: 234
  },
  {
    id: '4',
    name: 'Customer Case Studies.pdf',
    type: 'pdf',
    size: '5.2 MB',
    uploadDate: '2024-01-12',
    status: 'processed',
    preview: 'Success stories from key customers showcasing implementation results, ROI achievements, and best practices...',
    category: 'sales',
    aiScore: 88,
    usage: 445
  },
  {
    id: '5',
    name: 'Technical FAQ.docx',
    type: 'docx',
    size: '892 KB',
    uploadDate: '2024-01-10',
    status: 'processed',
    preview: 'Frequently asked technical questions with detailed answers covering integration, security, and performance...',
    category: 'support',
    aiScore: 90,
    usage: 356
  },
  {
    id: '6',
    name: 'Competitor Analysis.pdf',
    type: 'pdf',
    size: '3.1 MB',
    uploadDate: '2024-01-08',
    status: 'error',
    preview: 'Market analysis covering competitor features, pricing, and positioning strategies with recommendations...',
    category: 'general',
    aiScore: 0,
    usage: 0
  }
];

const stats = [
  { label: "Total Files", value: "24", icon: FileText, trend: "+6" },
  { label: "Storage Used", value: "142 MB", icon: Database, trend: "+12 MB" },
  { label: "AI Processed", value: "21", icon: Brain, trend: "+5" },
  { label: "Avg Score", value: "91%", icon: TrendingUp, trend: "+3%" },
];

const categories = [
  { value: 'all', label: 'All Categories', count: 24 },
  { value: 'product', label: 'Product Info', count: 8 },
  { value: 'sales', label: 'Sales Materials', count: 7 },
  { value: 'support', label: 'Support Docs', count: 5 },
  { value: 'pricing', label: 'Pricing Info', count: 3 },
  { value: 'general', label: 'General', count: 1 },
];

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("recent");

  const filteredData = mockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesType = selectedType === "all" || item.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'usage':
        return b.usage - a.usage;
      case 'score':
        return b.aiScore - a.aiScore;
      case 'recent':
      default:
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    }
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'txt': return '📋';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-accent text-accent-foreground';
      case 'processing': return 'bg-warning text-warning-foreground';
      case 'error': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed': return CheckCircle;
      case 'processing': return Clock;
      case 'error': return AlertCircle;
      default: return Clock;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'product': return 'bg-primary/10 text-primary border-primary/20';
      case 'sales': return 'bg-accent/10 text-accent border-accent/20';
      case 'support': return 'bg-warning/10 text-warning border-warning/20';
      case 'pricing': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
            <p className="text-muted-foreground">AI-powered document management and intelligence</p>
          </div>
          
          <Button variant="premium" size="lg" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Documents
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-subtle hover:shadow-medium transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <span className="text-sm text-accent font-medium">{stat.trend}</span>
                    </div>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            {/* Filters and Search */}
            <Card className="shadow-subtle">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search documents..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label} ({cat.count})
                          </option>
                        ))}
                      </select>
                      
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
                      >
                        <option value="all">All Types</option>
                        <option value="pdf">PDF</option>
                        <option value="docx">Word</option>
                        <option value="txt">Text</option>
                      </select>
                      
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
                      >
                        <option value="recent">Recent</option>
                        <option value="name">Name</option>
                        <option value="usage">Usage</option>
                        <option value="score">AI Score</option>
                      </select>
                    </div>
                  </div>
                  
                  {selectedItems.length > 0 && (
                    <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
                      <span className="text-sm font-medium">{selectedItems.length} items selected</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Reprocess
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedData.map((item) => {
                const StatusIcon = getStatusIcon(item.status);
                
                return (
                  <Card 
                    key={item.id} 
                    className={cn(
                      "cursor-pointer transition-smooth hover:shadow-medium",
                      selectedItems.includes(item.id) && "ring-2 ring-primary"
                    )}
                    onClick={() => toggleItemSelection(item.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="text-2xl">{getFileIcon(item.type)}</div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm font-medium truncate">
                              {item.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="secondary" 
                                className={cn("text-xs flex items-center gap-1", getStatusColor(item.status))}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {item.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <Badge className={cn("text-xs", getCategoryColor(item.category))}>
                          {item.category}
                        </Badge>
                        
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {item.preview}
                        </p>
                        
                        {item.status === 'processed' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">AI Score</span>
                              <span className="font-medium">{item.aiScore}%</span>
                            </div>
                            <Progress value={item.aiScore} className="h-1" />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            <span>{item.usage} uses</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {sortedData.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? `No documents match "${searchTerm}"` : 'Upload some documents to get started'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload New Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Usage Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Usage analytics coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>AI Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">AI metrics coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}