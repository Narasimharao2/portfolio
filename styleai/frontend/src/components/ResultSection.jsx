export default function ResultSection({ result, style, onDownload, onShare, onRetry }) {
  if (!result?.generated_image_url) return null

  return (
    <section className="card result-section">
      <h2>AI Outfit Result ({style})</h2>
      <img src={result.generated_image_url} alt={`Generated ${style} outfit`} className="result-image" />
      <p className="subtle">{result.message}</p>
      <div className="action-row">
        <button onClick={onDownload}>Download Image</button>
        <button onClick={onShare}>Share</button>
        <a className="button-link" href={result.affiliate_url} target="_blank" rel="noreferrer">
          Buy This Outfit
        </a>
        <button className="secondary" onClick={onRetry}>Retry</button>
      </div>
    </section>
  )
}
