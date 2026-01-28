import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function DonationCampaigns() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Construction className="h-16 w-16 text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold mb-4">حملات التبرع</h1>
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
