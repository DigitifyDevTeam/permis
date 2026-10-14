import type { AppData, Question } from '../types'
import { addMonths, uid } from '../lib/utils'

function q(
  chapterId: string | null,
  stem: string,
  options: { text: string; correct?: boolean }[],
  explanation: string,
  imageUrl: string | null = null,
): Question {
  return {
    id: uid('q'),
    chapterId,
    stem,
    imageUrl,
    explanation,
    active: true,
    options: options.map((o) => ({
      id: uid('opt'),
      text: o.text,
      isCorrect: Boolean(o.correct),
    })),
  }
}

const chapterIds = {
  signs: 'ch_signs',
  priority: 'ch_priority',
  speed: 'ch_speed',
  penalties: 'ch_penalties',
  safety: 'ch_safety',
}

const now = new Date()
const activeEnd = addMonths(now, 3).toISOString()
const expiredEnd = addMonths(now, -1).toISOString()

const baseQuestions: Question[] = [
  q(chapterIds.signs, 'ماذا تعني الإشارة الحمراء الدائرية ذات الشريط الأبيض الأفقي؟', [
    { text: 'منع المرور في الاتجاهين', correct: true },
    { text: 'طريق ذات اتجاه واحد' },
    { text: 'وقوف إلزامي' },
    { text: 'أولوية للمشاة' },
  ], 'الإشارة الحمراء ذات الشريط الأبيض تعني منع المرور في الاتجاهين.'),
  q(chapterIds.signs, 'الإشارة المثلثة ذات الحافة الحمراء تستخدم عادة لـ:', [
    { text: 'التحذير من خطر', correct: true },
    { text: 'الإلزام' },
    { text: 'المنع' },
    { text: 'الإرشاد فقط' },
  ], 'الشكل المثلث مع حافة حمراء يشير إلى التحذير.'),
  q(chapterIds.signs, 'إشارة "قف" (STOP) تلزم السائق بـ:', [
    { text: 'التوقف التام ثم المتابعة عند الأمان', correct: true },
    { text: 'التخفيف فقط دون توقف' },
    { text: 'التوقف إن وُجدت سيارات فقط' },
    { text: 'المرور بسرعة ثابتة' },
  ], 'إشارة قف تتطلب توقفاً تاماً.'),
  q(chapterIds.signs, 'اللون الأزرق في إشارات المرور غالباً يدل على:', [
    { text: 'إلزام أو إرشاد', correct: true },
    { text: 'منع مطلق' },
    { text: 'خطر فوري فقط' },
    { text: 'منطقة أشغال' },
  ], 'الإشارات الزرقاء غالباً إلزامية أو إرشادية.'),
  q(chapterIds.signs, 'عند رؤية إشارة منع الانعطاف يساراً يجب:', [
    { text: 'عدم الانعطاف يساراً', correct: true },
    { text: 'الانعطاف بحذر' },
    { text: 'التوقف ثم الانعطاف' },
    { text: 'الانعطاف إن لم توجد سيارات' },
  ], 'إشارة المنع تعني حظراً مطلقاً للفعل المحدد.'),
  q(chapterIds.priority, 'عند تقاطع غير منظم، الأولوية تكون لـ:', [
    { text: 'القادم من اليمين', correct: true },
    { text: 'القادم من اليسار دائماً' },
    { text: 'السيارة الأسرع' },
    { text: 'أكبر مركبة' },
  ], 'قاعدة الأولوية لليمين تطبق عند غياب تنظيم خاص.'),
  q(chapterIds.priority, 'في دوار منظم بإشارات، يجب على الداخل:', [
    { text: 'احترام إشارات وإعطاء الأولوية حسب التنظيم', correct: true },
    { text: 'الدخول دائماً دون توقف' },
    { text: 'إيقاف كل المركبات داخل الدوار' },
    { text: 'استعمال المنبّه فقط' },
  ], 'الدخول إلى الدوار يخضع للتنظيم الموجود.'),
  q(chapterIds.priority, 'عند مرور سيارة إسعاف بأضواء وصفارة:', [
    { text: 'إفساح الطريق فوراً إن أمكن بأمان', correct: true },
    { text: 'متابعة السير بنفس السرعة' },
    { text: 'التسابق معها' },
    { text: 'التوقف وسط التقاطع دائماً' },
  ], 'مركبات الطوارئ لها أولوية عند استخدام الإشارات الخاصة.'),
  q(chapterIds.priority, 'المشاة على ممر الراجلين لهم:', [
    { text: 'الأولوية عند عبورهم بشكل صحيح', correct: true },
    { text: 'لا أولوية أبداً' },
    { text: 'الأولوية ليلاً فقط' },
    { text: 'الأولوية إن رفعوا اليد فقط' },
  ], 'يجب احترام ممرات الراجلين.'),
  q(chapterIds.priority, 'عند الخروج من طريق ترابي إلى طريق معبّد:', [
    { text: 'إعطاء الأولوية لمستعملي الطريق المعبّد', correct: true },
    { text: 'أخذ الأولوية دائماً' },
    { text: 'التوقف غير ضروري' },
    { text: 'استعمال المنبّه يكفي' },
  ], 'الخروج من طريق ثانوي يتطلب إعطاء الأولوية.'),
  q(chapterIds.speed, 'السرعة القصوى داخل التجمعات السكنية عادةً تكون في حدود:', [
    { text: '50 كم/س ما لم تُشر إشارة بخلاف ذلك', correct: true },
    { text: '90 كم/س' },
    { text: '110 كم/س' },
    { text: '30 كم/س دائماً دون استثناء' },
  ], 'السرعة داخل العمران محدودة وغالباً 50 كم/س.'),
  q(chapterIds.speed, 'عند المطر الغزير يجب:', [
    { text: 'تخفيض السرعة وزيادة مسافة الأمان', correct: true },
    { text: 'القيادة بنفس السرعة المعتادة' },
    { text: 'استعمال الأضواء العالية فقط' },
    { text: 'التوقف في وسط الطريق' },
  ], 'الظروف الجوية السيئة تتطلب تكييف السرعة.'),
  q(chapterIds.speed, 'مسافة الأمان تعني:', [
    { text: 'مسافة كافية للتوقف عند فرملة المقدم', correct: true },
    { text: 'المسافة الجانبية فقط' },
    { text: 'مسافة الرؤية ليلاً فقط' },
    { text: 'مسافة الوقوف في الموقف' },
  ], 'مسافة الأمان ضرورية لتفادي الاصطدام الخلفي.'),
  q(chapterIds.speed, 'التجاوز ممنوع عند:', [
    { text: 'المنحدرات الحادة والمنحنيات غير الواضحة الرؤية', correct: true },
    { text: 'الطريق المستقيم الواسع دائماً' },
    { text: 'وجود خط متقطع فقط' },
    { text: 'القيادة نهاراً' },
  ], 'الرؤية غير الكافية تجعل التجاوز خطراً وممنوعاً.'),
  q(chapterIds.speed, 'استعمال الهاتف أثناء القيادة:', [
    { text: 'يزيد خطر الحوادث ويُعد مخالفة', correct: true },
    { text: 'مسموح إن كانت السرعة منخفضة' },
    { text: 'مسموح داخل المدن فقط' },
    { text: 'لا يؤثر على الانتباه' },
  ], 'الهاتف يشتت الانتباه ويُحظر أثناء السياقة.'),
  q(chapterIds.penalties, 'تجاوز الضوء الأحمر قد يؤدي إلى:', [
    { text: 'عقوبات وغرامات وسحب نقاط/رخصة حسب القانون', correct: true },
    { text: 'تنبيه شفوي فقط دائماً' },
    { text: 'لا عقوبة إن لم يحدث حادث' },
    { text: 'غرامة رمزية دون تسجيل' },
  ], 'تجاوز الإشارة الحمراء مخالفة خطيرة.'),
  q(chapterIds.penalties, 'السياقة تحت تأثير الكحول:', [
    { text: 'ممنوعة وتعرّض لعقوبات صارمة', correct: true },
    { text: 'مسموحة ليلاً فقط' },
    { text: 'مسموحة إن كانت المسافة قصيرة' },
    { text: 'غير منظمة قانوناً' },
  ], 'الكحول والقيادة أمران لا يجتمعان.'),
  q(chapterIds.penalties, 'عدم ربط حزام الأمان:', [
    { text: 'مخالفة ويعرّض الركاب للخطر', correct: true },
    { text: 'اختياري للسائق فقط' },
    { text: 'إلزامي خارج المدينة فقط' },
    { text: 'غير مهم في السرعات المنخفضة' },
  ], 'حزام الأمان إلزامي ويقلل الإصابات.'),
  q(chapterIds.penalties, 'الوقوف في مكان مخصص لذوي الاحتياجات:', [
    { text: 'ممنوع لغير المرخّص لهم', correct: true },
    { text: 'مسموح لدقائق' },
    { text: 'مسموح ليلاً' },
    { text: 'مسموح إن كان المكان فارغاً طويلاً' },
  ], 'الأماكن المخصصة محمية قانوناً.'),
  q(chapterIds.penalties, 'الفرار بعد حادث:', [
    { text: 'جريمة/مخالفة جسيمة تُضاعف المسؤولية', correct: true },
    { text: 'مقبول إن كان الضرر بسيطاً' },
    { text: 'مقبول إن لم توجد إصابات ظاهرة' },
    { text: 'لا يترتب عليه شيء' },
  ], 'يجب البقاء وتقديم المساعدة والإبلاغ.'),
  q(chapterIds.safety, 'قبل تغيير الاتجاه يجب:', [
    { text: 'الإشارة مسبقاً والتأكد من المرايا والنقطة العمياء', correct: true },
    { text: 'الانعطاف ثم الإشارة' },
    { text: 'استعمال المنبّه فقط' },
    { text: 'التوقف دائماً وسط الطريق' },
  ], 'الإشارة والمراقبة تمنع الحوادث عند تغيير المسار.'),
  q(chapterIds.safety, 'عند اقتراب مدرسة يجب:', [
    { text: 'تخفيف السرعة والانتباه الشديد للأطفال', correct: true },
    { text: 'السرعة القصوى للطريق' },
    { text: 'استعمال الأضواء العالية' },
    { text: 'التجاوز السريع' },
  ], 'مناطق المدارس تتطلب حذراً مضاعفاً.'),
  q(chapterIds.safety, 'الإطارات غير السليمة:', [
    { text: 'تقلل التماسك وتزيد خطر الحوادث', correct: true },
    { text: 'لا تؤثر على الفرملة' },
    { text: 'مفيدة على الطرق المبللة' },
    { text: 'مسألة جمالية فقط' },
  ], 'سلامة الإطارات جزء أساسي من السلامة.'),
  q(chapterIds.safety, 'في حالة ضباب كثيف يُستحسن:', [
    { text: 'تخفيض السرعة واستعمال أضواء الضباب المناسبة', correct: true },
    { text: 'الأضواء العالية فقط' },
    { text: 'السرعة المعتادة مع المنبّه' },
    { text: 'إيقاف المركبة على المسار الأيسر' },
  ], 'الضباب يقلل الرؤية ويتطلب تكييف القيادة.'),
  q(chapterIds.safety, 'نقل طفل دون مقعد ملائم:', [
    { text: 'خطر ومخالف لقواعد السلامة', correct: true },
    { text: 'مقبول في المقاعد الخلفية دائماً' },
    { text: 'مقبول لمسافات قصيرة' },
    { text: 'غير منظم' },
  ], 'حماية الأطفال تتطلب تجهيزات خاصة.'),
  q(chapterIds.signs, 'إشارة أولوية المرور (معين أصفر) تعني:', [
    { text: 'أنت على طريق ذي أولوية', correct: true },
    { text: 'أعط الأولوية دائماً' },
    { text: 'وقوف ممنوع' },
    { text: 'نهاية الطريق' },
  ], 'المعين الأصفر يدل على طريق ذات أولوية.'),
  q(chapterIds.signs, 'نهاية منطقة السرعة المحددة تُشار إليها غالباً بـ:', [
    { text: 'إشارة شطب/نهاية التحديد', correct: true },
    { text: 'إشارة قف' },
    { text: 'إشارة منع الدخول' },
    { text: 'إشارة مستشفى' },
  ], 'إشارات النهاية تلغي التقييد السابق.'),
  q(chapterIds.priority, 'عند تقاطع بإشارة ضوئية صفراء ثابتة:', [
    { text: 'التأهب بحذر مع احترام قواعد الأولوية', correct: true },
    { text: 'المرور بأقصى سرعة' },
    { text: 'التوقف التام كإشارة قف دائماً دون استثناء' },
    { text: 'الرجوع للخلف' },
  ], 'الأصفر يتطلب حذراً واستعداداً للتوقف إن لزم.'),
  q(chapterIds.priority, 'عند وجود شرطي ينظّم المرور:', [
    { text: 'تعليماته تسبق الإشارات الأخرى', correct: true },
    { text: 'الإشارات الضوئية أولى دائماً' },
    { text: 'يمكن تجاهل التعليمات' },
    { text: 'الأولوية للسرعة' },
  ], 'رجل الأمن له الأولوية في تنظيم المرور.'),
  q(chapterIds.speed, 'التجاوز من اليمين:', [
    { text: 'ممنوع في الحالات العادية', correct: true },
    { text: 'مفضل دائماً' },
    { text: 'إلزامي على الطرق السريعة' },
    { text: 'مسموح عند المطر فقط' },
  ], 'التجاوز يتم من اليسار وفق القواعد العامة.'),
  q(chapterIds.speed, 'عند الاقتراب من منعرج حاد:', [
    { text: 'تخفيض السرعة قبل الدخول للمنعرَج', correct: true },
    { text: 'السرعة ثم الفرملة داخل المنعرَج' },
    { text: 'زيادة السرعة للحفاظ على التوازن' },
    { text: 'إيقاف المحرك' },
  ], 'الفرملة قبل المنعرَج أكثر أماناً.'),
  q(chapterIds.penalties, 'القيادة دون رخصة سارية:', [
    { text: 'مخالفة جسيمة', correct: true },
    { text: 'مسموحة مع مرافق' },
    { text: 'مسموحة داخل الحي' },
    { text: 'غير مهمة إن كانت السيارة مؤمّنة' },
  ], 'الرخصة شرط قانوني للسياقة.'),
  q(chapterIds.penalties, 'تجاوز خط متواصل:', [
    { text: 'ممنوع ويعرّض للمخالفة', correct: true },
    { text: 'مسموح إن كان الطريق فارغاً' },
    { text: 'مسموح نهاراً فقط' },
    { text: 'مسموح للدراجات فقط' },
  ], 'الخط المتواصل يُحظر تجاوزه.'),
  q(chapterIds.safety, 'فحص المرايا قبل الانطلاق:', [
    { text: 'ضروري لضبط الرؤية والسلامة', correct: true },
    { text: 'اختياري' },
    { text: 'مهم ليلاً فقط' },
    { text: 'يُجرى بعد الوصول فقط' },
  ], 'ضبط المرايا جزء من التحضير للقيادة.'),
  q(chapterIds.safety, 'التعب أثناء القيادة الطويل:', [
    { text: 'يستدعي راحة دورية', correct: true },
    { text: 'يُعالَج برفع الصوت فقط' },
    { text: 'لا يؤثر على التركيز' },
    { text: 'يُحلّ بفتح النافذة دائماً دون توقف' },
  ], 'التعب من عوامل الخطر الرئيسية.'),
  q(chapterIds.signs, 'إشارة الأشغال تعني:', [
    { text: 'وجود أشغال والحاجة لليقظة وتخفيض السرعة', correct: true },
    { text: 'طريق سريع جديد' },
    { text: 'موقف عمومي' },
    { text: 'محطة وقود' },
  ], 'مناطق الأشغال تتطلب حذراً خاصاً.'),
  q(chapterIds.signs, 'إشارة منع الوقوف تختلف عن منع التوقف في أن:', [
    { text: 'منع الوقوف يخص الركن بينما منع التوقف أشد', correct: true },
    { text: 'لا فرق بينهما أبداً' },
    { text: 'منع الوقوف يعني السير reverse' },
    { text: 'منع التوقف يعني الركن فقط' },
  ], 'هناك فرق قانوني بين الوقوف والتوقف.'),
  q(chapterIds.priority, 'عند الالتقاء في طريق ضيق بمنحدر:', [
    { text: 'غالباً يعطي النازل الأولوية للصاعد وفق القواعد المحلية', correct: true },
    { text: 'الأولوية دائماً للأكبر حجماً فقط' },
    { text: 'لا قواعد لهذا الوضع' },
    { text: 'الأولوية لمن يستعمل المنبّه أولاً' },
  ], 'قواعد الأولوية في المنحدرات تهدف لتسهيل المرور الآمن.'),
  q(chapterIds.speed, 'السرعة المفرطة ليلاً:', [
    { text: 'أشد خطورة بسبب ضعف الرؤية', correct: true },
    { text: 'أأمن من النهار' },
    { text: 'مسموحة خارج المدن دائماً' },
    { text: 'لا علاقة لها بالحوادث' },
  ], 'الليل يقلل الإدراك البصري ويزيد الخطر.'),
  q(chapterIds.safety, 'عند وقوع حادث خفيف دون إصابات:', [
    { text: 'تأمين المكان وتبادل المعلومات عند الحاجة', correct: true },
    { text: 'مغادرة المكان فوراً دون توثيق' },
    { text: 'تحريك الضحايا دائماً حتى مع إصابة مشتبهة' },
    { text: 'تجاهل التأمين' },
  ], 'السلوك السليم بعد الحادث يحمي الجميع قانوناً وصحياً.'),
  q(chapterIds.signs, 'الإشارة الدائرية الزرقاء مع سهم للأمام تعني غالباً:', [
    { text: 'اتجاه إلزامي للأمام', correct: true },
    { text: 'منع المرور' },
    { text: 'طريق زلق' },
    { text: 'موقف سيارات' },
  ], 'الأزرق الدائري غالباً إلزام اتجاه.'),
  q(chapterIds.priority, 'قبل الدخول إلى طريق رئيسي من طريق فرعي:', [
    { text: 'التوقف أو التمهل وإعطاء الأولوية', correct: true },
    { text: 'الدخول بأقصى سرعة' },
    { text: 'الاعتماد على المنبّه فقط' },
    { text: 'أخذ الأولوية تلقائياً' },
  ], 'الطرق الرئيسية لها أولوية على الفرعية.'),
  q(chapterIds.penalties, 'ترك الأطفال دون مراقبة في مركبة مغلقة:', [
    { text: 'سلوك خطر وقد يُعاقب عليه', correct: true },
    { text: 'مقبول في الشتاء فقط' },
    { text: 'مقبول لأقل من ساعة' },
    { text: 'غير مهم إن كانت النوافذ مواربة قليلاً' },
  ], 'سلامة الأطفال مسؤولية قانونية وأخلاقية.'),
  q(chapterIds.safety, 'أضواء التوقف (الفرامل) تُستخدم لـ:', [
    { text: 'تنبيه من خلفك عند التخفيف أو الفرملة', correct: true },
    { text: 'الإنارة الليلية للطرق' },
    { text: 'الإشارة إلى الأولوية' },
    { text: 'الضباب فقط' },
  ], 'ضوء الفرامل وسيلة تواصل أساسية بين السائقين.'),
  q(null, 'الهدف من الامتحان النظري لقانون المرور هو التحقق من:', [
    { text: 'معرفة قواعد المرور والسلوك الآمن', correct: true },
    { text: 'مهارة إصلاح المحرك' },
    { text: 'سرعة الكتابة' },
    { text: 'معرفة أسعار الوقود فقط' },
  ], 'امتحان القانون يقيس المعرفة النظرية للقيادة الآمنة.'),
]

/** Original exam-style questions (images assigned below, topic-synced). */
const textOnlyQuestions: Question[] = [
  q(chapterIds.signs, 'إشارة منع الدخول تعني:', [
    { text: 'يُمنع دخول المركبات من هذا الاتجاه', correct: true },
    { text: 'يُسمح بالمرور للدراجات فقط' },
    { text: 'وقوف إلزامي' },
  ], 'إشارة منع الدخول تحظر دخول المركبات من ذلك الاتجاه.'),
  q(chapterIds.signs, 'الإشارة التحذيرية المثلثة ذات الحافة الحمراء تنبّه إلى:', [
    { text: 'خطر قادم يجب الاحتياط منه', correct: true },
    { text: 'اتجاه إلزامي' },
    { text: 'نهاية الطريق' },
  ], 'المثلث ذو الحافة الحمراء إشارة تحذير.'),
  q(chapterIds.signs, 'عند وجود إشارة تحديد السرعة 50 كم/س يجب:', [
    { text: 'عدم تجاوز 50 كم/س', correct: true },
    { text: 'السير بسرعة لا تقل عن 50 كم/س' },
    { text: 'تجاهل الإشارة خارج المدينة' },
  ], 'رقم السرعة على الإشارة يحدد الحد الأقصى المسموح.'),
  q(chapterIds.signs, 'إشارة الاتجاه الإلزامي إلى اليمين تلزمك بـ:', [
    { text: 'الانعطاف يميناً', correct: true },
    { text: 'الانعطاف يساراً' },
    { text: 'التوقف ثم الاختيار بحرية' },
  ], 'السهم الأزرق الإلزامي يفرض الاتجاه المشار إليه.'),
  q(chapterIds.signs, 'إشارة ممر الراجلين تنبّه إلى:', [
    { text: 'وجود مكان عبور للمشاة والانتباه لهم', correct: true },
    { text: 'منع مرور المشاة' },
    { text: 'موقف حافلات فقط' },
  ], 'يجب تخفيف السرعة واحترام المشاة عند ممر الراجلين.'),
  q(chapterIds.signs, 'إشارة منع التجاوز تعني:', [
    { text: 'يُمنع تجاوز المركبات الأخرى', correct: true },
    { text: 'يُمنع الوقوف فقط' },
    { text: 'يُسمح بالتجاوز من اليمين' },
  ], 'إشارة منع التجاوز تحظر مناورات التجاوز في ذلك الجزء.'),
  q(chapterIds.signs, 'عند إشارة أشغال على الطريق يجب:', [
    { text: 'تخفيض السرعة وزيادة الحذر', correct: true },
    { text: 'السرعة القصوى المعتادة' },
    { text: 'التوقف النهائي دائماً' },
  ], 'مناطق الأشغال تتطلب يقظة وتخفيفاً للسرعة.'),
  q(chapterIds.signs, 'إشارة طريق زلق تحذّر من:', [
    { text: 'انخفاض تماسك العجلات خاصة عند البلل', correct: true },
    { text: 'منع استعمال الفرامل' },
    { text: 'إلزام السير بأقصى سرعة' },
  ], 'يجب تكييف السرعة عند خطر الانزلاق.'),
  q(chapterIds.signs, 'إشارة مستشفى أو مركز صحي تعني غالباً:', [
    { text: 'التخفيف وتجنب الإزعاج غير الضروري', correct: true },
    { text: 'منع المرور مطلقاً' },
    { text: 'طريق سريع' },
  ], 'قرب المنشآت الصحية يستدعي هدوءاً وحذراً.'),
  q(chapterIds.signs, 'نهاية طريق ذات أولوية تُشار إليها عادة بـ:', [
    { text: 'إشارة نهاية الأولوية', correct: true },
    { text: 'إشارة قف حمراء دائماً' },
    { text: 'إشارة زرقاء إلزامية' },
  ], 'بعد نهاية الأولوية تعود قواعد الأولوية العادية.'),

  q(chapterIds.priority, 'في تقاطع بلا إشارات ولا شرطي، الأولوية لـ:', [
    { text: 'القادم من اليمين', correct: true },
    { text: 'القادم من اليسار' },
    { text: 'من يسير بسرعة أكبر' },
  ], 'قاعدة الأولوية لليمين هي الأصل عند غياب تنظيم.'),
  q(chapterIds.priority, 'عند الدخول إلى دوار، يجب عموماً:', [
    { text: 'إعطاء الأولوية للمركبات داخل الدوار إن فرض ذلك التنظيم', correct: true },
    { text: 'الدخول دون النظر' },
    { text: 'التوقف وسط الدوار' },
  ], 'احترم الإشارات وأولوية المركبات المنخرطة في الدوار.'),
  q(chapterIds.priority, 'المشاة الذين بدأوا عبور ممر الراجلين:', [
    { text: 'لهم الأولوية ويجب تمكينهم من العبور', correct: true },
    { text: 'لا أولوية لهم أبداً' },
    { text: 'الأولوية للسيارات دائماً' },
  ], 'حماية المشاة على ممر الراجلين واجبة.'),
  q(chapterIds.priority, 'سيارة إسعاف بصفارة وأضواء خاصة تقترب منك:', [
    { text: 'أفسح لها الطريق بأمان', correct: true },
    { text: 'زد سرعتك لتسبقها' },
    { text: 'تجاهلها إن كنت مستعجلاً' },
  ], 'مركبات التدخل لها أولوية عند استعمال إشاراتها.'),
  q(chapterIds.priority, 'عند تقاطع ينظّمه شرطي مرور:', [
    { text: 'تعليمات الشرطي تسبق الإشارات الضوئية', correct: true },
    { text: 'الضوء الأخضر أولى من إشارة الشرطي' },
    { text: 'يمكنك اختيار ما يناسبك' },
  ], 'رجل الأمن له السلطة العليا في تنظيم المرور.'),
  q(chapterIds.priority, 'الخروج من موقف أو طريق خاص إلى الطريق العام يتطلب:', [
    { text: 'إعطاء الأولوية لمستعملي الطريق العام', correct: true },
    { text: 'أخذ الأولوية مباشرة' },
    { text: 'استعمال المنبّه فقط دون نظر' },
  ], 'الداخل إلى الطريق العام يتنازل عن الأولوية.'),
  q(chapterIds.priority, 'الضوء الأحمر يعني:', [
    { text: 'التوقف قبل خط الوقوف أو الإشارة', correct: true },
    { text: 'المرور إن لم توجد سيارات' },
    { text: 'التخفيف فقط دون توقف' },
  ], 'الأحمر يلزم بالتوقف التام.'),
  q(chapterIds.priority, 'الضوء الأخضر يسمح بالمرور بشرط:', [
    { text: 'أن يكون الطريق حراً والعبور آمناً', correct: true },
    { text: 'المرور مهما كانت الوضعية' },
    { text: 'السرعة القصوى دون نظر' },
  ], 'الأخضر لا يعفي من واجب الحذر.'),
  q(chapterIds.priority, 'عند ضوء أصفر ثابت بعد الأخضر:', [
    { text: 'استعد للتوقف إن أمكن بأمان', correct: true },
    { text: 'زد السرعة لاجتياز التقاطع بأي ثمن' },
    { text: 'ارجع للخلف فوراً' },
  ], 'الأصفر إنذار بقرب الأحمر.'),
  q(chapterIds.priority, 'في طريق ضيق يتعذر فيه التلاقي بسهولة:', [
    { text: 'يتعاون السائقان ويمرّ من يكون في وضع أسهل وفق القواعد', correct: true },
    { text: 'يمرّ الأسرع دائماً' },
    { text: 'لا قواعد لهذا الوضع' },
  ], 'التعاون والحذر يمنعان الحوادث في الممرات الضيقة.'),

  q(chapterIds.speed, 'الحد الأقصى المعتاد داخل المناطق العمرانية هو:', [
    { text: '50 كم/س ما لم تُحدد إشارة خلاف ذلك', correct: true },
    { text: '90 كم/س' },
    { text: '110 كم/س' },
  ], 'داخل العمران السرعة محدودة وغالباً بـ 50 كم/س.'),
  q(chapterIds.speed, 'على الطرق المرقّمة خارج العمران، السرعة القصوى للسيارات السياحية غالباً:', [
    { text: '90 كم/س ما لم تُشر بخلاف ذلك', correct: true },
    { text: '50 كم/س دائماً' },
    { text: '130 كم/س' },
  ], 'خارج المدن تطبق حدود أعلى مع احترام الإشارات.'),
  q(chapterIds.speed, 'على الطرق السيارة، السرعة القصوى للسيارات السياحية غالباً:', [
    { text: '110 كم/س ما لم تُحدد إشارة أقل', correct: true },
    { text: '50 كم/س' },
    { text: 'بدون حد' },
  ], 'الطرق السيارة لها حدود خاصة يجب احترامها.'),
  q(chapterIds.speed, 'عند المطر أو الطريق المبلل يجب:', [
    { text: 'تخفيض السرعة وزيادة مسافة الأمان', correct: true },
    { text: 'الحفاظ على نفس السرعة الجافة' },
    { text: 'استعمال الأضواء العالية فقط' },
  ], 'التماسك ينخفض على الطرق المبللة.'),
  q(chapterIds.speed, 'التجاوز يتم عادة من:', [
    { text: 'اليسار', correct: true },
    { text: 'اليمين في كل الحالات' },
    { text: 'الوسط فقط' },
  ], 'القاعدة العامة: التجاوز من اليسار.'),
  q(chapterIds.speed, 'الخط المتواصل في وسط الطريق يعني:', [
    { text: 'يُمنع تجاوزه أو تخطيه', correct: true },
    { text: 'يُسمح بالتجاوز بحرية' },
    { text: 'موقف مسموح عليه' },
  ], 'الخط المتواصل حاجز يُحظر تجاوزه.'),
  q(chapterIds.speed, 'الخط المتقطع يسمح بـ:', [
    { text: 'التجاوز إذا كان آمناً ومسموحاً', correct: true },
    { text: 'الوقوف فوقه' },
    { text: 'السير عكس الاتجاه' },
  ], 'الخط المتقطع يمكن قطعه عند أمان المناورة.'),
  q(chapterIds.speed, 'قبل منعرج غير واضح الرؤية:', [
    { text: 'خفّف السرعة مسبقاً', correct: true },
    { text: 'زد السرعة للحفاظ على التوازن' },
    { text: 'افرمل بقوة داخل المنعرَج فقط' },
  ], 'التخفيف قبل المنعرَج أأمن من الفرملة داخله.'),
  q(chapterIds.speed, 'مسافة الأمان بينك وبين المركبة الأمامية:', [
    { text: 'يجب أن تسمح بالتوقف دون اصطدام', correct: true },
    { text: 'غير مهمة داخل المدينة' },
    { text: 'متر واحد يكفي دائماً' },
  ], 'اترك مسافة كافية حسب السرعة والظروف.'),
  q(chapterIds.speed, 'استعمال الهاتف باليد أثناء السياقة:', [
    { text: 'ممنوع ويزيد خطر الحوادث', correct: true },
    { text: 'مسموح تحت 30 كم/س' },
    { text: 'مسموح خارج المدن فقط' },
  ], 'الهاتف يشتت الانتباه ويُعد مخالفة.'),

  q(chapterIds.penalties, 'السياقة تحت تأثير الكحول:', [
    { text: 'ممنوعة وتعرّض لعقوبات صارمة', correct: true },
    { text: 'مسموحة إن كانت الكمية قليلة حسب تقديرك' },
    { text: 'مسموحة ليلاً فقط' },
  ], 'الكحول والقيادة لا يجتمعان.'),
  q(chapterIds.penalties, 'عدم ربط حزام الأمان للسائق:', [
    { text: 'مخالفة ويعرّض للخطر', correct: true },
    { text: 'اختياري داخل المدينة' },
    { text: 'إلزامي على الطرق السيارة فقط' },
  ], 'حزام الأمان إلزامي ويحمي عند الاصطدام.'),
  q(chapterIds.penalties, 'تجاوز الإشارة الحمراء:', [
    { text: 'مخالفة خطيرة قد تؤدي لعقوبات مشددة', correct: true },
    { text: 'مقبول إن لم يمر أحد' },
    { text: 'تنبيه شفوي فقط دائماً' },
  ], 'تجاوز الأحمر من أخطر المخالفات.'),
  q(chapterIds.penalties, 'الوقوف في مكان مخصص لذوي الاحتياجات الخاصة دون ترخيص:', [
    { text: 'ممنوع ويعرّض للمخالفة', correct: true },
    { text: 'مسموح لخمس دقائق' },
    { text: 'مسموح ليلاً' },
  ], 'هذه الأماكن محمية لغير المرخّص لهم.'),
  q(chapterIds.penalties, 'مغادرة مكان حادث دون تقديم المساعدة أو الإجراءات اللازمة:', [
    { text: 'تصرف جسيم يضاعف المسؤولية', correct: true },
    { text: 'مقبول إن كان الضرر بسيطاً' },
    { text: 'لا يترتب عليه شيء' },
  ], 'يجب البقاء وتأمين المكان والقيام بالواجب القانوني.'),
  q(chapterIds.penalties, 'القيادة برخصة منتهية الصلوحية:', [
    { text: 'غير قانونية', correct: true },
    { text: 'مسموحة لأسبوع بعد الانتهاء' },
    { text: 'مسموحة داخل الحي فقط' },
  ], 'يجب أن تكون الرخصة سارية المفعول.'),

  q(chapterIds.safety, 'قبل تغيير المسار يجب:', [
    { text: 'النظر في المرايا والإشارة مسبقاً ثم المناورة بأمان', correct: true },
    { text: 'تغيير المسار ثم الإشارة' },
    { text: 'المنبّه فقط دون النظر' },
  ], 'المراقبة والإشارة تسبقان تغيير الاتجاه.'),
  q(chapterIds.safety, 'قرب مدرسة في وقت خروج التلاميذ:', [
    { text: 'خفّف السرعة وكن شديد الانتباه', correct: true },
    { text: 'سر بأقصى سرعة مسموحة دون حذر إضافي' },
    { text: 'استعمل الأضواء العالية' },
  ], 'الأطفال غير متوقعين الحركة قرب المدارس.'),
  q(chapterIds.safety, 'في الضباب الكثيف يُستحسن:', [
    { text: 'تخفيض السرعة واستعمال أضواء الضباب المناسبة', correct: true },
    { text: 'الأضواء العالية فقط' },
    { text: 'السير بنفس سرعة الطقس الصحو' },
  ], 'الضباب يقلل الرؤية كثيراً.'),
  q(chapterIds.safety, 'نقل رضيع أو طفل صغير في السيارة يتطلب:', [
    { text: 'مقعداً ملائماً حسب السن والوزن', correct: true },
    { text: 'حمله على الحضن دائماً' },
    { text: 'لا تجهيز خاص لمسافات قصيرة' },
  ], 'حماية الأطفال تتطلب تجهيزاً مناسباً.'),
  q(chapterIds.safety, 'عند الشعور بالتعب الشديد أثناء رحلة طويلة:', [
    { text: 'توقّف للراحة قبل المتابعة', correct: true },
    { text: 'زد سرعة الوصول بسرعة' },
    { text: 'اشرب قهوة فقط دون توقف أبداً' },
  ], 'التعب من أخطر عوامل الحوادث.'),
  q(chapterIds.safety, 'أضواء الوضع (الصغيرة) تُستعمل خاصة:', [
    { text: 'عند التوقف أو للإنارة الخفيفة حسب الوضعية القانونية', correct: true },
    { text: 'للسير السريع على الطريق السيارة ليلاً بدل الأضواء الأخرى' },
    { text: 'بدلاً من أضواء الضباب في كل الحالات' },
  ], 'لكل نوع إضاءة استعمال مناسب.'),
  q(chapterIds.safety, 'قبل الانطلاق من موقف على جانب الطريق:', [
    { text: 'راقب المرور وأشِر ثم اندمج بحذر', correct: true },
    { text: 'انطلق فوراً دون نظر' },
    { text: 'اعتمد على المنبّه فقط' },
  ], 'الاندماج في السير يحتاج مراقبة وإشارة.'),
  q(chapterIds.safety, 'عند وجود دراجة هوائية أمامك:', [
    { text: 'اترك مسافة أمان كافية عند التجاوز', correct: true },
    { text: 'تجاوزها ملاصقاً لها' },
    { text: 'المنبّه المستمر واجب دائماً' },
  ], 'مستعملو الدراجة ضعفاء في الحوادث ويحتاجون حماية.'),
  q(null, 'الغرض من التمرين والامتحان التجريبي في تطبيق طريق هو:', [
    { text: 'التدرّب على فهم قواعد المرور بأسلوب قريب من الامتحان', correct: true },
    { text: 'استبدال الرخصة الرسمية' },
    { text: 'تعليميل المحرك عن بُعد' },
  ], 'التطبيق وسيلة تعليمية للتحضير النظري.'),
]

/** One local illustration per textOnlyQuestions entry (same order, topic-synced). */
const textOnlyImages = [
  '/situations/no-entry.jpg',
  '/situations/warning.jpg',
  '/situations/speed.jpg',
  '/situations/mandatory-right.jpg',
  '/situations/pedestrian.jpg',
  '/situations/no-overtake.jpg',
  '/situations/works.jpg',
  '/situations/slippery.jpg',
  '/situations/hospital.jpg',
  '/situations/end-priority.jpg',
  '/situations/intersection.jpg',
  '/situations/roundabout.jpg',
  '/situations/pedestrian.jpg',
  '/situations/emergency.jpg',
  '/situations/police.jpg',
  '/situations/merge.jpg',
  '/situations/lights.jpg',
  '/situations/green-light.jpg',
  '/situations/yellow-light.jpg',
  '/situations/narrow-road.jpg',
  '/situations/speed.jpg',
  '/situations/speed-90.jpg',
  '/situations/speed-110.jpg',
  '/situations/rain.jpg',
  '/situations/dashed-line.jpg',
  '/situations/solid-line.jpg',
  '/situations/dashed-line.jpg',
  '/situations/curve.jpg',
  '/situations/distance.jpg',
  '/situations/phone.jpg',
  '/situations/alcohol.jpg',
  '/situations/seatbelt.jpg',
  '/situations/lights.jpg',
  '/situations/disabled-parking.jpg',
  '/situations/accident.jpg',
  '/situations/license.jpg',
  '/situations/lane-change.jpg',
  '/situations/school.jpg',
  '/situations/fog.jpg',
  '/situations/child-seat.jpg',
  '/situations/fatigue.jpg',
  '/situations/sidelights.jpg',
  '/situations/merge.jpg',
  '/situations/bicycle.jpg',
  '/situations/exam.jpg',
] as const

const textOnlyQuestionsWithImages: Question[] = textOnlyQuestions.map(
  (question, index) => ({
    ...question,
    imageUrl: textOnlyImages[index] ?? question.imageUrl,
  }),
)

const situationImages = [
  '/situations/no-entry.jpg',
  '/situations/warning.jpg',
  '/situations/stop.jpg',
  '/situations/mandatory.jpg',
  '/situations/no-left.jpg',
  '/situations/intersection.jpg',
  '/situations/roundabout.jpg',
  '/situations/emergency.jpg',
  '/situations/pedestrian.jpg',
  '/situations/speed.jpg',
  '/situations/rain.jpg',
  '/situations/lights.jpg',
  '/situations/seatbelt.jpg',
  '/situations/fog.jpg',
  '/situations/school.jpg',
]

const chapterDefaultImage: Record<string, string> = {
  [chapterIds.signs]: '/situations/stop.jpg',
  [chapterIds.priority]: '/situations/intersection.jpg',
  [chapterIds.speed]: '/situations/speed.jpg',
  [chapterIds.penalties]: '/situations/lights.jpg',
  [chapterIds.safety]: '/situations/seatbelt.jpg',
}

const questionsWithImages: Question[] = baseQuestions.map((question, index) => ({
  ...question,
  imageUrl:
    question.imageUrl ??
    (question.chapterId
      ? chapterDefaultImage[question.chapterId] ?? situationImages[index % situationImages.length]
      : situationImages[index % situationImages.length]),
}))

// Assign more specific images by keyword in the stem for clearer situations
for (const question of questionsWithImages) {
  const stem = question.stem
  if (stem.includes('قف') || stem.includes('STOP')) question.imageUrl = '/situations/stop.jpg'
  else if (stem.includes('منع المرور') || stem.includes('الشريط الأبيض'))
    question.imageUrl = '/situations/no-entry.jpg'
  else if (stem.includes('أشغال')) question.imageUrl = '/situations/works.jpg'
  else if (stem.includes('مثلث') || stem.includes('تحذير'))
    question.imageUrl = '/situations/warning.jpg'
  else if (stem.includes('أزرق') || stem.includes('إلزامي للأمام'))
    question.imageUrl = '/situations/mandatory.jpg'
  else if (stem.includes('يساراً') || stem.includes('يسار'))
    question.imageUrl = '/situations/no-left.jpg'
  else if (stem.includes('تقاطع') || stem.includes('اليمين'))
    question.imageUrl = '/situations/intersection.jpg'
  else if (stem.includes('دوار')) question.imageUrl = '/situations/roundabout.jpg'
  else if (stem.includes('إسعاف') || stem.includes('طوارئ'))
    question.imageUrl = '/situations/emergency.jpg'
  else if (stem.includes('مشاة') || stem.includes('راجل'))
    question.imageUrl = '/situations/pedestrian.jpg'
  else if (stem.includes('سرع') || stem.includes('50'))
    question.imageUrl = '/situations/speed.jpg'
  else if (stem.includes('مطر')) question.imageUrl = '/situations/rain.jpg'
  else if (stem.includes('ضباب')) question.imageUrl = '/situations/fog.jpg'
  else if (stem.includes('مدرسة') || stem.includes('أطفال'))
    question.imageUrl = '/situations/school.jpg'
  else if (stem.includes('ضو') || stem.includes('أحمر'))
    question.imageUrl = '/situations/lights.jpg'
  else if (stem.includes('حزام')) question.imageUrl = '/situations/seatbelt.jpg'
}

const allQuestions: Question[] = [
  ...questionsWithImages,
  ...textOnlyQuestionsWithImages,
]

export const seedData: AppData = {
  settings: {
    platformName: 'طريق',
    passThreshold: 24,
    questionCount: 30,
    subscriptionMonths: 3,
    examMinutes: 30,
    contactPhone: '+216 00 000 000',
  },
  users: [
    {
      id: 'user_admin',
      email: 'admin@tariq.tn',
      password: 'admin123',
      fullName: 'مدير المنصة',
      phone: '20000000',
      role: 'ADMIN',
      status: 'ACTIVE',
      subscriptionEndsAt: null,
      createdAt: now.toISOString(),
    },
    {
      id: 'user_learner',
      email: 'sara@tariq.tn',
      password: 'sara123',
      fullName: 'سارة بن علي',
      phone: '22111222',
      role: 'LEARNER',
      status: 'ACTIVE',
      subscriptionEndsAt: activeEnd,
      createdAt: now.toISOString(),
    },
    {
      id: 'user_suspended',
      email: 'suspended@tariq.tn',
      password: 'suspended123',
      fullName: 'يوسف الجندوبي',
      phone: '22555666',
      role: 'LEARNER',
      status: 'SUSPENDED',
      subscriptionEndsAt: expiredEnd,
      createdAt: addMonths(now, -4).toISOString(),
    },
  ],
  chapters: [
    {
      id: chapterIds.signs,
      title: 'إشارات المرور',
      slug: 'isharat',
      order: 1,
      summary: 'تعرّف على أشكال الألوان ومعاني الإشارات الأساسية.',
      coverEmoji: '🛑',
      coverImage: '/situations/stop.jpg',
      body: `## إشارات المرور في تونس

تُصنَّف الإشارات إلى: **منع**، **إلزام**، **تحذير**، و**إرشاد**.

### قواعد سريعة
- الأحمر الدائري غالباً للمنع
- الأزرق الدائري غالباً للإلزام
- المثلث التحذيري ينبّه إلى خطر قادم
- إشارات الأولوية تنظّم التقاطعات

ادرس الأمثلة ثم انتقل إلى التمارين لتعزيز الحفظ.`,
    },
    {
      id: chapterIds.priority,
      title: 'قواعد الأولوية',
      slug: 'awlawiya',
      order: 2,
      summary: 'متى تتقدم ومتى تمنح الأولوية في التقاطعات والدوارات.',
      coverEmoji: '🔀',
      coverImage: '/situations/intersection.jpg',
      body: `## الأولوية

الأولوية ليست سرعة، بل **ترتيب مرور آمن**.

- في تقاطع غير منظم: الأولوية لليمين
- مركبات الطوارئ لها أولوية عند تشغيل الإشارات
- تعليمات رجل الأمن تسمو على الإشارات
- عند الخروج من طريق فرعي: امنح الأولوية`,
    },
    {
      id: chapterIds.speed,
      title: 'السرعة والمسافات',
      slug: 'surah',
      order: 3,
      summary: 'حدود السرعة، مسافة الأمان، والتجاوز الآمن.',
      coverEmoji: '⏱️',
      coverImage: '/situations/speed.jpg',
      body: `## السرعة الآمنة

السرعة القانونية ليست دائماً السرعة الآمنة. الطقس، الرؤية، وكثافة المرور تفرض تكييفاً مستمراً.

- داخل العمران غالباً 50 كم/س
- حافظ على مسافة أمان كافية
- لا تتجاوز في المنحنيات أو مع خط متواصل`,
    },
    {
      id: chapterIds.penalties,
      title: 'المخالفات والعقوبات',
      slug: 'mukhalafat',
      order: 4,
      summary: 'أهم المخالفات ونتائجها القانونية.',
      coverEmoji: '⚖️',
      coverImage: '/situations/lights.jpg',
      body: `## لماذا تهمّك العقوبات؟

معرفة المخالفات تحميك من الغرامات وتدفعك لسلوك أكثر أماناً.

أمثلة خطيرة: تجاوز الضوء الأحمر، السياقة تحت تأثير الكحول، الفرار بعد حادث، والقيادة دون رخصة.`,
    },
    {
      id: chapterIds.safety,
      title: 'السلامة والسلوك',
      slug: 'salama',
      order: 5,
      summary: 'حزام الأمان، الأطفال، التعب، والظروف المناخية.',
      coverEmoji: '🛡️',
      coverImage: '/situations/seatbelt.jpg',
      body: `## السلامة أولاً

القيادة مسؤولية. اربط الحزام، راقب الأطفال، خذ راحة عند التعب، وكِيف قيادتك مع المطر والضباب.`,
    },
  ],
  questions: allQuestions,
  progress: [
    {
      userId: 'user_learner',
      chapterId: chapterIds.signs,
      completedAt: now.toISOString(),
    },
  ],
  attempts: [
    {
      id: 'att_demo',
      userId: 'user_learner',
      type: 'MOCK_EXAM',
      chapterId: null,
      score: 25,
      total: 30,
      passed: true,
      answers: [],
      startedAt: addMonths(now, 0).toISOString(),
      finishedAt: now.toISOString(),
    },
  ],
}
