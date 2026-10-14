import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { PublicShell } from '../components/layouts'
import { Button, Card, Input, Label } from '../components/ui'
import { useApp } from '../store/AppContext'

function redirectFor(user: { role: string; status: string }) {
  if (user.role === 'ADMIN') return '/admin'
  if (user.status === 'SUSPENDED') return '/app/archive'
  return '/app'
}

export function LoginPage() {
  const { login, currentUser } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('sara@tariq.tn')
  const [password, setPassword] = useState('sara123')
  const [error, setError] = useState('')

  if (currentUser) return <Navigate to={redirectFor(currentUser)} replace />

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const res = login(email, password)
    if (!res.ok || !res.user) {
      setError(res.error ?? 'تعذّر الدخول')
      return
    }
    navigate(redirectFor(res.user))
  }

  return (
    <PublicShell>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">دخول المنصة</h1>
          <p className="mt-2 text-muted">
            المدير ينشئ حسابك ويعطيك اسم المستخدم وكلمة المرور. بعد 3 أشهر يُعلَّق الحساب
            تلقائياً مع الإبقاء على الأرشيف.
          </p>
          <Card className="mt-6 space-y-3 bg-teal-50/60 text-sm">
            <div className="font-bold text-brand">حسابات العرض التجريبي</div>
            <p>متعلّمة نشطة: sara@tariq.tn / sara123</p>
            <p>حساب معلّق: suspended@tariq.tn / suspended123</p>
            <p>مدير: admin@tariq.tn / admin123</p>
          </Card>
        </div>
        <Card>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <Label>اسم المستخدم / البريد</Label>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div>
              <Label>كلمة المرور</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
            <Button type="submit" className="w-full" size="lg">
              دخول
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            <Link to="/" className="font-bold text-brand">
              العودة للرئيسية
            </Link>
          </p>
        </Card>
      </div>
    </PublicShell>
  )
}
