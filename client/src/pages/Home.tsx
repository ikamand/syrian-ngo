import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Building2, FileCheck, ShieldCheck, Users } from "lucide-react";

import emblemUrl from "@assets/emblem-of-syria-seeklogo_1769042472182.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        {/* Damascus city skyline or abstract architectural pattern for official feel */}
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>البوابة الرسمية لتسجيل المنظمات</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              منصة إدارة <span className="text-secondary">المنظمات غير الحكومية</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
              النظام الموحد لتسجيل ومتابعة المنظمات والجمعيات الأهلية في الجمهورية العربية السورية.
              نسعى لتعزيز العمل الأهلي بشفافية ومصداقية.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg h-14 px-8 shadow-xl shadow-black/10">
                <Link href="/login?tab=register">
                  تسجيل منظمة جديدة
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 text-lg h-14 px-8">
                <Link href="/ngos">
                  دليل المنظمات
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Wave at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto text-background fill-current">
            <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary">عن منصة تشارك</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              المنصة الوطنية الإلكترونية للمنظمات غير الحكومية التي هي صلة الوصل المباشرة والشفافة بين الجهات المانحة والمتبرعين من داخل وخارج سوريا من جهة وبين المؤسسات والجمعيات المعنية بإيصال المساعدات وتنفيذ البرامج التنموية من جهة آخرى وهي الطريقة المعاصرة التي تؤمن كل المعلومات اللازمة لكل متبرع وتسهل عملية التبرع من وقت وجهد وكل شخص قادر على إختيار الطريقة الأنسب للتبرع إما عن طريق المنصة أو بشكل مباشر .
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">خدمات المنصة</h2>
            <p className="text-muted-foreground">تسهل المنصة الإجراءات الإدارية والقانونية للمنظمات من خلال مجموعة من الخدمات الرقمية المتكاملة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileCheck className="w-10 h-10 text-primary" />}
              title="التسجيل الإلكتروني"
              description="تقديم طلبات ترخيص المنظمات والجمعيات بشكل إلكتروني كامل دون الحاجة للمراجعة الورقية."
            />
            <FeatureCard 
              icon={<Users className="w-10 h-10 text-primary" />}
              title="قاعدة بيانات موحدة"
              description="دليل شامل لكافة المنظمات العاملة لتسهيل التشبيك وتنسيق الجهود الإنسانية والتنموية."
            />
            <FeatureCard 
              icon={<Building2 className="w-10 h-10 text-primary" />}
              title="إدارة شفافة"
              description="متابعة حالة الطلبات والتراخيص والحصول على الموافقات الرسمية بشفافية وسرعة."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">150+</div>
              <div className="text-primary-foreground/80 font-medium">منظمة مسجلة</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">14</div>
              <div className="text-primary-foreground/80 font-medium">محافظة</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">24/7</div>
              <div className="text-primary-foreground/80 font-medium">خدمة إلكترونية</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">100%</div>
              <div className="text-primary-foreground/80 font-medium">امتثال قانوني</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 border-b border-slate-800 pb-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-8 w-8 text-secondary" />
                <span className="text-lg font-bold text-white">بوابة المنظمات</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs text-slate-400">
                منصة حكومية رسمية تهدف لتنظيم وتسهيل عمل المنظمات غير الحكومية في الجمهورية العربية السورية.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-secondary transition-colors">الرئيسية</Link></li>
                <li><Link href="/ngos" className="hover:text-secondary transition-colors">دليل المنظمات</Link></li>
                <li><Link href="/login" className="hover:text-secondary transition-colors">تسجيل الدخول</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">تواصل معنا</h3>
              <ul className="space-y-2 text-sm">
                <li>دمشق، الجمهورية العربية السورية</li>
                <li>هاتف: 0112314151 / 0112325221</li>
                <li>البريد: info@mosal.gov.sy</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-slate-500">
            © 2024 بوابة المنظمات غير الحكومية - جميع الحقوق محفوظة
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-2">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
