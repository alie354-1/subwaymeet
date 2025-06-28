import React, { useState } from 'react';
import { AlertTriangle, Info, AlertCircle, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { ServiceAlert } from '../services/mta/types';

interface ServiceAlertsProps {
  alerts: ServiceAlert[];
  lines?: string[];
  className?: string;
}

export const ServiceAlerts: React.FC<ServiceAlertsProps> = ({
  alerts,
  lines,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter alerts by lines if specified
  const filteredAlerts = lines 
    ? alerts.filter(alert => alert.affectedLines.some(line => lines.includes(line)))
    : alerts;

  if (filteredAlerts.length === 0) {
    return null;
  }

  const getSeverityIcon = (severity: ServiceAlert['severity']) => {
    switch (severity) {
      case 'severe':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: ServiceAlert['severity']) => {
    switch (severity) {
      case 'severe':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getLineColor = (line: string) => {
    const colors: { [key: string]: string } = {
      'N': 'bg-yellow-500', 'Q': 'bg-yellow-500', 'R': 'bg-yellow-500', 'W': 'bg-yellow-500',
      '1': 'bg-red-500', '2': 'bg-red-500', '3': 'bg-red-500',
      '4': 'bg-green-500', '5': 'bg-green-500', '6': 'bg-green-500',
      '7': 'bg-purple-500', 'B': 'bg-orange-500', 'D': 'bg-orange-500', 'F': 'bg-orange-500', 'M': 'bg-orange-500',
      'A': 'bg-blue-600', 'C': 'bg-blue-600', 'E': 'bg-blue-600',
      'G': 'bg-lime-500', 'J': 'bg-amber-600', 'Z': 'bg-amber-600',
      'L': 'bg-gray-500', 'S': 'bg-gray-600', 'SIR': 'bg-blue-800'
    };
    return colors[line] || 'bg-blue-500';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTimeStatus = (alert: ServiceAlert) => {
    const now = new Date();
    
    if (alert.endTime && alert.endTime < now) {
      return { text: 'Ended', color: 'text-gray-500' };
    }
    
    if (alert.startTime && alert.startTime > now) {
      return { text: `Starts ${formatTime(alert.startTime)}`, color: 'text-blue-600' };
    }
    
    if (alert.endTime) {
      return { text: `Until ${formatTime(alert.endTime)}`, color: 'text-orange-600' };
    }
    
    return { text: 'Ongoing', color: 'text-green-600' };
  };

  // Count alerts by severity for the summary
  const severityCounts = filteredAlerts.reduce((acc, alert) => {
    acc[alert.severity] = (acc[alert.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className={`${className}`}>
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <div className="text-left">
            <h4 className="font-medium text-gray-900">
              Service Alerts ({filteredAlerts.length})
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              {Object.entries(severityCounts).map(([severity, count]) => (
                <span
                  key={severity}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadgeColor(severity)}`}
                >
                  {count} {severity}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {isExpanded ? 'Hide' : 'Show'} details
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="mt-3 space-y-3 max-h-96 overflow-y-auto">
          {filteredAlerts.map(alert => {
            const timeStatus = getTimeStatus(alert);
            
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(alert.severity)}
                    <h5 className="font-medium">{alert.title}</h5>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span className={`text-xs ${timeStatus.color}`}>
                      {timeStatus.text}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm mb-3 leading-relaxed">
                  {alert.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium">Affected lines:</span>
                    <div className="flex space-x-1">
                      {alert.affectedLines.map(line => (
                        <span
                          key={line}
                          className={`${getLineColor(line)} text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center`}
                        >
                          {line}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {alert.url && (
                    <a
                      href={alert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-xs hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>More info</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};