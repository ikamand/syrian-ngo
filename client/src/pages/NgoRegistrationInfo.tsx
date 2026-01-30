import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ListChecks, Scale, Table2, CheckCircle2, AlertCircle } from "lucide-react";

export default function NgoRegistrationInfo() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      {/* Hero Banner */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">إنشاء منظمة جديدة</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            دليل شامل لتأسيس المنظمات غير الحكومية في الجمهورية العربية السورية
          </p>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-5xl mx-auto shadow-lg">
          <CardContent className="p-6">
            <Tabs defaultValue="service-info" className="w-full" dir="rtl">
              <TabsList className="grid w-full grid-cols-4 mb-6 h-auto">
                <TabsTrigger value="service-info" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-white" data-testid="tab-service-info">
                  <FileText className="w-5 h-5" />
                  <span className="text-xs sm:text-sm">معلومات الخدمة</span>
                </TabsTrigger>
                <TabsTrigger value="procedures" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-white" data-testid="tab-procedures">
                  <ListChecks className="w-5 h-5" />
                  <span className="text-xs sm:text-sm">الإجراءات</span>
                </TabsTrigger>
                <TabsTrigger value="terms" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-white" data-testid="tab-terms">
                  <Scale className="w-5 h-5" />
                  <span className="text-xs sm:text-sm">الأحكام والشروط</span>
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-white" data-testid="tab-comparison">
                  <Table2 className="w-5 h-5" />
                  <span className="text-xs sm:text-sm">مقارنة الأنواع</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: معلومات الخدمة */}
              <TabsContent value="service-info" className="space-y-6" data-testid="content-service-info">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">وصف الخدمة</h2>
                  <p className="text-foreground leading-relaxed">
                    يمكن من خلال منصة تشارك تقديم طلب خاص بتأسيس منظمة غير حكومية والإطلاع على المتطلبات واستكمال كافة الأوراق الثبوتية مما يسهل الإجراءات ويختصر الكثير من الوقت.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-5">
                    <h3 className="font-semibold text-primary mb-3">الجهة المقدمة للخدمة</h3>
                    <p className="text-foreground">وزارة الشؤون الاجتماعية والعمل</p>
                  </div>

                  <div className="bg-white border rounded-lg p-5">
                    <h3 className="font-semibold text-primary mb-3">الجمهور المستفيد من الخدمة</h3>
                    <p className="text-foreground text-sm leading-relaxed">
                      كافة مواطنين الجمهورية العربية السورية والراغبين بتأسيس منظمات أو جمعيات أو اتحادات ممن لا تقل أعمارهم عن (18) ثمانية عشر عاماً ميلادياً وتنطبق عليهم شروط التأسيس
                    </p>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-6">
                  <h3 className="font-semibold text-primary mb-4">الوثائق المطلوبة</h3>
                  <ul className="space-y-3">
                    {[
                      "قرار تعيين مندوب الجمعية لإتمام إجراءات الشهر.",
                      "محضر انتخاب مجلس الإدارة - الأمناء",
                      "قائمة بأسماء المؤسسين وجنسيتهم وسنهم ومهنتهم ومحل إقامتهم ومكان العمل، عنوان الإقامة، إن وجد المؤهل العلمي، رقم الهاتف موقع من المؤسسين.",
                      "عقد تأسيس الجمعية موقع من المؤسسين.",
                      "نظام الجمعية أو المؤسسة موقع من المؤسسين.",
                      "وثيقة لا حكم علية + صورة هوية.",
                      "عقد إيجار بمقر للجمعية أو سند ملكية لمقر الجمعية."
                    ].map((doc, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              {/* Tab 2: الإجراءات */}
              <TabsContent value="procedures" className="space-y-4" data-testid="content-procedures">
                <h2 className="text-xl font-bold text-primary mb-6">خطوات تأسيس المنظمة</h2>
                
                <ol className="space-y-6 pr-4">
                  <li className="border-b border-gray-200 pb-4">
                    <div className="flex gap-3">
                      <span className="font-bold text-primary text-lg">1.</span>
                      <div>
                        <h3 className="font-semibold text-foreground">التقدم بطلب تأسيس</h3>
                        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">يتضمن كامل المعلومات المطلوبة آنفاً، عبر بوابة المنظمات غير الحكومية</p>
                      </div>
                    </div>
                  </li>
                  <li className="border-b border-gray-200 pb-4">
                    <div className="flex gap-3">
                      <span className="font-bold text-primary text-lg">2.</span>
                      <div>
                        <h3 className="font-semibold text-foreground">دراسة الطلب من قبل الجهة الحكومية المختصة</h3>
                        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">بحسب الصلاحيات الممنوحة ضمن سير المعاملة</p>
                      </div>
                    </div>
                  </li>
                  <li className="border-b border-gray-200 pb-4">
                    <div className="flex gap-3">
                      <span className="font-bold text-primary text-lg">3.</span>
                      <div>
                        <h3 className="font-semibold text-foreground">الموافقة على طلب التأسيس</h3>
                        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">بعد إجراء التعديلات اللازمة على الطلب</p>
                      </div>
                    </div>
                  </li>
                  <li className="border-b border-gray-200 pb-4">
                    <div className="flex gap-3">
                      <span className="font-bold text-primary text-lg">4.</span>
                      <div>
                        <h3 className="font-semibold text-foreground">إعداد وثائق التأسيس</h3>
                        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">المتضمنة بشكل خاص: النظام الداخلي، نشرات استعلام الأعضاء المؤسسين وأعضاء مجلس الأمناء حيث يمكن أن يؤسس شخص طبيعي أو اعتباري مؤسسة، ويعين مجلس أمناء مستقل عنه، وثيقة إشغال المقر.</p>
                      </div>
                    </div>
                  </li>
                  <li className="border-b border-gray-200 pb-4">
                    <div className="flex gap-3">
                      <span className="font-bold text-primary text-lg">5.</span>
                      <div>
                        <h3 className="font-semibold text-foreground">التقدم بالوثائق للجهة الحكومية المختصة</h3>
                        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">عبر بوابة المنظمات غير الحكومية</p>
                      </div>
                    </div>
                  </li>
                  <li className="border-b border-gray-200 pb-4">
                    <div className="flex gap-3">
                      <span className="font-bold text-primary text-lg">6.</span>
                      <div>
                        <h3 className="font-semibold text-foreground">مراسلة الجهات الحكومية الأخرى من قبل الجهة الحكومية المختصة</h3>
                        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">محافظة المقر (بالنسبة لحاجة المحافظة لخدمات المنظمة غير الحكومية)، الوزارة الفنية المختصة بعمل المنظمة غير الحكومية (وزارة الصحة - وزارة التربية - وزارة الثقافة)</p>
                      </div>
                    </div>
                  </li>
                  <li className="pb-2">
                    <div className="flex gap-3">
                      <span className="font-bold text-primary text-lg">7.</span>
                      <div>
                        <h3 className="font-semibold text-foreground">إصدار قرار التأسيس أو رفض التأسيس</h3>
                        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">من قبل وزير الشؤون الاجتماعية والعمل حسب نتيجة رأي الجهات الحكومية الشريكة ورأي وزارة الشؤون الاجتماعية والعمل</p>
                      </div>
                    </div>
                  </li>
                </ol>
              </TabsContent>

              {/* Tab 3: الأحكام والشروط */}
              <TabsContent value="terms" className="space-y-8" data-testid="content-terms">
                <h2 className="text-xl font-bold text-primary mb-6">الأحكام والشروط</h2>

                {/* معايير اختيار الاسم */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="font-semibold text-primary mb-4 text-lg">معايير اختيار الاسم</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground text-sm pr-2">
                    <li>عدم وجود اسم مشابه سابق ضمن الجمعيات والمؤسسات المشهرة، أو قيد التأسيس السابقة لطلب التأسيس.</li>
                    <li>خلو الاسم المراد اختياره من أي طابع ديني، أو سياسي، أو عنصري.</li>
                    <li>أن يكون الاسم ذو دلالة متلائماً مع أهداف الجمعية أو المؤسسة المراد تأسيسها، ومتوافقاً مع تصنيف مجال العمل.</li>
                    <li>في حال الرغبة في اختيار أسماء أجنبية، يجب أن يرفق الطلب بترجمة محلفة للاسم، وتوضيح مدلولاته، علماً أن الاسم المعتمد سيكون هو الاسم باللغة العربية.</li>
                  </ul>
                </div>

                {/* معايير النطاق الجغرافي */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="font-semibold text-primary mb-4 text-lg">معايير النطاق الجغرافي</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground text-sm pr-2">
                    <li>الجمعيات والمؤسسات التي تحمل تصنيف (التنمية والإسكان أو البيئة أو القانون والدفاع والحقوق أو الثقافة والرياضة والتسلية والفنون).</li>
                    <li>الجمعيات والمؤسسات العلمية.</li>
                    <li>الجمعيات والمؤسسات التي تُعنى بالأمراض المزمنة (سرطان - سكري - ......).</li>
                    <li>يمكن أن يتم توسيع النشاط لمحافظتين أو ثلاثة كحد أقصى بعد الحصول على موافقة المكاتب التنفيذية لتلك المحافظات من قبل الوزارة، وبعد التأكد من إمكانيات الأعضاء المؤسسين وحاجة المحافظات لتصنيف وخدمات الجمعية أو المؤسسة قيد التأسيس.</li>
                  </ul>
                </div>

                {/* معايير الموافقة على الأعضاء المؤسسين */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="font-semibold text-primary mb-4 text-lg">معايير الموافقة على الأعضاء المؤسسين</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground text-sm pr-2">
                    <li>يكون الحد الأدنى لعدد الأعضاء المؤسسين في الجمعية هو 11 عضو مؤسس، على أن يكون مجلس الإدارة مؤلف من 5 أو 7 أو 9 أو 11 عضو. أما بالنسبة للمؤسسة، فيمكن أن يؤسسها شخص طبيعي أو اعتباري واحد أو أكثر، على أن يتم اختيار مجلس أمناء مؤلف من 5 أو 7 أو 9 أمناء.</li>
                    <li>يجب أن تتوافق الأهداف المطروحة مع مؤهلات الأعضاء المؤسسين، وأن تتضمن مجموعة الأعضاء المؤسسين عضوين كحد أدنى يمتلكان المؤهلات العلمية المتناسبة مع تصنيف الجمعية أو المؤسسة قيد التأسيس ومجال عملها، أو أن يتم التعهد من قبل الأعضاء المؤسسين بتأمين الكوادر الاختصاصية.</li>
                    <li>يجب ألّا يتواجد أكثر من عضو واحد من عائلة واحدة في تشكيلة مجلس الإدارة، منعاً من تحويل الجمعيات الأهلية لجمعيات عائلية، وفي حال كان التأسيس ضمن قرى يرتبط أغلب سكانها بعلاقات قربى، يمنع تواجد أكثر من عضوين في مجلس الإدارة من عائلة واحدة.</li>
                    <li>في حال كان أحد الأشخاص المراد اشتراكه بتأسيس الجمعية أو المؤسسة، هو شخص اعتباري (شركة تجارية، شركة مدنية، هيئة، .......)، يجب إرفاق ما يثبت الوضع القانوني للشخص الاعتباري، إضافة إلى قرار صريح من صاحب الصلاحية في الاشتراك بتأسيس الجمعية أو المؤسسة.</li>
                    <li>في حال كان أحد الأشخاص المراد اشتراكه بتأسيس الجمعية أو المؤسسة، هو شخص غير سوري، يجب أن يكون له مقر إقامة دائم في الجمهورية العربية السورية، مع إرفاق سند إقامة مصدق أصولاً.</li>
                    <li>عدم اشتراك رجال الدين في تأسيس الجمعيات أو المؤسسات، منعاً من تأثير مهامهم في العمل الأهلي، تطبيقاً لأحكام قانون الجمعيات والمؤسسات الخاصة رقم 93 لعام 1958.</li>
                    <li>عدم اشتراك العسكريين وعناصر وضباط الشرطة بأي صفة كانت في تأسيس الجمعيات والمؤسسات الخاصة، عملاً بأنظمة الخدمة.</li>
                  </ul>
                </div>

                {/* معايير اختيار الأهداف */}
                <div className="pb-2">
                  <h3 className="font-semibold text-primary mb-4 text-lg">معايير اختيار الأهداف</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground text-sm pr-2">
                    <li>أن تكون الأهداف محصورة بتصنيف أساسي واحد فقط بالنسبة للجمعيات، ومجالات التخصص المرتبطة بهذا التصنيف حصراً، أما بالنسبة للمؤسسات الخاصة فيمكن اختيار حتى تصنيفين أساسيين، وفقاً لطبيعة عمل المؤسسة وقدراتها الفنية والمالية.</li>
                    <li>أن تكون الأهداف مصاغة بطريقة عملية، بعيداً عن الإنشائية، وتتصف بالوضوح والمنطقية، القابلية للتحقيق والقياس، وأن تتم صياغتها بشكل بعيد المدى، بالاستئناس باستمارة التصنيف المعياري المعتمد، دون نسخ واستخدام عبارات الاستمارة حرفياً.</li>
                    <li>ألّا يتجاوز عدد بنود الأهداف الأربعة بنود كحد أقصى.</li>
                    <li>عدم الخلط في صياغة الأهداف بين الهدف ووسائل تحقيقه (حيث تعتبر إقامة المحاضرات والندوات - إصدار المنشورات - التعاون مع الجمعيات أو الوزارات ........ وسائل تحقيق أهداف).</li>
                  </ul>
                </div>
              </TabsContent>

              {/* Tab 4: مقارنة الأنواع */}
              <TabsContent value="comparison" className="space-y-6" data-testid="content-comparison">
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Table2 className="w-6 h-6" />
                  مقارنة بين أنواع المنظمات
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="p-4 text-right font-semibold border-l border-primary-foreground/20">الموضوع</th>
                        <th className="p-4 text-right font-semibold border-l border-primary-foreground/20">الجمعية</th>
                        <th className="p-4 text-right font-semibold border-l border-primary-foreground/20">المؤسسة</th>
                        <th className="p-4 text-right font-semibold">الاتحاد</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4 bg-gray-50 font-medium border-l">التأسيس</td>
                        <td className="p-4 border-l text-sm">تؤسس الجمعية عن طريق اجتماع عدد من الأشخاص بهدف العمل في المجال الأهلي، بموجب طلب تأسيس</td>
                        <td className="p-4 border-l text-sm">تؤسس المؤسسة عن طريق تخصيص مال معين بهدف العمل في المجال الأهلي، بموجب سند تأسيس (ويمكن أن يكون سند التأسيس عن طريق وصية)</td>
                        <td className="p-4 text-sm">يؤسس الاتحاد عن طريق اجتماع عدد من الجمعيات أو المؤسسات المشهرة بهدف العمل في المجال الأهلي، بموجب طلب تأسيس</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 bg-gray-50 font-medium border-l">عدد الأعضاء المؤسسين</td>
                        <td className="p-4 border-l text-sm">11 عضو مؤسس كحد أدنى</td>
                        <td className="p-4 border-l text-sm">يمكن أن يؤسسها شخص طبيعي أو اعتباري واحد أو أكثر</td>
                        <td className="p-4 text-sm">7 جمعيات أو مؤسسات كحد أدنى</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 bg-gray-50 font-medium border-l">مجال التصنيف</td>
                        <td className="p-4 border-l text-sm">تصنيف أساسي واحد فقط من التصنيف المعياري المعتمد</td>
                        <td className="p-4 border-l text-sm">تصنيفين أساسيين كحد أقصى، وفقاً لطبيعة عمل المؤسسة وقدراتها الفنية والمالية</td>
                        <td className="p-4 text-sm">يتحدد بحسب قرار تأسيس الاتحاد</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 bg-gray-50 font-medium border-l">الهيكل الإداري والتنظيمي</td>
                        <td className="p-4 border-l text-sm">
                          <ul className="list-disc list-inside space-y-1">
                            <li>هيئة عامة مكونة من المنتسبين</li>
                            <li>مجلس إدارة تنتخبه الهيئة العامة لمدة عامين</li>
                          </ul>
                        </td>
                        <td className="p-4 border-l text-sm">مجلس أمناء يتم تعيينه أو انتخابه وتحديد مدته وولايته بحسب النظام الأساسي لكل مؤسسة (لا يوجد هيئة عامة للمؤسسة)، يعاون مجلس الأمناء جهاز تنفيذي</td>
                        <td className="p-4 text-sm">
                          <ul className="list-disc list-inside space-y-1">
                            <li>هيئة عامة مكونة من الجمعيات أو المؤسسات المنتسبة للاتحاد</li>
                            <li>مجلس إدارة تنتخبه الهيئة العامة لمدة عامين</li>
                          </ul>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 bg-gray-50 font-medium border-l">التبرعات</td>
                        <td className="p-4 border-l text-sm">يحق للجمعية التصدي للجمهور بهدف جمع التبرعات، إضافة إلى تلقي التبرعات بشكل مباشر</td>
                        <td className="p-4 border-l text-sm">لا يحق للمؤسسة التصدي للجمهور بهدف جمع التبرعات، وهذا لا يمنعها من تلقي التبرعات بشكل مباشر</td>
                        <td className="p-4 text-sm">يحق للاتحاد التصدي للجمهور بهدف جمع التبرعات، إضافة إلى تلقي التبرعات بشكل مباشر</td>
                      </tr>
                      <tr>
                        <td className="p-4 bg-gray-50 font-medium border-l">الإعفاءات</td>
                        <td className="p-4 border-l text-sm">تستفيد من الإعفاءات الواردة في القانون 22 لعام 1974، وتستفيد من الضرائب الكمالية إذا حصلت صفة النفع العام وذلك بموجب المرسوم 55 لعام 2007</td>
                        <td className="p-4 border-l text-sm">لا تستفيد من الإعفاءات إلا في حال اعتبارها ذات نفع عام، فتستفيد عندها من الإعفاءات الواردة في المرسوم 55 لعام 2007</td>
                        <td className="p-4 text-sm">يستفيد من الإعفاءات الواردة في القانون 22 لعام 1974، ويستفيد من الإعفاء من الضرائب الكمالية إذا حمل صفة النفع العام، وذلك بموجب المرسوم 55 لعام 2007</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
