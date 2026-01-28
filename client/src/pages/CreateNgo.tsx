import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, FileText, ListChecks, Scale, Table2, Building2, Users, MapPin, Target, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function CreateNgo() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <Navbar />
      {/* Hero Banner */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold mb-3">تأسيس منظمة غير حكومية</h1>
            <p className="text-white/90 max-w-2xl">
              دليل شامل للتعرف على إجراءات ومتطلبات تأسيس المنظمات غير الحكومية في الجمهورية العربية السورية
            </p>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary" data-testid="button-back-home">
              <ArrowRight className="w-4 h-4" />
              العودة للرئيسية
            </Button>
          </Link>
          <Button 
            className="w-full md:w-auto px-8 py-6 text-lg font-bold" 
            data-testid="button-start-service"
            onClick={() => setLocation("/register-ngo")}
          >
            بدء الخدمة
          </Button>
        </div>

        <Card className="shadow-lg">
          <Tabs defaultValue="service-info" dir="rtl" className="w-full">
            <TabsList className="w-full justify-start border-b bg-white p-0 h-auto flex-wrap">
              <TabsTrigger 
                value="service-info" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-3 gap-2"
                data-testid="tab-service-info"
              >
                <FileText className="w-4 h-4" />
                معلومات الخدمة
              </TabsTrigger>
              <TabsTrigger 
                value="procedures" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-3 gap-2"
                data-testid="tab-procedures"
              >
                <ListChecks className="w-4 h-4" />
                الإجراءات
              </TabsTrigger>
              <TabsTrigger 
                value="terms" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-3 gap-2"
                data-testid="tab-terms"
              >
                <Scale className="w-4 h-4" />
                الأحكام والشروط
              </TabsTrigger>
              <TabsTrigger 
                value="legal-differences" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-3 gap-2"
                data-testid="tab-legal-differences"
              >
                <Table2 className="w-4 h-4" />
                الفوارق القانونية
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: معلومات الخدمة */}
            <TabsContent value="service-info" className="p-0">
              <CardContent className="p-6 space-y-8">
                {/* وصف الخدمة */}
                <section>
                  <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    وصف الخدمة
                  </h2>
                  <p className="text-foreground leading-relaxed bg-gray-50 p-4 border-r-4 border-primary">
                    يمكن من خلال منصة تشارك تقديم طلب خاص بتأسيس منظمة غير حكومية والإطلاع على المتطلبات واستكمال كافة الأوراق الثبوتية مما يسهل الإجراءات ويختصر الكثير من الوقت.
                  </p>
                </section>

                {/* الجهة المقدمة للخدمة */}
                <section>
                  <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    الجهة المقدمة للخدمة
                  </h2>
                  <p className="text-foreground leading-relaxed bg-gray-50 p-4">
                    وزارة الشؤون الاجتماعية والعمل
                  </p>
                </section>

                {/* الجمهور المستفيد من الخدمة */}
                <section>
                  <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    الجمهور المستفيد من الخدمة
                  </h2>
                  <p className="text-foreground leading-relaxed bg-gray-50 p-4">
                    كافة مواطني الجمهورية العربية السورية والراغبين بتأسيس منظمات أو جمعيات أو اتحادات ممن لا تقل أعمارهم عن (18) ثمانية عشر عاماً ميلادياً وتنطبق عليهم شروط التأسيس.
                  </p>
                </section>

                {/* الوثائق المطلوبة */}
                <section>
                  <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    الوثائق المطلوبة
                  </h2>
                  <div className="bg-white border">
                    <ul className="divide-y">
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>قرار تعيين مندوب الجمعية لإتمام إجراءات الشهر.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>محضر انتخاب مجلس الإدارة - الأمناء.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>قائمة بأسماء المؤسسين وجنسيتهم وسنهم ومهنتهم ومحل إقامتهم ومكان العمل، عنوان الإقامة، إن وجد المؤهل العلمي، رقم الهاتف موقع من المؤسسين.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>عقد تأسيس الجمعية أو المؤسسة موقع من المؤسسين.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>نظام الجمعية أو المؤسسة موقع من المؤسسين.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>وثيقة لا حكم عليه + صورة شخصية + صورة هوية.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>عقد إيجار بمقر للجمعية أو سند ملكية لمقر الجمعية.</span>
                      </li>
                    </ul>
                  </div>
                </section>
              </CardContent>
            </TabsContent>

            {/* Tab 2: الإجراءات */}
            <TabsContent value="procedures" className="p-0">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <ListChecks className="w-5 h-5" />
                  خطوات تأسيس المنظمة
                </h2>
                
                <div className="relative">
                  {/* Vertical line connector */}
                  <div className="absolute top-0 bottom-0 right-6 w-0.5 bg-primary/20" style={{ transform: 'translateX(50%)' }} />
                  
                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="relative flex gap-4">
                      <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0 z-10">
                        1
                      </div>
                      <div className="flex-1 bg-white border p-4">
                        <h3 className="font-bold text-foreground mb-2">التقدم بطلب تأسيس</h3>
                        <p className="text-muted-foreground">
                          يتضمن كامل المعلومات المطلوبة آنفاً، عبر بوابة المنظمات غير الحكومية.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative flex gap-4">
                      <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0 z-10">
                        2
                      </div>
                      <div className="flex-1 bg-white border p-4">
                        <h3 className="font-bold text-foreground mb-2">دراسة الطلب من قبل الجهة الحكومية المختصة</h3>
                        <p className="text-muted-foreground">
                          بحسب الصلاحيات الممنوحة ضمن سير المعاملة.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative flex gap-4">
                      <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0 z-10">
                        3
                      </div>
                      <div className="flex-1 bg-white border p-4">
                        <h3 className="font-bold text-foreground mb-2">الموافقة على طلب التأسيس</h3>
                        <p className="text-muted-foreground">
                          بعد إجراء التعديلات اللازمة على الطلب.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="relative flex gap-4">
                      <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0 z-10">
                        4
                      </div>
                      <div className="flex-1 bg-white border p-4">
                        <h3 className="font-bold text-foreground mb-2">إعداد وثائق التأسيس</h3>
                        <p className="text-muted-foreground">
                          المتضمنة بشكل خاص: النظام الداخلي، نشرات استعلام الأعضاء المؤسسين وأعضاء مجلس الأمناء حيث يمكن أن يؤسس شخص طبيعي أو اعتباري مؤسسة، ويعين مجلس أمناء مستقل عنه، وثيقة إشغال المقر.
                        </p>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="relative flex gap-4">
                      <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0 z-10">
                        5
                      </div>
                      <div className="flex-1 bg-white border p-4">
                        <h3 className="font-bold text-foreground mb-2">التقدم بالوثائق للجهة الحكومية المختصة</h3>
                        <p className="text-muted-foreground">
                          عبر بوابة المنظمات غير الحكومية.
                        </p>
                      </div>
                    </div>

                    {/* Step 6 */}
                    <div className="relative flex gap-4">
                      <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0 z-10">
                        6
                      </div>
                      <div className="flex-1 bg-white border p-4">
                        <h3 className="font-bold text-foreground mb-2">مراسلة الجهات الحكومية الأخرى</h3>
                        <p className="text-muted-foreground mb-3">
                          من قبل الجهة الحكومية المختصة:
                        </p>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>شعبة الأمن السياسي بالنسبة للأعضاء</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>محافظة المقر (بالنسبة لحاجة المحافظة لخدمات المنظمة غير الحكومية)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>الوزارة الفنية المختصة بعمل المنظمة غير الحكومية (وزارة الصحة - وزارة التربية - وزارة الثقافة)</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Step 7 */}
                    <div className="relative flex gap-4">
                      <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0 z-10">
                        7
                      </div>
                      <div className="flex-1 bg-white border p-4">
                        <h3 className="font-bold text-foreground mb-2">إصدار قرار التأسيس أو رفض التأسيس</h3>
                        <p className="text-muted-foreground">
                          من قبل وزير الشؤون الاجتماعية والعمل حسب نتيجة رأي الجهات الحكومية الشريكة ورأي وزارة الشؤون الاجتماعية والعمل.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            {/* Tab 3: الأحكام والشروط */}
            <TabsContent value="terms" className="p-0">
              <CardContent className="p-6 space-y-8">
                {/* معايير اختيار الاسم */}
                <section>
                  <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    معايير اختيار الاسم
                  </h2>
                  <div className="bg-white border">
                    <ul className="divide-y">
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>عدم وجود اسم مشابه سابق ضمن الجمعيات والمؤسسات المشهرة، أو قيد التأسيس السابقة لطلب التأسيس.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>خلو الاسم المراد اختياره من أي طابع ديني، أو سياسي، أو عنصري.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>أن يكون الاسم ذو دلالة متلائماً مع أهداف الجمعية أو المؤسسة المراد تأسيسها، ومتوافقاً مع تصنيف مجال العمل.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>في حال الرغبة في اختيار أسماء أجنبية، يجب أن يرفق الطلب بترجمة محلفة للاسم، وتوضيح مدلولاته، علماً أن الاسم المعتمد سيكون هو الاسم باللغة العربية.</span>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* معايير النطاق الجغرافي */}
                <section>
                  <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    معايير النطاق الجغرافي
                  </h2>
                  <div className="bg-white border">
                    <ul className="divide-y">
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>الجمعيات والمؤسسات التي تحمل تصنيف (التنمية والإسكان أو البيئة أو القانون والدفاع والحقوق أو الثقافة والرياضة والتسلية والفنون).</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>الجمعيات والمؤسسات العلمية.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>الجمعيات والمؤسسات التي تُعنى بالأمراض المزمنة (سرطان - سكري - ......).</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>يمكن أن يتم توسيع النشاط لمحافظتين أو ثلاثة كحد أقصى بعد الحصول على موافقة المكاتب التنفيذية لتلك المحافظات من قبل الوزارة، وبعد التأكد من إمكانيات الأعضاء المؤسسين وحاجة المحافظات لتصنيف وخدمات الجمعية أو المؤسسة قيد التأسيس.</span>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* معايير الموافقة على الأعضاء المؤسسين */}
                <section>
                  <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    معايير الموافقة على الأعضاء المؤسسين
                  </h2>
                  <div className="bg-white border">
                    <ul className="divide-y">
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>يكون الحد الأدنى لعدد الأعضاء المؤسسين في الجمعية هو 11 عضو مؤسس، على أن يكون مجلس الإدارة مؤلف من 5 أو 7 أو 9 أو 11 عضو. أما بالنسبة للمؤسسة، فيمكن أن يؤسسها شخص طبيعي أو اعتباري واحد أو أكثر، على أن يتم اختيار مجلس أمناء مؤلف من 5 أو 7 أو 9 أمناء.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>يجب أن تتوافق الأهداف المطروحة مع مؤهلات الأعضاء المؤسسين، وأن تتضمن مجموعة الأعضاء المؤسسين عضوين كحد أدنى يمتلكان المؤهلات العلمية المتناسبة مع تصنيف الجمعية أو المؤسسة قيد التأسيس ومجال عملها، أو أن يتم التعهد من قبل الأعضاء المؤسسين بتأمين الكوادر الاختصاصية.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>يجب ألّا يتواجد أكثر من عضو واحد من عائلة واحدة في تشكيلة مجلس الإدارة، منعاً من تحويل الجمعيات الأهلية لجمعيات عائلية، وفي حال كان التأسيس ضمن قرى يرتبط أغلب سكانها بعلاقات قربى، يمنع تواجد أكثر من عضوين في مجلس الإدارة من عائلة واحدة، إضافة لعدم شغل القريبين الاثنين لمنصب الرئيس وأمين الصندوق.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>في حال كان أحد الأشخاص المراد اشتراكه بتأسيس الجمعية أو المؤسسة، هو شخص اعتباري (شركة تجارية، شركة مدنية، هيئة، .....)، يجب إرفاق ما يثبت الوضع القانوني للشخص الاعتباري، إضافة إلى قرار صريح من صاحب الصلاحية في الاشتراك بتأسيس الجمعية أو المؤسسة.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>في حال كان أحد الأشخاص المراد اشتراكه بتأسيس الجمعية أو المؤسسة، هو شخص غير سوري، يجب أن يكون له مقر إقامة دائم في الجمهورية العربية السورية، مع إرفاق سند إقامة مصدق أصولاً.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>عدم اشتراك رجال الدين في تأسيس الجمعيات أو المؤسسات، منعاً من تأثير مهامهم في العمل الأهلي، تطبيقاً لأحكام قانون الجمعيات والمؤسسات الخاصة رقم 93 لعام 1958.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>عدم اشتراك العسكريين وعناصر وضباط الشرطة بأي صفة كانت في تأسيس الجمعيات والمؤسسات الخاصة، عملاً بأنظمة الخدمة.</span>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* معايير اختيار الأهداف */}
                <section>
                  <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    معايير اختيار الأهداف
                  </h2>
                  <div className="bg-white border">
                    <ul className="divide-y">
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>أن تكون الأهداف محصورة بتصنيف أساسي واحد فقط بالنسبة للجمعيات، ومجالات التخصص المرتبطة بهذا التصنيف حصراً، أما بالنسبة للمؤسسات الخاصة فيمكن اختيار حتى تصنيفين أساسيين، وفقاً لطبيعة عمل المؤسسة وقدراتها الفنية والمالية.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>أن تكون الأهداف مصاغة بطريقة عملية، بعيداً عن الإنشائية، وتتصف بالوضوح والمنطقية، القابلية للتحقيق والقياس، وأن تتم صياغتها بشكل بعيد المدى، بالاستئناس باستمارة التصنيف المعياري المعتمد، دون نسخ واستخدام عبارات الاستمارة حرفياً.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>ألّا يتجاوز عدد بنود الأهداف الأربعة بنود كحد أقصى.</span>
                      </li>
                      <li className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>عدم الخلط في صياغة الأهداف بين الهدف ووسائل تحقيقه (حيث تعتبر إقامة المحاضرات والندوات - إصدار المنشورات - التعاون مع الجمعيات أو الوزارات ........ وسائل تحقيق أهداف).</span>
                      </li>
                    </ul>
                  </div>
                </section>
              </CardContent>
            </TabsContent>

            {/* Tab 4: الفوارق القانونية */}
            <TabsContent value="legal-differences" className="p-0">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Table2 className="w-5 h-5" />
                  الفوارق القانونية بين الجمعية والمؤسسة والاتحاد
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border text-sm" data-testid="table-legal-differences">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="border p-3 text-right font-bold">الموضوع</th>
                        <th className="border p-3 text-right font-bold">الجمعية</th>
                        <th className="border p-3 text-right font-bold">المؤسسة</th>
                        <th className="border p-3 text-right font-bold">الاتحاد</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="border p-3 font-semibold bg-gray-50">التأسيس</td>
                        <td className="border p-3">تتأسس الجمعية عن طريق اجتماع عدد من الأشخاص بهدف العمل في المجال الأهلي، بموجب طلب تأسيس.</td>
                        <td className="border p-3">تتأسس المؤسسة عن طريق تخصيص مال معين بهدف العمل في المجال الأهلي، بموجب سند تأسيس (ويمكن أن يكون سند التأسيس عن طريق وصية).</td>
                        <td className="border p-3">يتأسس الاتحاد عن طريق اجتماع عدد من الجمعيات أو المؤسسات المشهرة بهدف العمل في المجال الأهلي، بموجب طلب تأسيس.</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border p-3 font-semibold">عدد الأعضاء المؤسسين</td>
                        <td className="border p-3">11 عضو مؤسس كحد أدنى</td>
                        <td className="border p-3">يمكن أن يؤسسها شخص طبيعي أو اعتباري واحد أو أكثر</td>
                        <td className="border p-3">7 جمعيات أو مؤسسات كحد أدنى</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="border p-3 font-semibold bg-gray-50">مجال التصنيف</td>
                        <td className="border p-3">تصنيف أساسي واحد فقط من التصنيف المعياري المعتمد</td>
                        <td className="border p-3">تصنيفين أساسيين كحد أقصى، وفقاً لطبيعة عمل المؤسسة وقدراتها الفنية والمالية</td>
                        <td className="border p-3">يتحدد بحسب قرار تأسيس الاتحاد</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border p-3 font-semibold">الهيكل الإداري والتنظيمي</td>
                        <td className="border p-3">
                          <ul className="list-disc list-inside space-y-1">
                            <li>هيئة عامة مكونة من المنتسبين</li>
                            <li>مجلس إدارة تنتخبه الهيئة العامة لمدة عامين</li>
                          </ul>
                        </td>
                        <td className="border p-3">
                          <ul className="list-disc list-inside space-y-1">
                            <li>مجلس أمناء يتم تعيينه أو انتخابه وتحديد مدة ولايته بحسب النظام الأساسي لكل مؤسسة (لا يوجد هيئة عامة للمؤسسة)، يعاون مجلس الأمناء جهاز تنفيذي</li>
                          </ul>
                        </td>
                        <td className="border p-3">
                          <ul className="list-disc list-inside space-y-1">
                            <li>هيئة عامة مكونة من الجمعيات أو المؤسسات المنتسبة</li>
                            <li>مجلس إدارة تنتخبه الهيئة العامة لمدة عامين</li>
                          </ul>
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="border p-3 font-semibold bg-gray-50">التبرعات</td>
                        <td className="border p-3">يحق للجمعية التصدي للجمهور بهدف جمع التبرعات، إضافة إلى تلقي التبرعات بشكل مباشر</td>
                        <td className="border p-3">لا يحق للمؤسسة التصدي للجمهور بهدف جمع التبرعات، وهذا لا يمنعها من تلقي التبرعات دون التصدي للجمهور</td>
                        <td className="border p-3">يحق للاتحاد التصدي للجمهور بهدف جمع التبرعات، إضافة إلى تلقي التبرعات بشكل مباشر</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border p-3 font-semibold">الإعفاءات</td>
                        <td className="border p-3">تستفيد من الإعفاءات الواردة في القانون 22 لعام 1974، وتستفيد من الضرائب الكمالية إذا حصلت صفة النفع العام وذلك بموجب المرسوم 55 لعام 2007</td>
                        <td className="border p-3">لا تستفيد من الإعفاءات إلا في حال اعتبارها ذات نفع عام، فتستفيد عندها من الإعفاءات الواردة في المرسوم 55 لعام 2007</td>
                        <td className="border p-3">يستفيد من الإعفاءات الواردة في القانون 22 لعام 1974، وتستفيد من الضرائب الكمالية إذا حصلت صفة النفع العام وذلك بموجب المرسوم 55 لعام 2007</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}
