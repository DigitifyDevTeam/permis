import { ArrowLeft, CheckCircle2, Shield, Sparkles, Timer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PublicShell } from '../components/layouts'
import { Button, Card } from '../components/ui'

export function LandingPage() {
  return (
    <PublicShell>
      <main>
        <section className="hero-grid relative overflow-hidden text-white">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute -left-10 top-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl animate-pulse-soft" />
            <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />
          </div>
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
            <div className="animate-fade-up">
              <div className="mb-5 text-5xl font-black tracking-tight sm:text-7xl">طريق</div>
              <h1 className="max-w-xl text-2xl font-extrabold leading-relaxed sm:text-4xl">
                منصة عربية للتدريب على الامتحان النظري لقانون المرور في تونس
              </h1>
              <p className="mt-4 max-w-lg text-base text-teal-50/90 sm:text-lg">
                دروس واضحة، وتمارين تطبيقية، وامتحان تجريبي لمدة ثلاثة أشهر. بعد انتهاء المدة
                يُعلَّق الحساب مع الاحتفاظ بأرشيف الامتحانات.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login">
                  <Button variant="accent" size="lg">
                    تسجيل الدخول <ArrowLeft size={18} />
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-teal-100/90">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} /> حساب يُنشأ عبر الإدارة
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} /> امتحان من 30 سؤالاً
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} /> أرشيف الامتحانات
                </span>
              </div>
            </div>

            <div className="animate-fade-up-delay relative">
              <div className="glass rounded-[28px] p-5 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm text-teal-100">نموذج سؤال من الامتحان</div>
                  <div className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink">
                    النجاح من 24 / 30
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-5 text-ink">
                  <div className="text-xs font-bold text-muted">السؤال 12 من 30</div>
                  <p className="mt-3 text-lg font-bold leading-relaxed">
                    عند تقاطع غير منظم، لمن تكون الأولوية؟
                  </p>
                  <div className="mt-4 space-y-2">
                    {['القادم من اليمين', 'القادم من اليسار', 'السيارة الأسرع'].map(
                      (opt, i) => (
                        <div
                          key={opt}
                          className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                            i === 0
                              ? 'border-brand bg-teal-50 text-brand'
                              : 'border-line bg-surface'
                          }`}
                        >
                          {opt}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-extrabold text-ink">مسار التدريب على المنصة</h2>
            <p className="mt-2 text-muted">
              حساب نشط يتيح التعلّم والامتحان، وحساب معلّق يتيح الاطلاع على الأرشيف والملف
              الشخصي فقط.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: <Sparkles className="text-brand" />,
                title: 'إنشاء الحساب عبر الإدارة',
                text: 'يقوم المدير بإنشاء اسم المستخدم وكلمة المرور وتفعيل الحساب لمدة ثلاثة أشهر.',
              },
              {
                icon: <Timer className="text-brand" />,
                title: 'التعلّم والتدريب',
                text: 'دروس وتمارين وامتحان تجريبي طوال مدة نشاط الحساب.',
              },
              {
                icon: <Shield className="text-brand" />,
                title: 'بعد ثلاثة أشهر: تعليق دون حذف',
                text: 'يبقى أرشيف الامتحانات والملف الشخصي متاحاً حتى تعيد الإدارة تفعيل الحساب.',
              },
            ].map((item) => (
              <Card key={item.title} className="bg-white">
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-teal-50">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t border-line bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-10">
            <p className="text-muted">للدخول إلى الحساب استخدم بيانات الدخول الصادرة عن الإدارة.</p>
            <Link to="/login">
              <Button size="lg">تسجيل الدخول</Button>
            </Link>
          </div>
        </section>
      </main>
    </PublicShell>
  )
}
