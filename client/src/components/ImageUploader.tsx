import { useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function ImageUploader({ value, onChange, label, size = "md" }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى اختيار ملف صورة",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حجم الملف يجب أن يكون أقل من 5 ميغابايت",
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
        description: "تم رفع الصورة بنجاح",
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

  const inputId = `image-upload-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Uploaded image"
            className={`${sizeClasses[size]} object-cover border rounded-lg bg-white`}
            data-testid="img-uploaded-preview"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -left-2 h-5 w-5"
            onClick={handleRemove}
            data-testid="button-remove-image"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className={`${sizeClasses[size]} border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50`}>
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : (
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id={inputId}
              disabled={isUploading}
              data-testid="input-image-file"
            />
            <label htmlFor={inputId}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
                asChild
              >
                <span className="cursor-pointer" data-testid="button-upload-image">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3 h-3 ml-1 animate-spin" />
                      جاري الرفع
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3 ml-1" />
                      رفع صورة
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
