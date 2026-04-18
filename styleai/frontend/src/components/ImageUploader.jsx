export default function ImageUploader({ previewUrl, onChange }) {
  return (
    <div className="card">
      <label htmlFor="upload" className="label">Upload your photo</label>
      <input id="upload" type="file" accept="image/*" onChange={onChange} />
      {previewUrl && (
        <div className="preview">
          <img src={previewUrl} alt="Preview of uploaded person" />
        </div>
      )}
    </div>
  )
}
