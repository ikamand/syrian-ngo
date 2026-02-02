import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import headerPattern from "@assets/header-pattern.svg";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg overflow-hidden mb-6">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between p-4 bg-primary/5 hover:bg-primary/10 rounded-none h-auto"
        onClick={() => setIsOpen(!isOpen)}
        data-testid={`button-toggle-${title}`}
      >
        <span className="text-xl font-bold text-primary border-r-4 border-primary pr-4 text-right">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
      </Button>
      <div className={`${isOpen ? "block" : "hidden"} p-6 space-y-4 text-right`} dir="rtl">
        {children}
      </div>
    </div>
  );
}

export default function OtherLaws() {
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
              <h1 className="text-2xl md:text-3xl font-bold">القوانين والمراسيم المرتبطة بعمل المنظمات غير الحكومية</h1>
              <p className="text-white/80 text-sm">مجموعة التشريعات والمراسيم التكميلية والقرارات المنظمة للعمل الأهلي</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="p-8 space-y-6 text-right" dir="rtl">
              <div className="flex items-center gap-4 text-primary border-b pb-4">
                <Scale className="w-8 h-8" />
                <h2 className="text-xl font-bold">التشريعات والمراسيم ذات الصلة</h2>
              </div>
              <div className="prose prose-slate max-w-none mt-6">
                <p className="mb-8">بالإضافة إلى القانون الأساسي، هناك مجموعة من المراسيم والقرارات التي تنظم جوانب محددة من عمل المنظمات غير الحكومية، خاصة فيما يتعلق بالتعاون الدولي، والإعفاءات الضريبية، والعمل الإغاثي.</p>
                
                <CollapsibleSection title="أهم المراسيم والقرارات" defaultOpen={true}>
                  <ul className="list-disc list-inside space-y-2">
                    <li>المراسيم المتعلقة بالعمل التطوعي.</li>
                    <li>القرارات الناظمة لتلقي التمويل والمنح.</li>
                    <li>الاتفاقيات النموذجية للتعاون مع المنظمات الدولية.</li>
                    <li>الأنظمة المالية المحاسبية الموحدة.</li>
                  </ul>
                </CollapsibleSection>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
