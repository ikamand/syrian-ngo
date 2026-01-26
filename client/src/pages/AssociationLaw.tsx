import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/use-site-content";
import { sanitizeHtml } from "@/lib/sanitize";

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
        className="w-full flex items-center justify-between p-3 md:p-4 bg-primary/5 hover:bg-primary/10 rounded-none h-auto"
        onClick={() => setIsOpen(!isOpen)}
        data-testid={`button-toggle-${title}`}
      >
        <span className="text-sm md:text-lg font-bold text-primary border-r-4 border-primary pr-3 md:pr-4 text-right leading-relaxed">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-primary shrink-0 mr-2" /> : <ChevronDown className="w-5 h-5 text-primary shrink-0 mr-2" />}
      </Button>
      <div className={`${isOpen ? "block" : "hidden"} p-6 space-y-4 text-right`} dir="rtl">
        {children}
      </div>
    </div>
  );
}

export default function AssociationLaw() {
  const { data: associationLaw, isLoading: isLoadingLaw } = useSiteContent("association_law");
  const { data: associationLawPdf } = useSiteContent("association_law_pdf");
  const { data: executiveRegulations, isLoading: isLoadingRegulations } = useSiteContent("executive_regulations");
  const { data: executiveRegulationsPdf } = useSiteContent("executive_regulations_pdf");

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold leading-relaxed mb-4">قانون الجمعيات والمؤسسات الخاصة ولائحته التنفيذية</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            الإطار القانوني الناظم لعمل الجمعيات والمؤسسات الخاصة في الجمهورية العربية السورية
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Association Law Section */}
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="p-4 md:p-8 space-y-6 text-right" dir="rtl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
                <h2 className="text-base md:text-xl font-bold leading-relaxed text-primary">قانون الجمعيات والمؤسسات الخاصة (قانون 93 لعام 1958)</h2>
                {associationLawPdf?.content && (
                  <Button asChild variant="outline" size="sm" className="gap-2 shrink-0 self-start sm:self-auto" data-testid="button-download-pdf">
                    <a href={`/api/files/${associationLawPdf.content}`} download="قانون_الجمعيات_93_لعام_1958.pdf">
                      <Download className="w-4 h-4" />
                      <span>تحميل PDF</span>
                    </a>
                  </Button>
                )}
              </div>
              {isLoadingLaw ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : associationLaw?.content ? (
                <CollapsibleSection title="نص القانون" defaultOpen={false}>
                  <div 
                    className="prose prose-slate max-w-none prose-headings:text-primary prose-p:text-foreground prose-li:text-foreground"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(associationLaw.content) }}
                  />
                </CollapsibleSection>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>لم يتم إضافة محتوى القانون بعد</p>
                  <p className="text-sm mt-2">يمكن للمسؤول إضافة المحتوى من لوحة التحكم</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Executive Regulations Section - Separate Card */}
          <Card className="border-none shadow-lg bg-white mt-8">
            <CardContent className="p-4 md:p-8 space-y-6 text-right" dir="rtl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
                <h2 className="text-base md:text-xl font-bold leading-relaxed text-primary">اللائحة التنفيذية لقانون الجمعيات</h2>
                {executiveRegulationsPdf?.content && (
                  <Button asChild variant="outline" size="sm" className="gap-2 shrink-0 self-start sm:self-auto" data-testid="button-download-regulations-pdf">
                    <a href={`/api/files/${executiveRegulationsPdf.content}`} download="اللائحة_التنفيذية.pdf">
                      <Download className="w-4 h-4" />
                      <span>تحميل PDF</span>
                    </a>
                  </Button>
                )}
              </div>
              {isLoadingRegulations ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : executiveRegulations?.content ? (
                <CollapsibleSection title="نص اللائحة التنفيذية" defaultOpen={false}>
                  <div 
                    className="prose prose-slate max-w-none prose-headings:text-primary prose-p:text-foreground prose-li:text-foreground"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(executiveRegulations.content) }}
                  />
                </CollapsibleSection>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>لم يتم إضافة محتوى اللائحة التنفيذية بعد</p>
                  <p className="text-sm mt-2">يمكن للمسؤول إضافة المحتوى من لوحة التحكم</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
