import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Train, QrCode, Zap, Shield, Database, Cpu } from 'lucide-react';
import railwayHeroImage from '@/assets/railway-hero.jpg';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const features = [
    {
      icon: QrCode,
      title: 'AI-Powered QR Generation',
      description: 'Generate railway-specific QR codes with advanced AI validation'
    },
    {
      icon: Zap,
      title: 'Laser Marking Ready',
      description: 'Optimized for laser marking systems on track components'
    },
    {
      icon: Shield,
      title: 'Quality Verification',
      description: 'Computer vision-based quality checking for reliability'
    },
    {
      icon: Database,
      title: 'Component Tracking',
      description: 'Complete database management for 68,000+ km railway network'
    }
  ];

  const stats = [
    { value: '68,000+', label: 'Kilometers of Track' },
    { value: '1M+', label: 'Components Tracked' },
    { value: '99.9%', label: 'Accuracy Rate' },
    { value: '24/7', label: 'System Availability' }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${railwayHeroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-32 lg:pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="secondary" className="px-4 py-2">
                <Cpu className="w-4 h-4 mr-2" />
                Smart India Hackathon 2025
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in-up">
              Railway QR Code
              <span className="bg-gradient-hero bg-clip-text text-transparent block">
                Generation System
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              AI-based development of Laser-based QR Code marking on track fittings for Indian Railways
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="hero" size="lg" onClick={onGetStarted} className="px-8 py-4 text-lg">
                <Train className="w-5 h-5 mr-2" />
                Start Generating QR Codes
              </Button>
              <Button variant="glass" size="lg" className="px-8 py-4 text-lg">
                View Documentation
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center bg-gradient-glass backdrop-blur-sm border-white/20">
                <div className="text-3xl lg:text-4xl font-bold text-railway-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 bg-gradient-glass backdrop-blur-sm border-white/20 hover:shadow-glass transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}