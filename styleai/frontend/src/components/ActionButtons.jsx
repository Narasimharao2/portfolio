export default function ActionButtons({ affiliateUrl, onDownload, onShare, onRetry }) {
  return (
    <div className="action-row">
      <button onClick={onDownload}>Download Image</button>
      <button onClick={onShare}>Share</button>
      <a className="button-link" href={affiliateUrl} target="_blank" rel="noreferrer">
        Buy This Outfit
      </a>
      <button className="secondary" onClick={onRetry}>Retry</button>
    </div>
  )
}
