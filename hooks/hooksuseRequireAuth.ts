import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"
import { AuthChangeEvent, Session } from "@supabase/supabase-js"

export function useRequireAuth() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    let mounted = true

    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return
      if (!session) {
        const next = router.asPath || "/admin/dashboard"
        router.replace(`/login?next=${encodeURIComponent(next)}`)
      } else {
        setIsAuthed(true)
      }
      setLoading(false)
    }

    check()

    const { data: sub } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (!session) {
          const next = router.asPath || "/admin/dashboard"
          router.replace(`/login?next=${encodeURIComponent(next)}`)
        } else {
          setIsAuthed(true)
        }
      }
    )

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [router])

  return { loading, isAuthed }
}
