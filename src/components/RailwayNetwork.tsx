import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Network, MapPin, Train, Users, BarChart3, TrendingUp } from 'lucide-react';
import railwayComponentsImage from '@/assets/railway-components.jpg';

export default function RailwayNetwork() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const railwayRegions = [
    {
      code: 'WR',
      name: 'Western Railway',
      headquarters: 'Mumbai',
      divisions: ['BCT', 'VAPI', 'RTM', 'BRC', 'ADI', 'PUNE', 'KOP'],
      totalTrack: '8,500 km',
      components: '1,250,000',
      established: '1951',
      color: 'railway-primary'
    },
    {
      code: 'CR',
      name: 'Central Railway',
      headquarters: 'Mumbai',
      divisions: ['CSMT', 'LTT', 'KALYAN', 'PUNE', 'NAGPUR', 'BPL'],
      totalTrack: '3,900 km',
      components: '890,000',
      established: '1951',
      color: 'railway-accent'
    },
    {
      code: 'NR',
      name: 'Northern Railway',
      headquarters: 'New Delhi',
      divisions: ['DLI', 'AMB', 'FZR', 'LDH', 'UMB', 'JRC'],
      totalTrack: '6,807 km',
      components: '1,120,000',
      established: '1952',
      color: 'railway-success'
    },
    {
      code: 'ER',
      name: 'Eastern Railway',
      headquarters: 'Kolkata',
      divisions: ['HWH', 'SRC', 'KGP', 'ADRA', 'ASN', 'MLG'],
      totalTrack: '2,414 km',
      components: '650,000',
      established: '1952',
      color: 'railway-warning'
    },
    {
      code: 'SR',
      name: 'Southern Railway',
      headquarters: 'Chennai',
      divisions: ['MAS', 'MDU', 'TVC', 'TPJ', 'SA', 'BZA'],
      totalTrack: '5,098 km',
      components: '980,000',
      established: '1951',
      color: 'railway-danger'
    },
    {
      code: 'NWR',
      name: 'North Western Railway',
      headquarters: 'Jaipur',
      divisions: ['JP', 'JU', 'BKN', 'AII', 'AF', 'RTM'],
      totalTrack: '5,459 km',
      components: '780,000',
      established: '2002',
      color: 'railway-primary'
    }
  ];

  const networkStats = [
    {
      title: 'Total Railway Network',
      value: '68,000+',
      unit: 'kilometers',
      icon: Network,
      description: 'Extensive railway network across India'
    },
    {
      title: 'QR Components Tracked',
      value: '5.7M+',
      unit: 'components',
      icon: BarChart3,
      description: 'Track components with QR codes'
    },
    {
      title: 'Railway Divisions',
      value: '68',
      unit: 'divisions',
      icon: MapPin,
      description: 'Operational railway divisions'
    },
    {
      title: 'Daily Passengers',
      value: '23M+',
      unit: 'passengers',
      icon: Users,
      description: 'Daily passenger traffic'
    }
  ];

  const componentDistribution = [
    { type: 'BOLT', count: 2100000, percentage: 37 },
    { type: 'CLIP', count: 1450000, percentage: 25 },
    { type: 'PLATE', count: 890000, percentage: 16 },
    { type: 'SLEEPER', count: 680000, percentage: 12 },
    { type: 'ANCHOR', count: 340000, percentage: 6 },
    { type: 'Others', count: 240000, percentage: 4 }
  ];

  const getRegionColorClass = (color: string) => {
    switch (color) {
      case 'railway-primary': return 'bg-railway-primary/10 text-railway-primary border-railway-primary/20';
      case 'railway-accent': return 'bg-railway-accent/10 text-railway-accent border-railway-accent/20';
      case 'railway-success': return 'bg-railway-success/10 text-railway-success border-railway-success/20';
      case 'railway-warning': return 'bg-railway-warning/10 text-railway-warning border-railway-warning/20';
      case 'railway-danger': return 'bg-railway-danger/10 text-railway-danger border-railway-danger/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Network className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Railway Network Explorer</h1>
          <p className="text-muted-foreground">Overview of Indian Railways network and QR code deployment</p>
        </div>
      </div>

      {/* Network Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {networkStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gradient-glass backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.unit}</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-foreground mb-1">{stat.title}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Railway Regions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Railway Regions & Divisions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {railwayRegions.map((region) => (
                <div
                  key={region.code}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedRegion === region.code
                      ? getRegionColorClass(region.color)
                      : 'border-border hover:border-railway-primary/30'
                  }`}
                  onClick={() => setSelectedRegion(selectedRegion === region.code ? null : region.code)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {region.code}
                        </Badge>
                        <h3 className="font-semibold text-foreground">{region.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        HQ: {region.headquarters} • Est. {region.established}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{region.totalTrack}</div>
                      <div className="text-xs text-muted-foreground">Track Length</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-lg font-bold text-foreground">{region.components}</div>
                      <div className="text-xs text-muted-foreground">QR Components</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-foreground">{region.divisions.length}</div>
                      <div className="text-xs text-muted-foreground">Divisions</div>
                    </div>
                  </div>

                  {selectedRegion === region.code && (
                    <div className="pt-3 border-t border-border">
                      <div className="mb-2">
                        <h4 className="text-sm font-medium text-foreground mb-2">Divisions:</h4>
                        <div className="flex flex-wrap gap-1">
                          {region.divisions.map((division) => (
                            <Badge key={division} variant="outline" className="text-xs">
                              {division}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Component Distribution */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Component Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {componentDistribution.map((component, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{component.type}</span>
                      <div className="text-right">
                        <div className="text-sm font-bold">{component.count.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{component.percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${component.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="h-32 bg-cover bg-center rounded-lg mb-4 relative overflow-hidden"
                style={{ backgroundImage: `url(${railwayComponentsImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 text-white">
                  <p className="text-sm font-medium">Track Components</p>
                  <p className="text-xs opacity-90">QR-enabled monitoring</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-railway-success" />
                    <span className="text-sm font-medium">Deployment Rate</span>
                  </div>
                  <span className="text-sm font-bold text-railway-success">84.7%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Train className="w-4 h-4 text-railway-primary" />
                    <span className="text-sm font-medium">Active Monitoring</span>
                  </div>
                  <span className="text-sm font-bold text-railway-primary">99.2%</span>
                </div>
                
                <Separator />
                
                <Button variant="outline" className="w-full">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}