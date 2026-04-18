import { useState } from 'react'
import { generateOutfitRequest } from '../services/outfitApi'

export function useOutfitGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const generate = async ({ file, style }) => {
    if (!file) {
      setError('Please upload an image before generating an outfit.')
      return null
    }

    try {
      setError('')
      setIsLoading(true)
      const data = await generateOutfitRequest({ file, style })
      setResult(data)
      return data
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to generate outfit. Please retry.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const resetResult = () => setResult(null)

  return {
    isLoading,
    result,
    error,
    setError,
    generate,
    resetResult
  }
}
