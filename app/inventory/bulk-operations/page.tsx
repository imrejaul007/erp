'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, Edit, Tag, Package, FileSpreadsheet, CheckCircle, AlertCircle,
  ArrowLeft} from 'lucide-react';
import { toast } from 'sonner';

export default function BulkOperationsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success(`File selected: ${selectedFile.name}`);
    }
  };

  const handleBulkImport = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setResults({
        success: 45,
        failed: 2,
        total: 47,
        errors: [
          { row: 12, error: 'Invalid SKU format' },
          { row: 28, error: 'Missing required field: price' },
        ],
      });
      setProcessing(false);
      toast.success('Bulk import completed!');
    }, 2000);
  };

  const downloadTemplate = (type: string) => {
    // Create CSV template
    let csv = '';

    switch(type) {
      case 'products':
        csv = 'SKU,Name,Name (Arabic),Category,Price (AED),Cost (AED),Stock,Unit,Barcode\n';
        csv += 'OUD-001,Royal Oud,عود ملكي,Oud,850.00,420.00,50,ml,8901234567890\n';
        csv += 'ATT-001,Rose Attar,عطر الورد,Attar,450.00,200.00,30,ml,8901234567891\n';
        break;
      case 'customers':
        csv = 'Name,Name (Arabic),Email,Phone,Segment,Emirate\n';
        csv += 'Ahmed Al-Mansoori,أحمد المنصوري,ahmed@example.com,+971501234567,VIP,Dubai\n';
        csv += 'Fatima Hassan,فاطمة حسن,fatima@example.com,+971502345678,Regular,Sharjah\n';
        break;
      case 'prices':
        csv = 'SKU,Retail Price,Wholesale Price,VIP Price,Corporate Price\n';
        csv += 'OUD-001,850.00,720.00,800.00,680.00\n';
        csv += 'ATT-001,450.00,380.00,420.00,360.00\n';
        break;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(`Template downloaded: ${type}_template.csv`);
  };

  return (
    <div className="container mx-auto p-6 space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold">Bulk Operations</h1>
          <p className="text-muted-foreground">Import, export, and update data in bulk</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/inventory')}>
          <Package className="mr-2 h-4 w-4" />
          Back to Inventory
        </Button>
      </div>

      <Tabs defaultValue="import" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="import">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </TabsTrigger>
          <TabsTrigger value="update">
            <Edit className="h-4 w-4 mr-2" />
            Bulk Update
          </TabsTrigger>
          <TabsTrigger value="labels">
            <Tag className="h-4 w-4 mr-2" />
            Bulk Labels
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Import Products</CardTitle>
                <CardDescription>Bulk import product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full" onClick={() => downloadTemplate('products')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                  <div className="space-y-2">
                    <Label>Upload CSV File</Label>
                    <Input
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={handleFileUpload}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleBulkImport}
                    disabled={!file || processing}
                  >
                    {processing ? 'Processing...' : 'Import Products'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Import Customers</CardTitle>
                <CardDescription>Bulk import customer database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full" onClick={() => downloadTemplate('customers')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                  <div className="space-y-2">
                    <Label>Upload CSV File</Label>
                    <Input type="file" accept=".csv,.xlsx" />
                  </div>
                  <Button className="w-full">Import Customers</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Update Prices</CardTitle>
                <CardDescription>Bulk price updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full" onClick={() => downloadTemplate('prices')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                  <div className="space-y-2">
                    <Label>Upload CSV File</Label>
                    <Input type="file" accept=".csv,.xlsx" />
                  </div>
                  <Button className="w-full">Update Prices</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Import Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-xl sm:text-2xl font-bold text-green-600">{results.success}</p>
                          <p className="text-sm text-green-700">Successful</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="text-xl sm:text-2xl font-bold text-red-600">{results.failed}</p>
                          <p className="text-sm text-red-700">Failed</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-xl sm:text-2xl font-bold text-blue-600">{results.total}</p>
                          <p className="text-sm text-blue-700">Total Processed</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {results.errors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Errors:</h4>
                      <div className="space-y-2">
                        {results.errors.map((error: any, index: number) => (
                          <div key={index} className="bg-red-50 border border-red-200 rounded p-2 text-sm">
                            <span className="font-semibold">Row {error.row}:</span> {error.error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="export" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Products</CardTitle>
                <CardDescription>Download complete product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => downloadTemplate('products')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Customers</CardTitle>
                <CardDescription>Download customer database</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => downloadTemplate('customers')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Prices</CardTitle>
                <CardDescription>Download pricing information</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => downloadTemplate('prices')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="update">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Update Operations</CardTitle>
              <CardDescription>Apply changes to multiple items at once</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-center py-8">
                <Package className="h-16 w-16 mx-auto text-gray-400" />
                <p className="text-muted-foreground">Select items to update prices, categories, or other attributes</p>
                <Button onClick={() => router.push('/inventory/comprehensive')}>
                  Go to Inventory
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labels">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Label Generation</CardTitle>
              <CardDescription>Generate labels for multiple products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-center py-8">
                <Tag className="h-16 w-16 mx-auto text-gray-400" />
                <p className="text-muted-foreground">Generate and print labels for all products or selected items</p>
                <Button onClick={() => router.push('/inventory/barcode')}>
                  Open Label Generator
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
