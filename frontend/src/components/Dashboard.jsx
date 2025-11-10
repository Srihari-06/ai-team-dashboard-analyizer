import React, { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'
import ChartCard from './ChartCard'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1']
const GRADIENT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

const Dashboard = ({ data }) => {
  const { status_counts, assignee_stats, total_tasks } = data
  const [animatedStats, setAnimatedStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    statusTypes: 0
  })

  useEffect(() => {
    // Animate numbers when data changes
    const completedTasks = status_counts?.['Completed'] || 0
    const completionRate = total_tasks ? ((completedTasks / total_tasks) * 100) : 0
    
    setTimeout(() => {
      setAnimatedStats({
        totalTasks: total_tasks || 0,
        completedTasks,
        completionRate: Math.round(completionRate),
        statusTypes: Object.keys(status_counts || {}).length
      })
    }, 300)
  }, [data])

  const statusData = Object.entries(status_counts || {}).map(([name, value]) => ({
    name,
    value,
    fill: COLORS[Object.keys(status_counts || {}).indexOf(name) % COLORS.length]
  }))

  const assigneeData = (assignee_stats || []).map(stat => ({
    name: stat.assignee,
    completed: stat.completed,
    pending: stat.total_tasks - stat.completed,
    completionRate: Math.round((stat.completed / stat.total_tasks) * 100)
  }))

  const performanceData = (assignee_stats || []).map(stat => ({
    name: stat.assignee,
    efficiency: Math.round((stat.completed / stat.total_tasks) * 100),
    tasks: stat.total_tasks
  }))

  return (
    <div className="space-y-6">
      {/* Stats Cards with Animated Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedStatCard
          number={animatedStats.totalTasks}
          label="Total Tasks"
          icon="📋"
          color="from-blue-500 to-blue-600"
          delay={0}
        />
        <AnimatedStatCard
          number={animatedStats.completedTasks}
          label="Completed"
          icon="✅"
          color="from-green-500 to-green-600"
          delay={200}
        />
        <AnimatedStatCard
          number={animatedStats.completionRate}
          label="Completion Rate"
          icon="📈"
          color="from-amber-500 to-amber-600"
          suffix="%"
          delay={400}
        />
        <AnimatedStatCard
          number={animatedStats.statusTypes}
          label="Active Statuses"
          icon="🎯"
          color="from-purple-500 to-purple-600"
          delay={600}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Task Distribution by Status" 
          subtitle="Visual breakdown of all tasks"
          className="glass hover-lift"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {statusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} tasks`, 'Count']}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '10px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          title="Team Performance" 
          subtitle="Completed vs Pending tasks by assignee"
          className="glass hover-lift"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assigneeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: '#64748b' }}
              />
              <YAxis tick={{ fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '10px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="completed" 
                name="Completed" 
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                animationBegin={400}
                animationDuration={1000}
              />
              <Bar 
                dataKey="pending" 
                name="Pending" 
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                animationBegin={600}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

// Animated Stat Card Component
const AnimatedStatCard = ({ number, label, icon, color, suffix = '', delay = 0 }) => {
  const [displayNumber, setDisplayNumber] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayNumber(number)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [number, delay])

  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white hover-lift animate-fade-in`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{label}</p>
          <div className="text-3xl font-bold mt-2 number-counter">
            {displayNumber}{suffix}
          </div>
        </div>
        <div className="text-2xl animate-bounce-gentle">{icon}</div>
      </div>
    </div>
  )
}

export default Dashboard