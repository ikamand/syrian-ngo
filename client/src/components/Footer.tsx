import { Link } from "wouter";
import emblemUrl from "@/assets/images/emblem-of-syria.png";
import { usePublicFooterLinks } from "@/hooks/use-footer-links";
import { ExternalLink, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const { data: footerLinks } = usePublicFooterLinks();

  return (
    <footer className="bg-primary text-white pt-12 pb-6 border-t-4 border-secondary mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center overflow-hidden bg-white rounded-full p-1">
                <img src={emblemUrl} alt="Emblem of Syria" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#b9a67c]">الجمهورية العربية السورية</span>
                <span className="text-[10px] text-white/80 font-medium">وزارة الشؤون الإجتماعية والعمل</span>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed text-justify">
              المنصة الوطنية الإلكترونية للمنظمات غير الحكومية هي المرجع الرسمي الموحد لإدارة وتنظيم العمل الأهلي في الجمهورية العربية السورية، لضمان الشفافية والفاعلية في وصول المساعدات لمستحقيها.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-r-4 border-secondary pr-3">روابط سريعة</h3>
            <ul className="space-y-2 pr-4">
              <li>
                <Link href="/" className="text-sm text-white/70 hover:text-[#b9a67c] transition-colors flex items-center gap-2">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/ngos" className="text-sm text-white/70 hover:text-[#b9a67c] transition-colors flex items-center gap-2">
                  دليل المنظمات
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="text-sm text-white/70 hover:text-[#b9a67c] transition-colors flex items-center gap-2">
                  الأخبار والفعاليات
                </Link>
              </li>
              <li>
                <Link href="/legal/association-law" className="text-sm text-white/70 hover:text-[#b9a67c] transition-colors flex items-center gap-2">
                  المرجعيات القانونية
                </Link>
              </li>
              <li>
                <Link href="/use-policy" className="text-sm text-white/70 hover:text-[#b9a67c] transition-colors flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  سياسة الاستخدام
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-r-4 border-secondary pr-3">اتصل بنا</h3>
            <ul className="space-y-3 pr-4">
              <li className="flex items-center gap-3 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-secondary shrink-0" />
                <span>دمشق - ساحة يوسف العظمة - بناء وزارة الشؤون الاجتماعية والعمل</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span dir="ltr">+963 11 231 2311</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span>info@mosal.gov.sy</span>
              </li>
            </ul>
          </div>

          {/* Important Links (External) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-r-4 border-secondary pr-3">روابط هامة</h3>
            <ul className="space-y-2 pr-4">
              {footerLinks?.map((link) => (
                <li key={link.id}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-white/70 hover:text-[#b9a67c] transition-colors flex items-center justify-between group"
                  >
                    <span>{link.title}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
              {(!footerLinks || footerLinks.length === 0) && (
                <>
                  <li>
                    <a href="https://egov.sy" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-[#b9a67c] transition-colors flex items-center justify-between group">
                      <span>بوابة الحكومة الإلكترونية السورية</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <a href="https://mosal.gov.sy" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-[#b9a67c] transition-colors flex items-center justify-between group">
                      <span>موقع وزارة الشؤون الاجتماعية والعمل</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new_Date().getFullYear()} وزارة الشؤون الاجتماعية والعمل - الجمهورية العربية السورية. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <Link href="/use-policy" className="hover:text-white transition-colors">سياسة الخصوصية والاستخدام</Link>
            <span>تصميم وتطوير الفريق التقني للمنصة</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function new_Date() {
  return new Date();
}
