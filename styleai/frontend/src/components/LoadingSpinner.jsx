export default function LoadingSpinner() {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner" />
      <p>Generating your AI outfit... this can take up to 30 seconds.</p>
    </div>
  )
}
