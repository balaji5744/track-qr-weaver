import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { BarChart3, CheckCircle, AlertTriangle, TrendingUp, Eye, Zap, Shield } from 'lucide-react';
import qrScanningImage from '@/assets/qr-scanning.jpg';

export default function QualityDashboard() {
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const qualityMetrics = {
    overview: {
      title: 'Quality Overview',
      data: [
        { label: 'Total QR Codes Verified', value: '12,847', trend: '+5.2%', color: 'railway-primary' },
        { label: 'Success Rate', value: '99.2%', trend: '+0.3%', color: 'railway-success' },
        { label: 'Failed Verification', value: '102', trend: '-12%', color: 'railway-danger' },
        { label: 'Average Quality Score', value: '94.8', trend: '+2.1%', color: 'railway-accent' },
      ]
    },
    readability: {
      title: 'Readability Analysis',
      data: [
        { label: 'High Readability', value: '11,890', percentage: 92.5 },
        { label: 'Medium Readability', value: '855', percentage: 6.7 },
        { label: 'Low Readability', value: '102', percentage: 0.8 },
      ]
    },
    technical: {
      title: 'Technical Specifications',
      data: [
        { label: 'Size Compliance', value: '98.7%', status: 'excellent' },
        { label: 'Contrast Ratio', value: '96.2%', status: 'good' },
        { label: 'Alignment Accuracy', value: '99.1%', status: 'excellent' },
        { label: 'Error Correction', value: '100%', status: 'perfect' },
      ]
    }
  };

  const recentChecks = [
    {
      id: 'IR-WR-BCT-021-114320-BOLT-2024-001234',
      component: 'Track Bolt',
      region: 'WR-BCT',
      score: 98.5,
      status: 'passed',
      issues: [],
      timestamp: '2 minutes ago'
    },
    {
      id: 'IR-CR-CSMT-105-89450-CLIP-2024-002001',
      component: 'Rail Clip',
      region: 'CR-CSMT',
      score: 94.2,
      status: 'passed',
      issues: ['Minor alignment deviation'],
      timestamp: '5 minutes ago'
    },
    {
      id: 'IR-NR-DLI-067-234100-PLATE-2024-003001',
      component: 'Fish Plate',
      region: 'NR-DLI',
      score: 87.8,
      status: 'warning',
      issues: ['Low contrast detected', 'Size below optimal'],
      timestamp: '8 minutes ago'
    },
    {
      id: 'IR-SR-MAS-142-456780-SLEEPER-2024-004567',
      component: 'Railway Sleeper',
      region: 'SR-MAS',
      score: 62.1,
      status: 'failed',
      issues: ['Severe alignment issues', 'Poor readability', 'Size non-compliant'],
      timestamp: '12 minutes ago'
    }
  ];

  const aiFeatures = [
    {
      icon: Eye,
      title: 'Computer Vision Analysis',
      description: 'Advanced image processing to detect quality issues',
      status: 'Active'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Instant quality verification with sub-second response',
      status: 'Active'
    },
    {
      icon: Shield,
      title: 'Error Correction Validation',
      description: 'Ensures 30% damage tolerance for outdoor environments',
      status: 'Active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-railway-success/10 text-railway-success';
      case 'warning': return 'bg-railway-warning/10 text-railway-warning';
      case 'failed': return 'bg-railway-danger/10 text-railway-danger';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-railway-success';
    if (score >= 85) return 'text-railway-warning';
    return 'text-railway-danger';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quality Verification Dashboard</h1>
          <p className="text-muted-foreground">AI-powered quality analysis for railway QR codes</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {qualityMetrics.overview.data.map((metric, index) => (
          <Card key={index} className="bg-gradient-glass backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{metric.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {metric.trend}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quality Analysis */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Quality Analysis
              <div className="flex gap-2">
                {Object.keys(qualityMetrics).map((key) => (
                  <Button
                    key={key}
                    variant={selectedMetric === key ? 'railway' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedMetric(key)}
                  >
                    {qualityMetrics[key as keyof typeof qualityMetrics].title.split(' ')[0]}
                  </Button>
                ))}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMetric === 'overview' && (
              <div className="space-y-4">
                <div 
                  className="h-48 bg-cover bg-center rounded-lg relative overflow-hidden"
                  style={{ backgroundImage: `url(${qrScanningImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">AI Quality Verification</h3>
                    <p className="text-sm opacity-90">Advanced computer vision analysis</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {aiFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                        <Icon className="w-8 h-8 mx-auto mb-2 text-railway-primary" />
                        <h4 className="font-medium text-sm mb-1">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{feature.description}</p>
                        <Badge variant="secondary" className="text-xs bg-railway-success/10 text-railway-success">
                          {feature.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedMetric === 'readability' && (
              <div className="space-y-4">
                {qualityMetrics.readability.data.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-sm text-muted-foreground">{item.value} ({item.percentage}%)</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            )}

            {selectedMetric === 'technical' && (
              <div className="space-y-4">
                {qualityMetrics.technical.data.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.value}</span>
                      <Badge 
                        variant="secondary" 
                        className={
                          item.status === 'perfect' ? 'bg-railway-success/10 text-railway-success' :
                          item.status === 'excellent' ? 'bg-railway-primary/10 text-railway-primary' :
                          item.status === 'good' ? 'bg-railway-warning/10 text-railway-warning' :
                          'bg-muted text-muted-foreground'
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Quality Checks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Quality Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentChecks.map((check, index) => (
                <div key={index} className="p-3 border border-border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-mono text-xs text-muted-foreground mb-1">
                        {check.id}
                      </p>
                      <p className="font-medium text-sm">{check.component}</p>
                      <p className="text-xs text-muted-foreground">{check.region}</p>
                    </div>
                    <Badge variant="secondary" className={getStatusColor(check.status)}>
                      {check.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quality Score</span>
                    <span className={`font-bold ${getScoreColor(check.score)}`}>
                      {check.score}%
                    </span>
                  </div>
                  
                  {check.issues.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Issues:</span>
                      {check.issues.map((issue, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-railway-warning" />
                          <span className="text-xs">{issue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">{check.timestamp}</span>
                    {check.status === 'passed' && (
                      <CheckCircle className="w-4 h-4 text-railway-success" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <Button variant="outline" className="w-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Full Quality Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}