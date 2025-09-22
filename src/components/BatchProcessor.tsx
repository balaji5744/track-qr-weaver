import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileText, Download, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

interface ComponentData {
  region: string;
  division: string;
  track_id: string;
  km_marker: string;
  component_type: string;
  year: string;
  serial_number: string;
  material?: string;
  size?: string;
  manufacturer?: string;
}

interface ProcessedComponent extends ComponentData {
  qr_data: string;
  status: 'pending' | 'processed' | 'error';
  error_message?: string;
}

export default function BatchProcessor() {
  const { toast } = useToast();
  const [csvData, setCsvData] = useState<ComponentData[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedComponent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      
      Papa.parse(file, {
        complete: (results) => {
          try {
            const data = results.data as ComponentData[];
            // Filter out empty rows and validate required fields
            const validData = data.filter(row => 
              row.region && row.division && row.track_id && 
              row.km_marker && row.component_type && row.year && row.serial_number
            );
            
            setCsvData(validData);
            toast({
              title: "CSV Uploaded",
              description: `Successfully loaded ${validData.length} components for processing.`,
            });
          } catch (error) {
            toast({
              title: "Upload Error",
              description: "Failed to parse CSV file. Please check the format.",
              variant: "destructive",
            });
          }
        },
        header: true,
        skipEmptyLines: true,
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a valid CSV file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const generateQRData = (component: ComponentData): string => {
    return `IR-${component.region}-${component.division}-${component.track_id.padStart(3, '0')}-${component.km_marker}-${component.component_type}-${component.year}-${component.serial_number.padStart(6, '0')}`;
  };

  const validateComponent = (component: ComponentData): { isValid: boolean; error?: string } => {
    const requiredFields = ['region', 'division', 'track_id', 'km_marker', 'component_type', 'year', 'serial_number'];
    
    for (const field of requiredFields) {
      if (!component[field as keyof ComponentData]) {
        return { isValid: false, error: `Missing ${field}` };
      }
    }
    
    // Validate year
    const year = parseInt(component.year);
    if (isNaN(year) || year < 2020 || year > 2030) {
      return { isValid: false, error: 'Invalid year' };
    }
    
    return { isValid: true };
  };

  const processBatch = async () => {
    if (csvData.length === 0) return;
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    const processed: ProcessedComponent[] = [];
    
    for (let i = 0; i < csvData.length; i++) {
      const component = csvData[i];
      const validation = validateComponent(component);
      
      if (!validation.isValid) {
        processed.push({
          ...component,
          qr_data: '',
          status: 'error',
          error_message: validation.error,
        });
      } else {
        try {
          const qrData = generateQRData(component);
          
          // Simulate QR generation delay
          await new Promise(resolve => setTimeout(resolve, 100));
          
          processed.push({
            ...component,
            qr_data: qrData,
            status: 'processed',
          });
        } catch (error) {
          processed.push({
            ...component,
            qr_data: '',
            status: 'error',
            error_message: 'QR generation failed',
          });
        }
      }
      
      setProcessingProgress(((i + 1) / csvData.length) * 100);
    }
    
    setProcessedData(processed);
    setIsProcessing(false);
    
    const successCount = processed.filter(p => p.status === 'processed').length;
    const errorCount = processed.filter(p => p.status === 'error').length;
    
    toast({
      title: "Batch Processing Complete",
      description: `Successfully processed ${successCount} components. ${errorCount} errors.`,
    });
  };

  const downloadResults = () => {
    const csvContent = Papa.unparse(processedData.map(component => ({
      ...component,
      status: component.status,
      error_message: component.error_message || '',
    })));
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `processed_qr_codes_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Batch processing results downloaded successfully!",
    });
  };

  const downloadQRImages = async () => {
    const successfulComponents = processedData.filter(c => c.status === 'processed');
    
    if (successfulComponents.length === 0) {
      toast({
        title: "No QR Codes",
        description: "No successfully processed QR codes to download.",
        variant: "destructive",
      });
      return;
    }

    const zip = new JSZip();
    
    for (const component of successfulComponents) {
      try {
        const qrDataUrl = await QRCode.toDataURL(component.qr_data, {
          width: 300,
          margin: 2,
          color: {
            dark: '#003366',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'H'
        });
        
        const base64Data = qrDataUrl.split(',')[1];
        zip.file(`${component.qr_data}.png`, base64Data, { base64: true });
      } catch (error) {
        console.error(`Failed to generate QR for ${component.qr_data}:`, error);
      }
    }
    
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr_codes_batch_${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: `Downloaded ${successfulComponents.length} QR code images as ZIP file.`,
    });
  };

  const successCount = processedData.filter(p => p.status === 'processed').length;
  const errorCount = processedData.filter(p => p.status === 'error').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
          <Upload className="w-6 h-6 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Batch Processing</h1>
          <p className="text-muted-foreground">Upload CSV file to generate multiple QR codes</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-railway-primary bg-railway-primary/5'
                  : 'border-border hover:border-railway-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-railway-primary">Drop the CSV file here...</p>
              ) : (
                <div>
                  <p className="text-foreground font-medium">Drag & drop CSV file here</p>
                  <p className="text-muted-foreground text-sm mt-1">or click to browse</p>
                </div>
              )}
            </div>

            {uploadedFile && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <FileText className="w-5 h-5 text-railway-success" />
                <div className="flex-1">
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Badge variant="secondary" className="bg-railway-success/10 text-railway-success">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ready
                </Badge>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-medium">CSV Format Requirements:</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Required columns: region, division, track_id, km_marker, component_type, year, serial_number</p>
                <p>Optional columns: material, size, manufacturer</p>
              </div>
            </div>

            <Separator />

            {csvData.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Components loaded: {csvData.length}</span>
                  <Button
                    onClick={processBatch}
                    disabled={isProcessing}
                    variant="railway"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Process Batch'
                    )}
                  </Button>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing components...</span>
                      <span>{Math.round(processingProgress)}%</span>
                    </div>
                    <Progress value={processingProgress} className="w-full" />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Processing Results
              {processedData.length > 0 && (
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-railway-success/10 text-railway-success">
                    {successCount} Success
                  </Badge>
                  {errorCount > 0 && (
                    <Badge variant="secondary" className="bg-railway-danger/10 text-railway-danger">
                      {errorCount} Errors
                    </Badge>
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {processedData.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Process CSV file to see results</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={downloadResults} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </Button>
                  <Button variant="accent" onClick={downloadQRImages} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Images
                  </Button>
                </div>

                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>QR Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Component</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processedData.slice(0, 20).map((component, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-xs">
                            {component.qr_data || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {component.status === 'processed' ? (
                              <Badge variant="secondary" className="bg-railway-success/10 text-railway-success">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Success
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-railway-danger/10 text-railway-danger">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Error
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{component.region}-{component.division}</TableCell>
                          <TableCell>{component.component_type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {processedData.length > 20 && (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      Showing first 20 of {processedData.length} results
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}