import {
  BookOpen,
  ClipboardCheck,
  Gauge,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { daysLeft, formatDate } from '../lib/utils'
import { useApp } from '../store/AppContext'
import { Badge, Button } from './ui'

function NavItem({
  to,
  icon,
  children,
  onClick,
  tone = 'light',
}: {
  to: string
  icon: ReactNode
  children: ReactNode
  onClick?: () => void
  tone?: 'light' | 'dark'
}) {
  return (
    <NavLink
      to={to}
      end={to === '/app' || to === '/admin'}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
          isActive
            ? 'bg-brand text-white shadow-sm'
            : tone === 'dark'
              ? 'text-teal-100/80 hover:bg-white/10 hover:text-white'
              : 'text-ink-soft hover:bg-white hover:text-ink'
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  )
}

export function PublicShell({ children }: { children: ReactNode }) {
  const { currentUser } = useApp()
  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-40 border-b border-white/10 bg-[#062e2a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-lg font-black text-ink">
              ط
            </span>
            <div>
              <div className="text-lg font-extrabold leading-none">طريق</div>
              <div className="text-xs text-teal-100/80">قانون المرور التونسي</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {currentUser ? (
              <Link to={currentUser.role === 'ADMIN' ? '/admin' : '/app'}>
                <Button variant="accent" size="sm">
                  لوحة التحكم
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="accent" size="sm">
                  دخول الحساب
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}

export function LearnerLayout() {
  const { currentUser, logout, suspended, learningAccess, data } = useApp()
  const [open, setOpen] = useState(false)
  const left = daysLeft(currentUser?.subscriptionEndsAt ?? null)

  const links = suspended ? (
    <>
      <NavItem
        to="/app/archive"
        icon={<History size={18} />}
        onClick={() => setOpen(false)}
      >
        أرشيف الامتحانات
      </NavItem>
      <NavItem
        to="/app/profile"
        icon={<Settings size={18} />}
        onClick={() => setOpen(false)}
      >
        حسابي
      </NavItem>
    </>
  ) : (
    <>
      <NavItem to="/app" icon={<LayoutDashboard size={18} />} onClick={() => setOpen(false)}>
        الرئيسية
      </NavItem>
      <NavItem
        to="/app/courses"
        icon={<BookOpen size={18} />}
        onClick={() => setOpen(false)}
      >
        الدروس
      </NavItem>
      <NavItem
        to="/app/practice"
        icon={<ClipboardCheck size={18} />}
        onClick={() => setOpen(false)}
      >
        التمارين
      </NavItem>
      <NavItem
        to="/app/exam"
        icon={<Gauge size={18} />}
        onClick={() => setOpen(false)}
      >
        الامتحان التجريبي
      </NavItem>
      <NavItem
        to="/app/archive"
        icon={<History size={18} />}
        onClick={() => setOpen(false)}
      >
        أرشيف الامتحانات
      </NavItem>
      <NavItem
        to="/app/profile"
        icon={<Settings size={18} />}
        onClick={() => setOpen(false)}
      >
        حسابي
      </NavItem>
    </>
  )

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 lg:py-6">
        <aside className="no-print hidden w-64 shrink-0 lg:block">
          <div className="sticky top-4 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-lg font-black text-white">
                ط
              </span>
              <div>
                <div className="text-xl font-extrabold text-brand">
                  {data.settings.platformName}
                </div>
                <div className="text-xs text-muted">مساحة المتعلّمة</div>
              </div>
            </Link>
            <nav className="space-y-1 rounded-2xl border border-line bg-white/80 p-2 shadow-sm">
              {links}
            </nav>
            <div className="rounded-2xl border border-line bg-white p-4">
              <div className="font-bold">{currentUser?.fullName}</div>
              <div className="mt-1 text-xs text-muted">{currentUser?.email}</div>
              <div className="mt-3">
                {learningAccess ? (
                  <Badge tone="success">
                    حساب نشط{left !== null ? ` · ${left} يوم` : ''}
                  </Badge>
                ) : suspended ? (
                  <Badge tone="accent">موقوف مؤقتاً</Badge>
                ) : (
                  <Badge tone="muted">غير متاح</Badge>
                )}
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 w-full"
                onClick={logout}
              >
                <LogOut size={16} /> خروج
              </Button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="no-print mb-4 flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 lg:hidden">
            <div className="font-extrabold text-brand">{data.settings.platformName}</div>
            <button
              type="button"
              className="rounded-xl border border-line p-2"
              onClick={() => setOpen((v) => !v)}
              aria-label="القائمة"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          {open ? (
            <div className="no-print mb-4 space-y-1 rounded-2xl border border-line bg-white p-2 lg:hidden">
              {links}
              <Button variant="secondary" className="mt-2 w-full" onClick={logout}>
                خروج
              </Button>
            </div>
          ) : null}

          {suspended ? (
            <div className="no-print mb-4 rounded-2xl border border-amber-200 bg-accent-soft px-4 py-3 text-amber-950">
              <div className="font-bold">الحساب معلّق بعد انتهاء مدة 3 أشهر</div>
              <p className="mt-1 text-sm">
                الحساب غير محذوف. يمكنك فقط عرض أرشيف امتحاناتك السابقة وحسابك. الدروس
                والتمارين وامتحان جديد غير متاحة حتى تعيد الإدارة تفعيل الحساب.
                {currentUser?.subscriptionEndsAt
                  ? ` انتهى في ${formatDate(currentUser.subscriptionEndsAt)}.`
                  : ''}
              </p>
              <Link to="/app/profile" className="mt-2 inline-block text-sm font-bold underline">
                عرض الحساب
              </Link>
            </div>
          ) : null}

          <Outlet />
        </div>
      </div>
    </div>
  )
}

export function AdminLayout() {
  const { currentUser, logout, data } = useApp()
  const [open, setOpen] = useState(false)

  const links = (
    <>
      <NavItem
        tone="dark"
        to="/admin"
        icon={<LayoutDashboard size={18} />}
        onClick={() => setOpen(false)}
      >
        لوحة الإدارة
      </NavItem>
      <NavItem
        tone="dark"
        to="/admin/users"
        icon={<Users size={18} />}
        onClick={() => setOpen(false)}
      >
        المستعملون
      </NavItem>
      <NavItem
        tone="dark"
        to="/admin/chapters"
        icon={<BookOpen size={18} />}
        onClick={() => setOpen(false)}
      >
        الدروس
      </NavItem>
      <NavItem
        tone="dark"
        to="/admin/questions"
        icon={<ClipboardCheck size={18} />}
        onClick={() => setOpen(false)}
      >
        الأسئلة
      </NavItem>
    </>
  )

  return (
    <div className="min-h-screen bg-[#071816]">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 lg:py-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-4 space-y-4">
            <div className="text-white">
              <div className="text-xl font-extrabold">{data.settings.platformName}</div>
              <div className="text-xs text-teal-200/70">لوحة المدير</div>
            </div>
            <nav className="space-y-1 rounded-2xl border border-white/10 bg-white/5 p-2">
              {links}
            </nav>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
              <div className="font-bold">{currentUser?.fullName}</div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 w-full"
                onClick={logout}
              >
                خروج
              </Button>
            </div>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white lg:hidden">
            <div className="font-extrabold">إدارة {data.settings.platformName}</div>
            <button type="button" onClick={() => setOpen((v) => !v)} className="p-2">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          {open ? (
            <div className="mb-4 space-y-1 rounded-2xl border border-white/10 bg-white/5 p-2 lg:hidden">
              {links}
            </div>
          ) : null}
          <div className="rounded-[28px] bg-surface p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
