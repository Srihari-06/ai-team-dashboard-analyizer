import React from 'react'

const FileList = ({ files }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white glass  rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
      
      {files.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 6h6m-6 6h6M6 6v12a4 4 0 004 4h12a4 4 0 004-4V6a4 4 0 00-4-4H10a4 4 0 00-4 4z" />
          </svg>
          <p className="mt-2">No files uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {files.map((file) => (
            <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 truncate flex-1">{file.filename}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
                  {file.sheet_count} sheet{file.sheet_count !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Uploaded: {formatDate(file.upload_date)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileList