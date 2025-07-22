import { useState } from "react";
import { Search, Filter, Download, Eye, Trash2, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KnowledgeItem {
  id: string;
  name: string;
  type: 'pdf' | 'txt' | 'docx';
  size: string;
  uploadDate: string;
  status: 'processed' | 'processing' | 'error';
  preview: string;
}

const mockData: KnowledgeItem[] = [
  {
    id: '1',
    name: 'Product Specifications.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    status: 'processed',
    preview: 'Comprehensive product specifications including technical details, features, and compatibility information...'
  },
  {
    id: '2',
    name: 'Sales Playbook.docx',
    type: 'docx',
    size: '1.8 MB',
    uploadDate: '2024-01-14',
    status: 'processed',
    preview: 'Complete sales methodology covering qualification, discovery, presentation, and closing techniques...'
  },
  {
    id: '3',
    name: 'Pricing Guidelines.txt',
    type: 'txt',
    size: '156 KB',
    uploadDate: '2024-01-13',
    status: 'processing',
    preview: 'Current pricing structure, discount policies, and competitive positioning...'
  },
  {
    id: '4',
    name: 'Customer Case Studies.pdf',
    type: 'pdf',
    size: '5.2 MB',
    uploadDate: '2024-01-12',
    status: 'processed',
    preview: 'Success stories from key customers showcasing implementation results and ROI achievements...'
  }
];

export function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredData = mockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || item.type === selectedType;
    return matchesSearch && matchesType;
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
      case 'processed': return 'bg-accent';
      case 'processing': return 'bg-warning';
      case 'error': return 'bg-destructive';
      default: return 'bg-muted';
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search knowledge base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
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
          
          {selectedItems.length > 0 && (
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export ({selectedItems.length})
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <Card 
            key={item.id} 
            className={cn(
              "cursor-pointer transition-smooth",
              selectedItems.includes(item.id) && "ring-2 ring-primary"
            )}
            onClick={() => toggleItemSelection(item.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getFileIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium truncate">
                      {item.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs", getStatusColor(item.status))}
                      >
                        {item.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.type.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {item.preview}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                </div>
                <span>{item.size}</span>
              </div>
              
              <div className="flex gap-1 mt-4" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No files found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? `No files match "${searchTerm}"` : 'Upload some files to get started'}
          </p>
        </div>
      )}
    </div>
  );
}