import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QrCode, Download, Copy, RefreshCw, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

export default function QRGenerator() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [formData, setFormData] = useState({
    region: '',
    division: '',
    trackId: '',
    kmMarker: '',
    componentType: '',
    year: new Date().getFullYear().toString(),
    serialNumber: '',
  });
  
  const [qrData, setQrData] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  const regions = [
    { value: 'WR', label: 'Western Railway (WR)' },
    { value: 'CR', label: 'Central Railway (CR)' },
    { value: 'NR', label: 'Northern Railway (NR)' },
    { value: 'ER', label: 'Eastern Railway (ER)' },
    { value: 'SR', label: 'Southern Railway (SR)' },
    { value: 'NWR', label: 'North Western Railway (NWR)' },
    { value: 'NCR', label: 'North Central Railway (NCR)' },
  ];

  const divisions = {
    WR: ['BCT', 'VAPI', 'RTM', 'BRC', 'ADI', 'PUNE', 'KOP'],
    CR: ['CSMT', 'LTT', 'KALYAN', 'PUNE', 'NAGPUR', 'BPL'],
    NR: ['DLI', 'AMB', 'FZR', 'LDH', 'UMB', 'JRC'],
    ER: ['HWH', 'SRC', 'KGP', 'ADRA', 'ASN', 'MLG'],
    SR: ['MAS', 'MDU', 'TVC', 'TPJ', 'SA', 'BZA'],
    NWR: ['JP', 'JU', 'BKN', 'AII', 'AF', 'RTM'],
    NCR: ['ALJN', 'AGC', 'JHS', 'BPL', 'KOTA', 'SWM'],
  };

  const componentTypes = [
    'BOLT', 'CLIP', 'PLATE', 'SLEEPER', 'FISH', 'ANCHOR', 'SPIKE', 'WASHER'
  ];

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    
    // Reset division if region changes
    if (field === 'region') {
      newFormData.division = '';
    }
    
    setFormData(newFormData);
    setQrGenerated(false);
  };

  const generateQRData = () => {
    const { region, division, trackId, kmMarker, componentType, year, serialNumber } = formData;
    
    if (!region || !division || !trackId || !kmMarker || !componentType || !year || !serialNumber) {
      return '';
    }
    
    return `IR-${region}-${division}-${trackId.padStart(3, '0')}-${kmMarker}-${componentType}-${year}-${serialNumber.padStart(6, '0')}`;
  };

  const generateQR = async () => {
    const data = generateQRData();
    if (!data) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields to generate QR code.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setQrData(data);

    try {
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, data, {
          width: 300,
          margin: 2,
          color: {
            dark: '#003366',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'H'
        });
        setQrGenerated(true);
        toast({
          title: "QR Code Generated",
          description: "Railway component QR code generated successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (canvas && qrGenerated) {
      const link = document.createElement('a');
      link.download = `${qrData}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: "Downloaded",
        description: "QR code downloaded successfully!",
      });
    }
  };

  const copyQRData = () => {
    navigator.clipboard.writeText(qrData);
    toast({
      title: "Copied",
      description: "QR data copied to clipboard!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <QrCode className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">QR Code Generator</h1>
          <p className="text-muted-foreground">Generate QR codes for railway track components</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Component Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Railway Region</Label>
                <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="division">Division</Label>
                <Select 
                  value={formData.division} 
                  onValueChange={(value) => handleInputChange('division', value)}
                  disabled={!formData.region}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.region && divisions[formData.region as keyof typeof divisions]?.map((division) => (
                      <SelectItem key={division} value={division}>
                        {division}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trackId">Track ID</Label>
                <Input
                  id="trackId"
                  placeholder="e.g., 021"
                  value={formData.trackId}
                  onChange={(e) => handleInputChange('trackId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kmMarker">KM Marker</Label>
                <Input
                  id="kmMarker"
                  placeholder="e.g., 114320"
                  value={formData.kmMarker}
                  onChange={(e) => handleInputChange('kmMarker', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="componentType">Component Type</Label>
                <Select value={formData.componentType} onValueChange={(value) => handleInputChange('componentType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {componentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                placeholder="e.g., 001234"
                value={formData.serialNumber}
                onChange={(e) => handleInputChange('serialNumber', e.target.value)}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <Label>Generated QR Data</Label>
                <div className="mt-2 p-3 bg-muted rounded-md font-mono text-sm">
                  {generateQRData() || 'Complete form to see QR data preview'}
                </div>
              </div>

              <Button
                onClick={generateQR}
                disabled={isGenerating || !generateQRData()}
                className="w-full"
                variant="railway"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR Code
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated QR Code
              {qrGenerated && (
                <Badge variant="secondary" className="bg-railway-success/10 text-railway-success">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ready
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-8 bg-muted/50 rounded-lg">
              {qrGenerated ? (
                <canvas
                  ref={canvasRef}
                  className="border border-border rounded-lg shadow-lg"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <QrCode className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>QR code will appear here</p>
                </div>
              )}
            </div>

            {qrGenerated && (
              <>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={copyQRData} className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Data
                  </Button>
                  <Button variant="accent" onClick={downloadQR} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>QR Code Specifications</Label>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Error Correction: High (30% damage tolerance)</p>
                    <p>• Format: PNG with transparent background</p>
                    <p>• Encoding: UTF-8</p>
                    <p>• Optimized for laser marking</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}