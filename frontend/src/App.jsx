import React, { useState, useEffect } from 'react'
import UploadSection from './components/UploadSection'
import Dashboard from './components/Dashboard'
import InsightsPanel from './components/InsightsPanel'
import QueryPanel from './components/QueryPanel'
import FileList from './components/FileList'
import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
})

function App() {
  const [files, setFiles] = useState([])
  const [overviewData, setOverviewData] = useState(null)
  const [insights, setInsights] = useState('')
  const [loading, setLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(true)

  // Check backend connection on component mount
  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    setIsLoading(true)
    await checkBackendConnection()
    await Promise.all([fetchFiles(), fetchOverview(), fetchInsights()])
    setIsLoading(false)
  }

  const checkBackendConnection = async () => {
    try {
      await api.get('/')
      setBackendStatus('connected')
    } catch (error) {
      setBackendStatus('disconnected')
      console.error('Backend connection failed:', error)
    }
  }

  const fetchFiles = async () => {
    try {
      const response = await api.get('/files')
      setFiles(response.data.files)
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  }

  const fetchOverview = async () => {
    try {
      const response = await api.get('/get_overview')
      setOverviewData(response.data)
    } catch (error) {
      console.error('Error fetching overview:', error)
    }
  }

  const fetchInsights = async () => {
    try {
      const response = await api.get('/get_ai_insights')
      setInsights(response.data.insights)
    } catch (error) {
      console.error('Error fetching insights:', error)
    }
  }

  const handleFileUpload = async (file) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      await api.post('/upload_excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      // Refresh data
      await Promise.all([fetchFiles(), fetchOverview(), fetchInsights()])
      alert('File uploaded and processed successfully!')
    } catch (error) {
      alert(`Upload failed: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return <LoadingScreen />
    }

    switch (activeTab) {
      case 'upload':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <UploadSection onFileUpload={handleFileUpload} loading={loading} />
              </div>
              <div>
                <FileList files={files} />
              </div>
            </div>
          </div>
        )
      case 'ai-insights':
        return <InsightsPanel insights={insights} api={api} />
      case 'query':
        return (
          <div className="flex justify-center items-start min-h-[60vh]">
            <div className="w-full max-w-4xl">
              <QueryPanel api={api} />
            </div>
          </div>
        )
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {overviewData && <Dashboard data={overviewData} />}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InsightsPanel insights={insights} api={api} />
              <QueryPanel api={api} />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen ">
      {/* Navigation Header */}
      <nav className="glass border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-white to-white/80 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-blue-600 font-bold text-sm">AI</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Team Dashboard
              </h1>
            </div>
            
            <div className="flex space-x-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'upload', label: 'Upload', icon: '📁' },
                { id: 'ai-insights', label: 'AI Insights', icon: '🤖' },
                { id: 'query', label: 'Ask AI', icon: '💬' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-lg border border-white/30'
                      : 'text-white/80 hover:bg-white/10 hover:text-white border border-transparent'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Backend Status */}
        {backendStatus === 'disconnected' && (
          <div className="glass bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6 animate-pulse">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-red-100 font-medium">Backend Server Not Connected</h3>
            </div>
            <p className="text-red-200 mt-1 text-sm">
              Please make sure the Flask backend is running on http://localhost:5000
            </p>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            {activeTab === 'dashboard' && 'Team Performance Dashboard'}
            {activeTab === 'upload' && 'Upload Excel Files'}
            {activeTab === 'ai-insights' && 'AI Insights & Analytics'}
            {activeTab === 'query' && 'Ask AI Assistant'}
          </h2>
          <p className="text-white/80 text-lg">
            {activeTab === 'dashboard' && 'Real-time analytics and team performance metrics'}
            {activeTab === 'upload' && 'Upload and process your team task data'}
            {activeTab === 'ai-insights' && 'AI-powered insights and trend analysis'}
            {activeTab === 'query' && 'Ask questions about your team data in natural language'}
          </p>
        </div>

        {/* Main Content */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

// Loading Screen Component
const LoadingScreen = () => {
  const [stats, setStats] = useState({
    tasks: 0,
    completed: 0,
    teams: 0,
    efficiency: 0
  })

  useEffect(() => {
    // Simulate counting animation
    const interval = setInterval(() => {
      setStats(prev => ({
        tasks: Math.min(prev.tasks + 5, 100),
        completed: Math.min(prev.completed + 3, 75),
        teams: Math.min(prev.teams + 1, 8),
        efficiency: Math.min(prev.efficiency + 2, 85)
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass rounded-2xl p-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-6 py-12">
        {/* Animated Logo */}
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-bounce-gentle shadow-lg">
          <span className="text-white text-2xl">📊</span>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">Loading Dashboard</h3>
          <p className="text-white/70">Crunching numbers and preparing insights...</p>
        </div>

        {/* Animated Progress */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-shimmer"
            style={{ width: '70%' }}
          ></div>
        </div>

        {/* Animated Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <StatCard number={stats.tasks} label="Tasks" />
          <StatCard number={stats.completed} label="Completed" />
          <StatCard number={stats.teams} label="Teams" />
          <StatCard number={stats.efficiency} label="Efficiency" suffix="%" />
        </div>

        {/* Loading Dots */}
        <div className="flex space-x-2">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className="w-3 h-3 bg-white/50 rounded-full animate-pulse"
              style={{ animationDelay: `${dot * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Animated Stat Card Component
const StatCard = ({ number, label, suffix = '' }) => {
  return (
    <div className="glass-light rounded-xl p-4 text-center border border-white/10">
      <div className="text-2xl font-bold text-white mb-1 number-counter">
        {number}{suffix}
      </div>
      <div className="text-white/70 text-sm">{label}</div>
    </div>
  )
}

export default App