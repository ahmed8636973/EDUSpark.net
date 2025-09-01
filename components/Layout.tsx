import { ReactNode } from "react"
import { supabase } from "@/lib/supabaseClient"

type LayoutProps = { children: ReactNode }

export default function Layout({ children }: LayoutProps) {
  const onLogout = async () => {
    await supabase.auth.signOut()
    // نرجع لصفحة الدخول
    window.location.href = "/login"
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold text-blue-600 mb-6">EDUSpark</h2>
        <nav className="space-y-2">
          <a href="/" className="block text-gray-700 hover:text-blue-600">Home</a>
          <a href="/login" className="block text-gray-700 hover:text-blue-600">Login</a>
          <a href="/admin/dashboard" className="block text-gray-700 hover:text-blue-600">Admin</a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <button onClick={onLogout} className="px-3 py-1 rounded-lg border">
            Logout
          </button>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
