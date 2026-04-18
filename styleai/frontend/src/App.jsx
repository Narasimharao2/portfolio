import { useEffect, useMemo, useState } from 'react'
import { useOutfitGenerator } from './hooks/useOutfitGenerator'
  const { isLoading, result, error, setError, generate, resetResult } = useOutfitGenerator()

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

    resetResult()
  const handleGenerate = async () => {
    await generate({ file, style: selectedStyle })
  }

          <button className="generate-btn" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <ResultSection
              result={result}
              style={selectedStyle}
              onDownload={handleDownload}
              onShare={handleShare}
              onRetry={handleGenerate}
            />
          )}
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
