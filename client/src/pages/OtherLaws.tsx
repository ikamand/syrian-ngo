import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Scale } from "lucide-react";

export default function OtherLaws() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-primary">القوانين والمراسيم المرتبطة بعمل المنظمات غير الحكومية</h1>
            <p className="text-muted-foreground">مجموعة التشريعات والمراسيم التكميلية والقرارات المنظمة للعمل الأهلي</p>
          </div>

          <Card className="border-none shadow-lg">
            <CardContent className="p-8 space-y-6 text-right" dir="rtl">
              <div className="flex items-center gap-4 text-primary border-b pb-4">
                <Scale className="w-8 h-8" />
                <h2 className="text-xl font-bold">التشريعات والمراسيم ذات الصلة</h2>
              </div>
              <div className="prose prose-slate max-w-none">
                <p>بالإضافة إلى القانون الأساسي، هناك مجموعة من المراسيم والقرارات التي تنظم جوانب محددة من عمل المنظمات غير الحكومية، خاصة فيما يتعلق بالتعاون الدولي، والإعفاءات الضريبية، والعمل الإغاثي.</p>
                <h3 className="text-lg font-bold mt-6 mb-2">أهم المراسيم:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>المراسيم المتعلقة بالعمل التطوعي.</li>
                  <li>القرارات الناظمة لتلقي التمويل والمنح.</li>
                  <li>الاتفاقيات النموذجية للتعاون مع المنظمات الدولية.</li>
                  <li>الأنظمة المالية المحاسبية الموحدة.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
