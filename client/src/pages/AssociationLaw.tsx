import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function AssociationLaw() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-primary">قانون الجمعيات والمؤسسات الخاصة ولائحته التنفيذية</h1>
            <p className="text-muted-foreground">الإطار القانوني الناظم لعمل الجمعيات والمؤسسات الخاصة في الجمهورية العربية السورية</p>
          </div>

          <Card className="border-none shadow-lg">
            <CardContent className="p-8 space-y-6 text-right" dir="rtl">
              <div className="flex items-center gap-4 text-primary border-b pb-4">
                <FileText className="w-8 h-8" />
                <h2 className="text-xl font-bold">قانون الجمعيات والمؤسسات الخاصة (قانون 93 لعام 1958)</h2>
              </div>
              <div className="prose prose-slate max-w-none">
                <p>يعتبر القانون رقم 93 لعام 1958 هو التشريع الأساسي الذي ينظم تأسيس وعمل الجمعيات والمؤسسات الخاصة في سوريا. يحدد هذا القانون الإجراءات اللازمة لإشهار الجمعية، وحقوق والتزامات الأعضاء، وكيفية الإدارة والرقابة المالية.</p>
                <h3 className="text-lg font-bold mt-6 mb-2">أبرز المحاور:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>شروط التأسيس والعضوية.</li>
                  <li>النظام الداخلي للجمعية.</li>
                  <li>اختصاصات الجمعية العمومية ومجلس الإدارة.</li>
                  <li>حل الجمعية وتصفية أموالها.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
