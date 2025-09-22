import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Train, QrCode, Database, BarChart3, Network, Upload } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Train },
    { id: 'generator', label: 'QR Generator', icon: QrCode },
    { id: 'batch', label: 'Batch Processing', icon: Upload },
    { id: 'quality', label: 'Quality Check', icon: BarChart3 },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'network', label: 'Railway Network', icon: Network },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <Card className="hidden lg:block fixed left-4 top-4 bottom-4 w-64 z-50 bg-gradient-glass backdrop-blur-xl border-white/20 shadow-glass">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Train className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Railway QR</h1>
              <Badge variant="secondary" className="text-xs">Smart India Hackathon</Badge>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'railway' : 'ghost'}
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <p>Indian Railways</p>
              <p>QR Marking System</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Card className="fixed top-4 left-4 right-4 z-50 bg-gradient-glass backdrop-blur-xl border-white/20 shadow-glass">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Train className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Railway QR</h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {isOpen && (
            <div className="p-4 pt-0 border-t border-border">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? 'railway' : 'ghost'}
                      className="w-full justify-start gap-3 h-10"
                      onClick={() => {
                        onTabChange(item.id);
                        setIsOpen(false);
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}