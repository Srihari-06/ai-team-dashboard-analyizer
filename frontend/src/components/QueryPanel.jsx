import React, { useState } from 'react'

const QueryPanel = ({ api }) => {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const result = await api.post('/ask_ai', { query })
      setResponse(result.data.response)
      setHistory(prev => [...prev, { query, response: result.data.response }])
      setQuery('')
    } catch (error) {
      setResponse(`Error: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const exampleQueries = [
    "How many tasks are pending?",
    "Who are the top performers this week?",
    "Show me tasks that are overdue",
    "What's the completion rate by assignee?",
    "How many tasks are blocked?",
    "Show task distribution by status",
    "Who has the most completed tasks?",
    "What's our team's average completion rate?"
  ]

  return (
    <div className="bg-white/80 glass glass-light backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 hover-lift transition-all duration-300 w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">💬</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          AI Assistant
        </h2>
        <p className="text-gray-600 text-lg">
          Ask anything about your team's performance and tasks
        </p>
      </div>

      {/* Query Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything about your team's performance..."
            className="w-full border-2 border-gray-300 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 pr-24"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all duration-300 font-semibold"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Asking...</span>
              </div>
            ) : (
              'Ask AI'
            )}
          </button>
        </div>
      </form>

      {/* Example Queries */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Try asking:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => setQuery(example)}
              className="bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 px-4 py-3 rounded-xl text-left transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-blue-300"
            >
              <span className="text-blue-500 mr-2">💡</span>
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Response Area */}
      {response && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200 mb-6 animate-fade-in">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">AI</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-800">AI Response:</h3>
          </div>
          <div className="bg-white/80 rounded-xl p-4">
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
              {response}
            </div>
          </div>
        </div>
      )}

      {/* Recent Queries */}
      {history.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📚</span>
            Recent Conversations
          </h3>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {history.slice(-6).reverse().map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">Q</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium mb-2">{item.query}</p>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">A</span>
                      </div>
                      <p className="text-gray-600 text-sm">{item.response.slice(0, 120)}...</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white rounded-xl p-3 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{history.length}</div>
          <div className="text-xs text-gray-600">Queries Asked</div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {history.filter(item => !item.response.includes('Error')).length}
          </div>
          <div className="text-xs text-gray-600">Successful</div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(history.map(item => item.query)).size}
          </div>
          <div className="text-xs text-gray-600">Unique Questions</div>
        </div>
      </div>
    </div>
  )
}

export default QueryPanel