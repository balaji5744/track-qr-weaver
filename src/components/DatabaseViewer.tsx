import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Search, Filter, Download, Eye, BarChart } from 'lucide-react';

export default function DatabaseViewer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedComponent, setSelectedComponent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock database data
  const components = [
    {
      id: 1,
      qr_data: 'IR-WR-BCT-021-114320-BOLT-2024-001234',
      region: 'WR',
      division: 'BCT',
      track_id: '021',
      km_marker: '114320',
      component_type: 'BOLT',
      year: '2024',
      serial_number: '001234',
      material: 'Steel',
      size: 'M20',
      manufacturer: 'Railway Component Co.',
      status: 'ACTIVE',
      created_date: '2024-01-15',
      last_verified: '2024-01-20'
    },
    {
      id: 2,
      qr_data: 'IR-CR-CSMT-105-89450-CLIP-2024-002001',
      region: 'CR',
      division: 'CSMT',
      track_id: '105',
      km_marker: '89450',
      component_type: 'CLIP',
      year: '2024',
      serial_number: '002001',
      material: 'Steel',
      size: 'Standard',
      manufacturer: 'Track Solutions Ltd.',
      status: 'ACTIVE',
      created_date: '2024-01-16',
      last_verified: '2024-01-21'
    },
    {
      id: 3,
      qr_data: 'IR-NR-DLI-067-234100-PLATE-2024-003001',
      region: 'NR',
      division: 'DLI',
      track_id: '067',
      km_marker: '234100',
      component_type: 'PLATE',
      year: '2024',
      serial_number: '003001',
      material: 'Steel',
      size: 'Heavy Duty',
      manufacturer: 'Northern Rails Inc.',
      status: 'REPLACED',
      created_date: '2024-01-17',
      last_verified: '2024-01-19'
    },
    {
      id: 4,
      qr_data: 'IR-SR-MAS-142-456780-SLEEPER-2024-004567',
      region: 'SR',
      division: 'MAS',
      track_id: '142',
      km_marker: '456780',
      component_type: 'SLEEPER',
      year: '2024',
      serial_number: '004567',
      material: 'Concrete',
      size: 'Standard',
      manufacturer: 'Southern Railway Works',
      status: 'MAINTENANCE',
      created_date: '2024-01-18',
      last_verified: '2024-01-22'
    },
    {
      id: 5,
      qr_data: 'IR-ER-HWH-089-123456-ANCHOR-2024-005678',
      region: 'ER',
      division: 'HWH',
      track_id: '089',
      km_marker: '123456',
      component_type: 'ANCHOR',
      year: '2024',
      serial_number: '005678',
      material: 'Steel',
      size: 'Heavy',
      manufacturer: 'Eastern Track Systems',
      status: 'ACTIVE',
      created_date: '2024-01-19',
      last_verified: '2024-01-23'
    }
  ];

  const regions = ['WR', 'CR', 'NR', 'ER', 'SR', 'NWR', 'NCR'];
  const componentTypes = ['BOLT', 'CLIP', 'PLATE', 'SLEEPER', 'FISH', 'ANCHOR', 'SPIKE', 'WASHER'];
  const statuses = ['ACTIVE', 'REPLACED', 'MAINTENANCE', 'DECOMMISSIONED'];

  const filteredComponents = components.filter(component => {
    const matchesSearch = searchTerm === '' || 
      component.qr_data.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.component_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = selectedRegion === 'all' || component.region === selectedRegion;
    const matchesComponent = selectedComponent === 'all' || component.component_type === selectedComponent;
    const matchesStatus = selectedStatus === 'all' || component.status === selectedStatus;
    
    return matchesSearch && matchesRegion && matchesComponent && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-railway-success/10 text-railway-success';
      case 'REPLACED': return 'bg-railway-warning/10 text-railway-warning';
      case 'MAINTENANCE': return 'bg-railway-accent/10 text-railway-accent';
      case 'DECOMMISSIONED': return 'bg-railway-danger/10 text-railway-danger';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const statsData = [
    { label: 'Total Components', value: components.length.toLocaleString(), color: 'railway-primary' },
    { label: 'Active Components', value: components.filter(c => c.status === 'ACTIVE').length.toLocaleString(), color: 'railway-success' },
    { label: 'Regions Covered', value: new Set(components.map(c => c.region)).size.toString(), color: 'railway-accent' },
    { label: 'Component Types', value: new Set(components.map(c => c.component_type)).size.toString(), color: 'railway-warning' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Database className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Component Database</h1>
          <p className="text-muted-foreground">View and manage railway track component records</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="bg-gradient-glass backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Component Records</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <BarChart className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by QR code, component type, or region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Component" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Components</SelectItem>
                  {componentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>QR Code</TableHead>
                  <TableHead>Region/Division</TableHead>
                  <TableHead>Track Info</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Specifications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Verified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComponents.map((component) => (
                  <TableRow key={component.id}>
                    <TableCell className="font-mono text-xs">
                      {component.qr_data}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{component.region}-{component.division}</div>
                        <div className="text-xs text-muted-foreground">
                          Track {component.track_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>KM {component.km_marker}</div>
                        <div className="text-xs text-muted-foreground">
                          Serial: {component.serial_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {component.component_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{component.material}</div>
                        <div className="text-xs text-muted-foreground">
                          {component.size}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(component.status)}>
                        {component.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {component.last_verified}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredComponents.length} of {components.length} components
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}