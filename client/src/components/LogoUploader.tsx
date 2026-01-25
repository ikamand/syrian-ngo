import { useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LogoUploaderProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

export function LogoUploader({ value, onChange, label = "شعار المنظمة" }: LogoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const inputId = `logo-upload-${Math.random().toString(36).substr(2, 9)}`;

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
        description: "تم رفع الشعار بنجاح",
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

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Organization logo"
            className="w-32 h-32 object-contain border rounded-lg bg-white"
            data-testid="img-logo-preview"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -left-2 h-6 w-6"
            onClick={handleRemove}
            data-testid="button-remove-logo"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50">
            <ImageIcon className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id={inputId}
              disabled={isUploading}
              data-testid="input-logo-file"
            />
            <label htmlFor={inputId}>
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                asChild
              >
                <span className="cursor-pointer" data-testid="button-upload-logo">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 ml-2" />
                      رفع الشعار
                    </>
                  )}
                </span>
              </Button>
            </label>
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG أو SVG (حد أقصى 5MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
