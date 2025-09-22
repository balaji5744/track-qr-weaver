import { useState } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import QRGenerator from '@/components/QRGenerator';
import BatchProcessor from '@/components/BatchProcessor';
import QualityDashboard from '@/components/QualityDashboard';
import DatabaseViewer from '@/components/DatabaseViewer';
import RailwayNetwork from '@/components/RailwayNetwork';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HeroSection onGetStarted={() => setActiveTab('generator')} />;
      case 'generator':
        return <QRGenerator />;
      case 'batch':
        return <BatchProcessor />;
      case 'quality':
        return <QualityDashboard />;
      case 'database':
        return <DatabaseViewer />;
      case 'network':
        return <RailwayNetwork />;
      default:
        return <HeroSection onGetStarted={() => setActiveTab('generator')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className={`transition-all duration-300 ${
        activeTab === 'home' ? '' : 'lg:ml-72 pt-24 lg:pt-6 px-4 lg:px-6 pb-6'
      }`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
