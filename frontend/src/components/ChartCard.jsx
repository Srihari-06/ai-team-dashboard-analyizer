import React from 'react'

const ChartCard = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`glass rounded-2xl shadow-lg border border-white/20 hover-lift transition-all duration-300 ${className}`}>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-white/70 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        <div className="animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  )
}

export default ChartCard