import { useDropzone } from 'react-dropzone'
import { Upload, File, X } from 'lucide-react'

export default function FileUpload({ onFileSelect, file, error }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
      if (rejectedFiles.length > 0) {
        const err = rejectedFiles[0].errors[0]
        if (err.code === 'file-too-large') {
          onFileSelect(null, 'File must be less than 5MB')
        } else {
          onFileSelect(null, 'Only PDF, DOC, and DOCX files are allowed')
        }
      }
    },
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <File className="text-blue-600" size={24} />
            <div className="text-left">
              <p className="text-sm font-medium text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto text-slate-400 mb-3" size={32} />
            <p className="text-sm font-medium text-slate-600">
              {isDragActive ? 'Drop your CV here' : 'Drag & drop your CV here'}
            </p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX • Max 5MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
