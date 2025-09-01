import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function PackageDetails() {
  const router = useRouter()
  const { id } = router.query

  const [subPackages, setSubPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchSubPackages = async () => {
      const { data, error } = await supabase
        .from("sub_packages")
        .select("*")
        .eq("package_id", id)

      if (error) {
        console.error("❌ Error fetching sub-packages:", error.message)
      } else {
        setSubPackages(data || [])
      }
      setLoading(false)
    }

    fetc
