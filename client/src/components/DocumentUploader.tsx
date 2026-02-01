import { useState } from "react";
import { Upload, X, FileText, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploaderProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  accept?: string;
}

export function DocumentUploader({ 
  value, 
  onChange, 
  label = "وثيقة",
  accept = ".pdf"
}: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى اختيار ملف PDF",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حجم الملف يجب أن يكون أقل من 10 ميغابايت",
      });
      return;
    }

    setIsUploading(true);

    try {
      const response = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadURL, objectPath } = await response.json();

      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      onChange(objectPath);
      toast({
        title: "تم الرفع",
        description: "تم رفع الوثيقة بنجاح",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل رفع الملف، يرجى المحاولة مرة أخرى",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  const handleDownload = () => {
    if (!value) return;
    window.open(value, "_blank");
  };

  const getFileName = (path: string) => {
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  const inputId = `doc-upload-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium">{label}</p>}
      
      {value ? (
        <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
          <FileText className="h-5 w-5 text-primary shrink-0" />
          <span className="text-sm truncate flex-1" title={getFileName(value)}>
            {getFileName(value)}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              title="تحميل"
              data-testid="button-download-document"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              title="حذف"
              data-testid="button-remove-document"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            id={inputId}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
            data-testid="input-document-upload"
          />
          <label htmlFor={inputId} className="flex-1">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start gap-2"
              disabled={isUploading}
              asChild
            >
              <span>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري الرفع...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    رفع ملف PDF
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
}
