import { useState, useEffect } from "react"
import { useRouter } from "next/router"

type Video = { title: string; url: string }
type SubPackage = { name: string; videos: Video[] }
type Package = { name: string; subPackages: SubPackage[]; allowedUsers?: string[] }

export default function ManagePackages() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [packages, setPackages] = useState<Package[]>([])
  const [pkgName, setPkgName] = useState("")
  const [subPkgName, setSubPkgName] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [allowedEmails, setAllowedEmails] = useState("")
  const [selectedPkgIndex, setSelectedPkgIndex] = useState<number | null>(null)
  const [selectedSubIndex, setSelectedSubIndex] = useState<number | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      if (user.email === "ahmed@admin.com") {
        setIsAdmin(true)
        const storedPackages = JSON.parse(localStorage.getItem("packages") || "[]")
        setPackages(storedPackages)
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const savePackages = (updatedPackages: Package[]) => {
    setPackages(updatedPackages)
    localStorage.setItem("packages", JSON.stringify(updatedPackages))
  }

  const addPackage = () => {
    if (!pkgName) return
    const emailsArray = allowedEmails.split(",").map(e => e.trim()).filter(e => e)
    const updated = [...packages, { name: pkgName, subPackages: [], allowedUsers: emailsArray }]
    savePackages(updated)
    setPkgName("")
    setAllowedEmails("")
  }

  const addSubPackage = () => {
    if (selectedPkgIndex === null || !subPkgName) return
    const updated = [...packages]
    updated[selectedPkgIndex].subPackages.push({ name: subPkgName, videos: [] })
    savePackages(updated)
    setSubPkgName("")
  }

  const addVideo = () => {
    if (selectedPkgIndex === null || selectedSubIndex === null || !videoTitle || !videoUrl) return
    const updated = [...packages]
    updated[selectedPkgIndex].subPackages[selectedSubIndex].videos.push({ title: videoTitle, url: videoUrl })
    savePackages(updated)
    setVideoTitle("")
    setVideoUrl("")
  }

  if (!isAdmin) return null

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Packages</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>Add Package</h2>
        <input
          type="text"
          placeholder="Package Name"
          value={pkgName}
          onChange={(e) => setPkgName(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="text"
          placeholder="Allowed Emails (comma separated)"
          value={allowedEmails}
          onChange={(e) => setAllowedEmails(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={addPackage}>Add Package</button>
      </div>

      {packages.map((pkg, i) => (
        <div key={i} style={{ marginBottom: "15px", border: "1px solid #ddd", padding: "10px" }}>
          <h3 onClick={() => setSelectedPkgIndex(i)} style={{ cursor: "pointer" }}>{pkg.name}</h3>

          {selectedPkgIndex === i && (
            <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Sub-Package Name"
                value={subPkgName}
                onChange={(e) => setSubPkgName(e.target.value)}
                style={{ marginRight: "10px", padding: "5px" }}
              />
              <button onClick={addSubPackage}>Add Sub-Package</button>
            </div>
          )}

          {pkg.subPackages.map((sub, j) => (
            <div key={j} style={{ marginLeft: "20px", marginBottom: "10px" }}>
              <h4 onClick={() => setSelectedSubIndex(j)} style={{ cursor: "pointer" }}>{sub.name}</h4>

              {selectedPkgIndex === i && selectedSubIndex === j && (
                <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
                  <input
                    type="text"
                    placeholder="Video Title"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    style={{ marginRight: "10px", padding: "5px" }}
                  />
                  <input
                    type="text"
                    placeholder="YouTube URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    style={{ marginRight: "10px", padding: "5px" }}
                  />
                  <button onClick={addVideo}>Add Video</button>
                </div>
              )}

              {sub.videos.map((vid, k) => (
                <p key={k} style={{ marginLeft: "20px" }}>{vid.title}</p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
