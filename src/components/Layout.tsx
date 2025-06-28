import React from 'react';
import { Train, Users, MapPin } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onLogoClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, title = 'MTA Meetup', onLogoClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={onLogoClick}
              className="flex items-center space-x-3 hover:bg-blue-800 rounded-lg p-2 transition-colors"
            >
              <div className="bg-orange-500 p-2 rounded-lg">
                <Train className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">MTA Meetup</h1>
                <p className="text-blue-200 text-sm">Find friends on the subway</p>
              </div>
            </button>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-blue-200">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">NYC Transit</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title !== 'MTA Meetup' && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          </div>
        )}
        {children}
      </main>

      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <Users className="h-5 w-5 text-orange-400" />
              <span className="text-sm">Connecting subway riders across NYC</span>
            </div>
            <div className="text-sm text-gray-400">
              Real-time MTA data integration
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};