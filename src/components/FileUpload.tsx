import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FileItem {
  id: string;
  file: File;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

export function FileUpload() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    const fileItems: FileItem[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'uploading',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...fileItems]);

    // Simulate upload progress
    fileItems.forEach(fileItem => {
      simulateUpload(fileItem.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 30, 100);
          const status = newProgress === 100 ? 'completed' : 'uploading';
          
          if (status === 'completed') {
            toast({
              title: "Upload completed",
              description: `${file.file.name} has been successfully uploaded.`,
            });
          }
          
          return { ...file, progress: newProgress, status };
        }
        return file;
      }));
    }, 500);

    setTimeout(() => clearInterval(interval), 3000);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    return '📄';
  };

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "upload-zone rounded-xl p-8 text-center transition-smooth",
          isDragging && "dragover"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground">Upload Knowledge Base Files</h3>
            <p className="text-muted-foreground mt-1">
              Drag and drop your files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supports PDF, TXT, DOCX files up to 10MB
            </p>
          </div>
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="premium"
            size="lg"
            className="mx-auto"
          >
            Select Files
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Upload Progress</h4>
          {files.map((fileItem) => (
            <div
              key={fileItem.id}
              className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border shadow-subtle"
            >
              <div className="text-2xl">{getFileIcon(fileItem.file.type)}</div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {fileItem.file.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {fileItem.status === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-accent" />
                    )}
                    {fileItem.status === 'error' && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFile(fileItem.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Progress value={fileItem.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{(fileItem.file.size / 1024 / 1024).toFixed(1)} MB</span>
                    <span>{Math.round(fileItem.progress)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}