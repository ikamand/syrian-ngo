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
              <div className="prose prose-slate max-w-none space-y-8">
                <section>
                  <h3 className="text-xl font-bold text-primary mb-4 border-r-4 border-primary pr-4">الباب الأول – الجمعيات عموماً</h3>
                  <h4 className="text-lg font-bold mb-3">الفصل الأول – أحكام عامة</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p><span className="font-bold text-primary">مادة 1-</span> تعتبر جمعية في تطبيق هذا القانون كل جماعة ذات تنظيم مستمر لمدة معينة أو غير معينة تتألف من أشخاص طبيعية أو اعتبارية لغرض غير الحصول على ربح مادي.</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p><span className="font-bold text-primary">مادة 2-</span> كل جمعية تنشأ لسبب أو لغرض غير مشروع أو مخالفة للقوانين أو للآداب أو يكون الغرض منها المساس بسلامة الجمهورية أو بشكل الحكومة الجمهوري تكون باطلة لا أثر لها.</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p><span className="font-bold text-primary">مادة 3-</span> يشترط في إنشاء الجمعية أن يوضع لها نظام مكتوب وموقع من المؤسسين ويجب أن لا يشترك في تأسيسها أو ينضم إلى عضويتها أي من الأشخاص المحرومين من ممارسة الحقوق السياسية.</p>
                      <p className="mt-2 font-bold text-sm">ويجب أن يشتمل النظام على البيانات الآتية:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>اسم الجمعية والغرض منها ومركز إدارتها على أن يكون هذا المركز في الجمهورية العربية السورية.</li>
                        <li>اسم كل الأعضاء المؤسسين ولقبه وسنه وجنسيته ومهنته وموطنه.</li>
                        <li>موارد الجمعية وكيفية استغلالها والتصرف فيها.</li>
                        <li>الهيئات التي تمثل الجمعية واختصاصات كل منها وتعيين الأعضاء الذين تتكون منهم وطرق عزلهم.</li>
                        <li>حقوق الأعضاء وواجباتهم.</li>
                        <li>طرق المراقبة المالية.</li>
                        <li>كيفية تعديل نظام الجمعية وكيفية إدماجها وتقسيمها وتكوين فروع لها.</li>
                        <li>قواعد حل الجمعية والجهة التي تؤول إليها أموالها.</li>
                      </ul>
                      <p className="mt-2 text-xs italic">"وتتضمن اللائحة التنفيذية نظاماً نموذجياً يجوز للجمعيات اتباعه في تحضير نظمها"</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p><span className="font-bold text-primary">مادة 4-</span> لا يجوز أن ينص في نظام الجمعية أن تؤول أموالها عند الحل إلى الأعضاء أو إلى ورثتهم أو أسرهم ولا يسري هذا الحكم على المال الذي يخصص لصندوق الإعانات المتبادلة أو لصندوق المعاشات كما لا يسري على الحصص في الجمعيات التعاونية.</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p><span className="font-bold text-primary">مادة 5-</span> يجوز لكل عضو ما لم يكن قد تعهد بالبقاء في الجمعية مدة معينة أن ينسحب منها في أي وقت وليس للعضو المنسحب ولا للعضو المفصول أي حق في أموال الجمعية إلا في الحالات المنصوص عليها في هذا القانون.</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p><span className="font-bold text-primary">مادة 6-</span> لا يجوز أن تكون للجمعية حقوق ملكية أو حقوق أخرى على عقارات إلا بالقدر الضروري لتحقيق الغرض الذي أنشئت من أجله ولا يسري هذا الحكم على الجمعيات الخيرية والثقافية. كما يحظر على الجمعية أن تحتفظ برصيد نقدي يزيد عن ثلاثة أمثال المصروفات السنوية للإدارة إلا بإذن من الجهة الإدارية المختصة.</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p><span className="font-bold text-primary">مادة 7-</span> لا تثبت الشخصية الاعتبارية للجمعية إلا إذا شهر نظامها وفقاً لأحكام هذا القانون.</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p><span className="font-bold text-primary">مادة 8-</span> يحدد رسم الشهر (50) ليرة سورية ولا يرد الرسم بأي حال من الأحوال ويستثنى من الشهر التعديلات التي يتوجب إدخالها على الأنظمة بناء على طلب الجهة الإدارية المختصة أو بالاستناد إلى نص قانوني يصدر بعد شهر هذه الأنظمة.</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p><span className="font-bold text-primary">مادة 9-</span> يكون شهر نظام الجمعية بمجرد قيده في السجل المعد لذلك، وينشر ملخص القيد في الجريدة الرسمية بغير مقابل وتبين اللائحة التنفيذية الشروط والأوضاع الخاصة بهذا السجل وإجراءات القيد فيه وشروطه.</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p><span className="font-bold text-primary">مادة 10-</span> تقوم الجهة الإدارية المختصة بإجراء الشهر خلال ستين يوماً من تاريخ طلبه فإذا مضت الستين يوماً دون إتمامه اعتبر الشهر واقعاً بحكم القانون، وعلى الجهة المذكورة بناءً على طلب ذوي الشأن إجراء القيد في السجل والنشر في الجريدة الرسمية.</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p><span className="font-bold text-primary">مادة 11-</span> لذوي الشأن التظلم لدى الجهة الإدارية المختصة من القرار الصادر برفض إجراء الشهر خلال ستين يوماً من تاريخ إبلاغهم قرار الرفض، ويجب أن يكون البت في هذا التظلم بقرار مسبب خلال ستين يوماً من تاريخ وصوله إلى الجهة الإدارية المختصة، وإلا اعتبر قرار الرفض كأن لم يكن.</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p><span className="font-bold text-primary">مادة 12-</span> لكل شخص حق الاطلاع على سجلات الجمعية ومستنداتها التي تقدم للشهر، والحصول على صور منها مصدق عليها بمطابقتها للأصل بعد أداء الرسم المقرر.</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p><span className="font-bold text-primary">مادة 13-</span> تسري الأحكام المتقدمة على كل تعديل في نظام الجمعية ويعتبر التعديل كأنه لم يكن ما لم يشهر.</p>
                    </div>
                  </div>
                </section>

                <div className="mt-8 p-4 bg-amber-50 border-r-4 border-amber-500 rounded text-amber-900 text-sm italic">
                  ملاحظة: هذا المحتوى مستخرج من النسخة الرسمية لقانون الجمعيات والمؤسسات الخاصة رقم 93 لعام 1958.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
