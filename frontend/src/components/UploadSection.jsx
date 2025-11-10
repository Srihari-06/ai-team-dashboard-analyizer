import React, { useCallback, useState } from 'react'

const UploadSection = ({ onFileUpload, loading }) => {
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.name.match(/\.(xlsx|xls)$/)) {
        handleFileUpload(file)
      } else {
        alert('Please upload only Excel files (.xlsx or .xls)')
      }
    }
  }, [onFileUpload])

  const handleFileUpload = async (file) => {
    setIsUploading(true)
    await onFileUpload(file)
    setIsUploading(false)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover-lift transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">📁</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Upload Excel File</h2>
          <p className="text-gray-600">Upload your team task data for analysis</p>
        </div>
      </div>
      
      <div
        className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden ${
          dragActive 
            ? 'border-blue-400 bg-blue-50/50 scale-105 shadow-lg' 
            : 'border-gray-300 bg-gray-50/50 hover:border-blue-300 hover:bg-blue-50/30'
        } ${isUploading ? 'animate-pulse' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-blue-600 font-medium">Processing your file...</p>
            </div>
          </div>
        )}
        
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          disabled={loading || isUploading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center animate-bounce-gentle">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg">
                Click to upload
              </span>
              <span className="text-gray-600 ml-2">or drag and drop</span>
            </label>
            <p className="text-sm text-gray-500">Excel files only (.xlsx, .xls)</p>
          </div>

          <div className="flex space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Multiple sheets supported</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Auto-analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Instant insights</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Expected Excel Format:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Required columns: <span className="font-mono bg-blue-100 px-2 py-1 rounded">task_id</span>, <span className="font-mono bg-blue-100 px-2 py-1 rounded">title</span>, <span className="font-mono bg-blue-100 px-2 py-1 rounded">assignee</span>, <span className="font-mono bg-blue-100 px-2 py-1 rounded">status</span></p>
          <p>• Optional columns: <span className="font-mono bg-blue-100 px-2 py-1 rounded">priority</span>, <span className="font-mono bg-blue-100 px-2 py-1 rounded">due_date</span>, <span className="font-mono bg-blue-100 px-2 py-1 rounded">story_points</span>, <span className="font-mono bg-blue-100 px-2 py-1 rounded">tags</span></p>
        </div>
      </div>
    </div>
  )
}

export default UploadSection