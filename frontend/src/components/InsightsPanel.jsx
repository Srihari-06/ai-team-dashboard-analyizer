import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'

const API_BASE = 'http://localhost:5000'

const InsightsPanel = ({ insights, api }) => {
  const [refreshing, setRefreshing] = useState(false)
  const [currentInsights, setCurrentInsights] = useState(insights)
  const [chartData, setChartData] = useState([])
  const [performanceData, setPerformanceData] = useState([])

  useEffect(() => {
    setCurrentInsights(insights)
    fetchChartData()
  }, [insights])

  const fetchChartData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/get_overview`)
      const data = response.data
      
      // Prepare status distribution data for bar chart
      const statusChartData = Object.entries(data.status_counts || {}).map(([status, count], index) => ({
        status,
        count,
        fill: `hsl(${index * 60}, 70%, 50%)`
      }))
      
      // Prepare performance data for bar chart
      const performanceChartData = (data.assignee_stats || []).map((stat, index) => ({
        assignee: stat.assignee,
        completionRate: Math.round((stat.completed / stat.total_tasks) * 100),
        totalTasks: stat.total_tasks,
        completed: stat.completed,
        fill: `hsl(${index * 90}, 70%, 50%)`
      }))
      
      setChartData(statusChartData)
      setPerformanceData(performanceChartData)
    } catch (error) {
      console.error('Error fetching chart data:', error)
    }
  }

  const refreshInsights = async () => {
    setRefreshing(true)
    try {
      const response = await api.get('/get_ai_insights')
      setCurrentInsights(response.data.insights)
      await fetchChartData()
    } catch (error) {
      console.error('Error refreshing insights:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-sm text-gray-600">
            {payload[0].name}: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white/80 glass glass-light backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover-lift transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">🤖</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">AI Insights</h2>
            <p className="text-gray-600">Smart analysis of your team performance</p>
          </div>
        </div>
        <button
          onClick={refreshInsights}
          disabled={refreshing}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all duration-300 flex items-center space-x-2"
        >
          {refreshing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <span>🔄</span>
              <span>Refresh Insights</span>
            </>
          )}
        </button>
      </div>

      {/* Bar Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Status Distribution Bar Chart */}
        <div className="bg-white/50 rounded-xl p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="status" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                name="Tasks"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Bar Chart */}
        <div className="bg-white/50 rounded-xl p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Team Completion Rates</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="assignee" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: '%', position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Completion Rate']}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '10px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Bar 
                dataKey="completionRate" 
                name="Completion Rate"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights Text */}
      <div className="bg-gradient-to-br glass glass-light from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          AI Analysis & Recommendations
        </h3>
        <div className="bg-tranparent  rounded-lg p-4 min-h-[150px] max-h-[300px] overflow-y-auto">
          {currentInsights ? (
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {currentInsights}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <p>No insights available yet.</p>
              <p className="text-sm">Upload an Excel file to generate AI insights.</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      {chartData.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{chartData.reduce((sum, item) => sum + item.count, 0)}</div>
            <div className="text-xs text-blue-600">Total Tasks</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {chartData.find(item => item.status === 'Completed')?.count || 0}
            </div>
            <div className="text-xs text-green-600">Completed</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {performanceData.length}
            </div>
            <div className="text-xs text-orange-600">Team Members</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(performanceData.reduce((sum, item) => sum + item.completionRate, 0) / performanceData.length) || 0}%
            </div>
            <div className="text-xs text-purple-600">Avg Completion</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InsightsPanel