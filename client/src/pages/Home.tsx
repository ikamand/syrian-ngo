import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Building2, FileCheck, ShieldCheck, Users, ArrowLeft, Heart, Briefcase, Calendar } from "lucide-react";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { FeaturedNewsSlider } from "@/components/FeaturedNewsSlider";

import emblemUrl from "@assets/emblem-of-syria-seeklogo_1769042472182.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      <HeroSlideshow />

      <section className="py-4 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <span className="font-medium">البوابة الرسمية لتسجيل وإدارة المنظمات غير الحكومية</span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary">عن منصة تشارك</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              المنصة الوطنية الإلكترونية للمنظمات غير الحكومية التي هي صلة الوصل المباشرة والشفافة بين الجهات المانحة والمتبرعين من داخل وخارج سوريا من جهة وبين المؤسسات والجمعيات المعنية بإيصال المساعدات وتنفيذ البرامج التنموية من جهة آخرى.
            </p>
          </div>
        </div>
      </section>

      <FeaturedNewsSlider />

      <section className="py-20 bg-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">خدمات المنصة</h2>
            <p className="text-muted-foreground">تقدّم المنصة مجموعة من الخدمات الرقمية التي تنظّم عمل الجمعيات وتسهّل التواصل مع الوزارة.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileCheck className="w-10 h-10 text-primary" />}
              title="ترخيص وإشهار إلكتروني"
              description="تقديم طلبات ترخيص المنظمات والجمعيات بشكل إلكتروني كامل دون الحاجة للمراجعة الورقية."
            />
            <FeatureCard 
              icon={<Users className="w-10 h-10 text-primary" />}
              title="دليل المنظمات الأهلية"
              description="يمكنك استعراض بيانات المنظمات غير الحكومية المرخصة، والتعرّف على أنشطتها ومجالات عملها في مختلف المحافظات"
            />
            <FeatureCard 
              icon={<Building2 className="w-10 h-10 text-primary" />}
              title="منبر المنظمات"
              description="حيث تتيح المنصة نشر أخبار المنظمات غير الحكومية، الإعلان عن حملات التبرع، فرص العمل والتطوع، والأنشطة المجتمعية."
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">تصفح حسب النوع</h2>
            <p className="text-muted-foreground">استكشف الفرص المتاحة والأنشطة المختلفة للمنظمات</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickLinkCard 
              href="/ngos"
              icon={<Building2 className="w-8 h-8" />}
              title="دليل المنظمات"
              description="تصفح المنظمات المسجلة"
              imageUrl="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=500&auto=format&fit=crop"
            />
            <QuickLinkCard 
              href="/opportunities"
              icon={<Briefcase className="w-8 h-8" />}
              title="فرص العمل والتطوع"
              description="ابحث عن فرص للمساهمة"
              imageUrl="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=500&auto=format&fit=crop"
            />
            <QuickLinkCard 
              href="/events"
              icon={<Calendar className="w-8 h-8" />}
              title="الفعاليات"
              description="الأنشطة والفعاليات القادمة"
              imageUrl="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=500&auto=format&fit=crop"
            />
            <QuickLinkCard 
              href="/campaigns"
              icon={<Heart className="w-8 h-8" />}
              title="حملات التبرع"
              description="ساهم في دعم المجتمع"
              imageUrl="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=500&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

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

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 border-b border-slate-800 pb-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={emblemUrl} 
                  alt="Syrian National Emblem" 
                  className="h-12 w-auto drop-shadow-lg"
                />
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
            © 2026 بوابة المنظمات غير الحكومية - جميع الحقوق محفوظة
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="space-y-4 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-primary/5 flex items-center justify-center mb-2">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function QuickLinkCard({ href, icon, title, description, imageUrl }: { 
  href: string, 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  imageUrl: string 
}) {
  return (
    <Link href={href}>
      <Card className="group border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full">
        <div className="h-32 overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 right-3 text-white">
            {icon}
          </div>
        </div>
        <CardContent className="p-4 text-right">
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
