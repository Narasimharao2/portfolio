import { useMemo, useState } from 'react'
import axios from 'axios'
import ImageUploader from './components/ImageUploader'
import LoadingSpinner from './components/LoadingSpinner'
import ResultSection from './components/ResultSection'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const STYLES = ['casual', 'formal', 'party', 'celebrity-inspired']

export default function App() {
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0])
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])

  const handleFileChange = (event) => {
    const picked = event.target.files?.[0]
    setFile(picked || null)
    setResult(null)
    setError('')
  }

  const generate = async () => {
    if (!file) {
      setError('Please upload an image first.')
      return
    }

    try {
      setError('')
      setIsLoading(true)
      const formData = new FormData()
      formData.append('image', file)
      formData.append('style', selectedStyle)

      const { data } = await axios.post(`${API_BASE}/generate-outfit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to generate outfit. Please retry.')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadImage = async () => {
    if (!result?.generated_image_url) return
    const response = await fetch(result.generated_image_url)
    const blob = await response.blob()
    const href = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = href
    a.download = `styleai-${selectedStyle}.jpg`
    a.click()
    URL.revokeObjectURL(href)
  }

  const shareImage = async () => {
    const url = result?.generated_image_url
    if (!url) return

    if (navigator.share) {
      await navigator.share({
        title: 'My StyleAI look',
        text: `Check out my ${selectedStyle} look from StyleAI!`,
        url
      })
      return
    }

    const whatsapp = `https://wa.me/?text=${encodeURIComponent(`Check out my StyleAI look: ${url}`)}`
    window.open(whatsapp, '_blank')
  }

  return (
    <main className="container">
      <header>
        <h1>StyleAI – Virtual Outfit Try-On</h1>
        <p>Upload your image, choose a style, and let AI generate your next fashion look.</p>
      </header>

      <ImageUploader previewUrl={previewUrl} onChange={handleFileChange} />

      <section className="card">
        <label className="label" htmlFor="style">Select outfit style</label>
        <select id="style" value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}>
          {STYLES.map((style) => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>

        <button className="generate-btn" onClick={generate} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Outfit'}
        </button>
      </section>

      {isLoading && <LoadingSpinner />}
      {error && <p className="error">{error}</p>}

      <ResultSection
        result={result}
        style={selectedStyle}
        onDownload={downloadImage}
        onShare={shareImage}
        onRetry={generate}
      />
    </main>
  )
}
