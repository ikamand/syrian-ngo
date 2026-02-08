import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Ban, LogOut, Link2, Copyright, Gavel, AlertTriangle, Scale, FileWarning, HandshakeIcon, MessageSquare } from "lucide-react";
import headerPattern from "@/assets/images/header-pattern.svg";
import { Link } from "wouter";

interface PolicySectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function PolicySection({ icon, title, children }: PolicySectionProps) {
  return (
    <div className="pb-8 mb-8 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-primary">{title}</h2>
      </div>
      <div className="pr-12 space-y-3 text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export default function UsePolicy() {
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
              <h1 className="text-2xl md:text-3xl font-bold">سياسة الاستخدام</h1>
              <p className="text-white/80 text-sm">بنود وشروط استخدام منصة تشارك</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="p-8 space-y-0 text-right" dir="rtl">

              <PolicySection
                icon={<ShieldCheck className="w-5 h-5 text-primary" />}
                title="منصة تشارك"
              >
                <p>
                  إن منصة تشارك، والتي يشار إليها هنا بعبارة "المنصة" أو "منصة تشارك" متاحة لاستخدامك الشخصي، أو لاستخدام منظمتكم غير الحكومية المشهرة وفق أحكام القانون رقم /93 / لعام 1958 ويخضع كل مستخدم للمنصة لبنود وشروط الاستخدام هذه ولقوانين الجمهورية العربية السورية، ويُعد وصولك ودخولك إلى المنصة موافقة دون قيد أو شرط على بنود وشروط الاستخدام، سواء كنت مستخدماً مسجلاً أم لم تكن، وتسري هذه الموافقة اعتباراً من تاريخ أول استخدام لك لهذه المنصة. يصبح أي تعديل لهذه البنود والشروط نافذاً فور إعلانه ما لم يُبين خلاف ذلك، وإن استمرارك في استخدام هذه المنصة بعد إعلان أي تعديل يعني قبولك التام لذلك التعديل.
                </p>
              </PolicySection>

              <PolicySection
                icon={<Ban className="w-5 h-5 text-primary" />}
                title="القيود على الاستخدام"
              >
                <p>باستخدامك لهذه المنصة تقر بالامتناع عما يلي:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>انتحال صفة منظمة غير حكومية.</li>
                  <li>سوء استخدام نافذة جمع التبرعات التي تتيحها المنصة بأي فعل يتعارض مع أحكام القانون (غسيل أموال – تمويل إرهاب...).</li>
                  <li>إدخال أو تحميل بيانات غير صحيحة عن طريق القصد أو بدون قصد.</li>
                  <li>استخدام هذه المنصة لإرسال بريد إلكتروني ذو هدف تجاري أو غير مرغوب فيه، أو أي إساءة استخدام من هذا النوع للمنصة.</li>
                  <li>توفير أو تحميل ملفات على هذه المنصة تحتوي على فيروسات أو بيانات تالفة.</li>
                  <li>نشر أو إعلان أو توزيع أو تعميم مواد و معلومات تحتوي تشويهاً للسمعة، أو تشكل انتهاكاً للقوانين والأنظمة النافذة، أو مواد إباحية و بذيئة مخالفة للآداب العامة أو أي مواد و معلومات غير قانونية من خلال المنصة.</li>
                  <li>الترويج لأنشطة غير مشروعة وغير قانونية من خلال هذه المنصة.</li>
                  <li>استخدام أي وسيلة أو برنامج أو إجراء لاعتراض أو محاولة اعتراض التشغيل الصحيح للمنصة.</li>
                </ul>
              </PolicySection>

              <PolicySection
                icon={<LogOut className="w-5 h-5 text-primary" />}
                title="إنهاء الاستخدام"
              >
                <p>
                  يجوز لنا حسب تقديرنا المطلق إنهاء أو تقييد أو إيقاف حقك في الدخول إلى المنصة واستخدامها دون إشعار ـــــ لأي سبب كان ـــــ بما في ذلك مخالفة شروط وبنود الاستخدام، أو أي سلوك آخر قد نعتبره حسب تقديرنا الخاص غير قانوني أو مضرًا بالآخرين، ويحق لك التقدم باعتراض خطي لوزارة الشؤون الاجتماعية والعمل لدراسة إمكانية إعادة تفعيل استخدامك للمنصة في حال كان منع دخولك ناتج عن سوء تقدير أو خلل فني.
                </p>
              </PolicySection>

              <PolicySection
                icon={<Link2 className="w-5 h-5 text-primary" />}
                title="الروابط من منصة تشارك"
              >
                <p>
                  يتم توفير روابط تتضمن مساحات مخصصة للمنظمات غير الحكومية المشهرة وفق أحكام القانون رقم /93 / لعام 1958 لتقوم المنظمات غير الحكومية بنشر معلوماتها وبرامج عملها ومشاريعها وأنشطتها وحشد الموارد لدعمها.
                </p>
                <p>
                  تعتبر المعلومات الموجودة على هذه الروابط على مسؤولية المنظمة غير الحكومية التي قامت بنشرها بما في ذلك حملات جمع التبرعات.
                </p>
              </PolicySection>

              <PolicySection
                icon={<Copyright className="w-5 h-5 text-primary" />}
                title="حقوق الملكية"
              >
                <p>
                  هذه المنصة تشرف عليها وزارة الشؤون الاجتماعية والعمل فنياً، وهي جهة حكومية تهدف إلى تنظيم نشاط المنظمات غير الحكومية في الجمهورية العربية السورية وفق أحكام القانون رقم /93/لعام 1958. جميع حقوق الملكية الفكرية لمنصة تشارك محفوظة.
                </p>
              </PolicySection>

              <PolicySection
                icon={<Gavel className="w-5 h-5 text-primary" />}
                title="المرجعية القضائية"
              >
                <p>
                  فيما يتعلق بجميع المطالبات والخلافات التي تنشأ عن استخدامك لهذه المنصة يعتبر القضاء السوري هو الجهة القضائية المخولة بمعالجتها والبت حيالها.
                </p>
              </PolicySection>

              <PolicySection
                icon={<AlertTriangle className="w-5 h-5 text-primary" />}
                title="إخلاء المسؤولية"
              >
                <p>
                  إن منصة تشارك هو موقع حكومي تتم إدارته من خلال وزارة الشؤون الاجتماعية والعمل، ويتم نشر محتوياته بالتعاون مع المنظمات الوطنية غير الحكومية.
                </p>
                <p>
                  يبذل مشرفو المنصة أقصى جهدهم لتسهيل وتيسير استخدامها من قبل الفئات المستهدفة بخدماتها وتقوم المنظمات غير الحكومية بإدخال بياناتها وتحديث المساحات التي تخصها ضمن المنصة، وبالتالي لا تتحمل وزارة الشؤون الاجتماعية والعمل أي مسؤولية أو تبعات قد تنتج إثر الاستفادة من المعلومات الواردة على المنصة.
                </p>
                <p>
                  تم إعداد هذه المنصة بالشكل الذي تسمح به الأنظمة النافذة في الجمهورية العربية السورية وبدون أي ضمانات من أي نوع، بموجب هذا الإقرار فإن وزارة الشؤون الاجتماعية والعمل لا تقدم أي ضمانات لما يلي:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>دقة وصحة المعلومات.</li>
                  <li>الفاعلية على عدم الخرق.</li>
                  <li>الاستمرارية أو الصلاحية.</li>
                  <li>ملاءمة محتويات الموقع.</li>
                  <li>خلوّ المنصة أو السيرفر من الفيروسات أو العناصر الضارة.</li>
                </ul>
                <p>
                  إن وزارة الشؤون الاجتماعية والعمل غير مسؤولة عن ضياع أو ضرر من أي نوع (مباشر أو غير مباشر) من جراء استخدام هذه المنصة.
                </p>
                <p>
                  هذه المنصة قد تحتوي على روابط إلكترونية لمواقع أو بوابات قد تستخدم طرقاً لحماية المعلومات وخصوصيتها تختلف عن الطرق المستخدمة لدينا، وبالتالي فنحن غير مسؤولين عن محتويات وطرق حماية وخصوصيات المواقع الأخرى، وننصحك بالرجوع إلى إشعارات الخصوصية الخاصة بتلك المواقع.
                </p>
              </PolicySection>

              <PolicySection
                icon={<Scale className="w-5 h-5 text-primary" />}
                title="القوانين ذات الصلة"
              >
                <p>
                  <Link href="/legal/association-law" className="text-primary underline font-medium" data-testid="link-related-laws">
                    انقر هنا لعرض لكافة القوانين والقرارات والتعليمات ذات الصلة
                  </Link>
                </p>
              </PolicySection>

              <PolicySection
                icon={<FileWarning className="w-5 h-5 text-primary" />}
                title="التنازل عن المطالبات"
              >
                <p>
                  إن المنصة والخدمات والمعلومات والمواد والوظائف المتاحة بها، أو التي يمكن الوصول إليها من خلال المنصة تُوفر لاستخدامكم الشخصي "كما هي متاحة" دون أي إقرار أو وعود أو ضمانات من أي نوع.
                </p>
                <p>
                  ولا يمكننا أن نضمن أو نتحمل المسؤولية عن أي انقطاعات أو أخطاء أو تجاوزات قد تنشأ عن استخدام هذه المنصة أو محتوياتها أو أي موقع يرتبط بها سواء كان ذلك بعلمنا أو دونه.
                </p>
                <p>
                  أي اتصالات أو معلومات قد يرسلها المستخدم من خلال هذه المنصة لن يكون له الحق في ملكيتها أو حق ضمان سريتها كما أن أي استخدام أو استخدام تفاعلي تتضمنه هذه المنصة لا يضمن للمستخدم أي حقوق أو تراخيص أو أية امتيازات من أي نوع.
                </p>
              </PolicySection>

              <PolicySection
                icon={<HandshakeIcon className="w-5 h-5 text-primary" />}
                title="التعويض"
              >
                <p>
                  بهذا تقر بعدم اتخاذ أي إجراء ضد وزارة الشؤون الاجتماعية والعمل أو أي من إداراتها أو مطالبتها بالتعويض والتأمين عن المسؤولية، وكذلك أية جهات أو موظفين يكونوا مسؤولين عن إدارة أو صيانة أو تحديث أو تقديم المنصة، وذلك من جميع الالتزامات والمسؤوليات التي قد تطرأ فيما يتصل بأية مطالبة تنشأ عن أي إخلال من جانبك ببنود وشروط الاستخدام.
                </p>
              </PolicySection>

              <PolicySection
                icon={<MessageSquare className="w-5 h-5 text-primary" />}
                title="سياسة التعليقات والمشاركة الإلكترونية"
              >
                <p>
                  في سبيل تحقيق الاستفادة القصوى من تطبيق مفهوم المشاركة الإلكترونية المجتمعية، تؤكد منصة تشارك على ضرورة التزام مستخدمي المنصة من المنظمات غير الحكومية بأسلوب المخاطبات الراقي بين المنظمات غير الحكومية من جهة ومع الجهة المشرفة من جهة أخرى وتقديم معلومات تساهم في تعزيز نشاط المنظمات غير الحكومية والترويج لها، ومن حق إدارة المنصة عدم نشر أيَّ معلومات تراها غير مناسبة.
                </p>
              </PolicySection>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
