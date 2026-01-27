import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Hammer } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Campaigns() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <Navbar />
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold mb-3">الحملات</h1>
            <p className="text-white/90 max-w-2xl">
              إدارة ومتابعة حملات التبرع والتوعية للمنظمات غير الحكومية
            </p>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto shadow-lg border-t-4 border-primary">
          <CardContent className="p-12 flex flex-col items-center text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">قيد الإنشاء</h2>
              <p className="text-muted-foreground text-lg">
                هذه الصفحة قيد العمل حالياً وسيتم إطلاقها قريباً لتوفير خدمات إدارة الحملات.
              </p>
            </div>
            <Link href="/">
              <Button className="gap-2" data-testid="button-back-home">
                <ArrowRight className="w-4 h-4" />
                العودة للرئيسية
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
