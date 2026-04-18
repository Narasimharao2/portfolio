import ActionButtons from './ActionButtons'

export default function ResultSection({ result, style, onDownload, onShare, onRetry }) {
  if (!result?.generated_image_url) return null

  return (
      <ActionButtons
        affiliateUrl={result.affiliate_url}
        onDownload={onDownload}
        onShare={onShare}
        onRetry={onRetry}
      />
          Buy This Outfit
        </a>
        <button className="secondary" onClick={onRetry}>Retry</button>
      </div>
    </section>
  )
}
