import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";
import headerPattern from "@assets/header-pattern.svg";

export default function Events() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="bg-primary text-white py-8 border-b-4 border-secondary relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${headerPattern})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'center bottom',
            opacity: 0.25,
            filter: 'invert(1)',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">الفعاليات</h1>
              <p className="text-white/80 text-sm">فعاليات وأنشطة المنظمات غير الحكومية</p>
            </div>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-10">
        <Card className="max-w-2xl mx-auto border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Construction className="h-16 w-16 text-muted-foreground mb-6" />
            <p className="text-muted-foreground text-lg">
              هذه الصفحة قيد الإنشاء
            </p>
            <p className="text-muted-foreground mt-2">
              سيتم إضافة المحتوى قريباً
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
