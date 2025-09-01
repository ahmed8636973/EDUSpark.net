import { useEffect, useState } from "react"
import { useRouter } from "next/router"

type Video = { title: string; url: string }
type SubPackage = { name: string; videos: Video[] }
type Package = { name: string; subPackages: SubPackage[]; allowedUsers?: string[] }

export default function PackagesPage() {
  const router = useRouter()
  const [packages, setPackages] = useState<Package[]>([])
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    const user = JSON.parse(storedUser)

    // التحقق من تسجيل الدخول على جهاز آخر
    const activeUsers = JSON.parse(localStorage.getItem("active_users") || "[]")
    if (!activeUsers.includes(user.email)) {
      localStorage.removeItem("user")
      router.push("/login")
      return
    }

    setUserEmail(user.email)

    const storedPackages = JSON.parse(localStorage.getItem("packages") || "[]")
    const visiblePackages = storedPackages.filter((pkg: Package) => {
      if (!pkg.allowedUsers || pkg.allowedUsers.length === 0) return true
      return pkg.allowedUsers.includes(user.email)
    })
    setPackages(visiblePackages)
  }, [router])

  return (
    <div style={{ padding: "20px" }}>
      <h1>Learning Packages</h1>
      {packages.length === 0 && <p>No packages available for you</p>}
      {packages.map((pkg, i) => (
        <div key={i} style={{ marginBottom: "20px" }}>
          <h2>{pkg.name}</h2>
          {pkg.subPackages.map((sub, j) => (
            <div key={j} style={{ marginLeft: "20px", marginBottom: "10px" }}>
              <h3>{sub.name}</h3>
              {sub.videos.map((vid, k) => (
                <div key={k} style={{ marginLeft: "20px", marginBottom: "10px" }}>
                  <p>{vid.title}</p>
                  <iframe
                    width="400"
                    height="225"
                    src={vid.url}
                    title={vid.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
