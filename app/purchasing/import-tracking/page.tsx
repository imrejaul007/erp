'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Ship,
  Plane,
  Truck,
  Package,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Camera,
  Upload,
  Download,
  Phone,
  Mail,
  Globe,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Plus,
  Building,
  Anchor,
  Flag,
  Zap,
  Navigation,
  Compass,
  Radio,
  Users,
  Clipboard,
  CreditCard,
  DollarSign,
  Shield,
  Lock
} from 'lucide-react';
import { format } from 'date-fns';

const ImportTrackingPage = () => {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth');
  const [showShipmentDetails, setShowShipmentDetails] = useState(false);

  // Sample shipment data
  const shipments = [
    {
      id: 'SH-2024-001',
      poNumber: 'PO-2024-001',
      vendor: 'Al-Rashid Oud Suppliers',
      origin: 'Dubai, UAE',
      destination: 'Dubai Warehouse, UAE',
      method: 'truck',
      status: 'delivered',
      progress: 100,
      estimatedArrival: '2024-01-20',
      actualArrival: '2024-01-20',
      trackingNumber: 'DHL1234567890',
      carrier: 'DHL Express',
      value: 25600,
      currency: 'AED',
      weight: '45 kg',
      dimensions: '60x40x30 cm',
      documents: {
        invoice: true,
        packingList: true,
        certificateOfOrigin: true,
        customsDeclaration: true,
        insurance: true
      },
      timeline: [
        { date: '2024-01-15', status: 'Order Confirmed', completed: true },
        { date: '2024-01-16', status: 'Goods Prepared', completed: true },
        { date: '2024-01-17', status: 'Shipped', completed: true },
        { date: '2024-01-19', status: 'In Transit', completed: true },
        { date: '2024-01-20', status: 'Delivered', completed: true }
      ]
    },
    {
      id: 'SH-2024-002',
      poNumber: 'PO-2024-002',
      vendor: 'Taif Rose Company',
      origin: 'Taif, Saudi Arabia',
      destination: 'Dubai Warehouse, UAE',
      method: 'truck',
      status: 'customs_clearance',
      progress: 75,
      estimatedArrival: '2024-01-25',
      actualArrival: null,
      trackingNumber: 'AR9876543210',
      carrier: 'Aramex',
      value: 12450,
      currency: 'SAR',
      weight: '28 kg',
      dimensions: '50x35x25 cm',
      documents: {
        invoice: true,
        packingList: true,
        certificateOfOrigin: true,
        customsDeclaration: false,
        insurance: true
      },
      timeline: [
        { date: '2024-01-12', status: 'Order Confirmed', completed: true },
        { date: '2024-01-14', status: 'Goods Prepared', completed: true },
        { date: '2024-01-16', status: 'Shipped', completed: true },
        { date: '2024-01-22', status: 'At Customs', completed: true },
        { date: '2024-01-25', status: 'Delivered', completed: false }
      ]
    },
    {
      id: 'SH-2024-003',
      poNumber: 'PO-2024-003',
      vendor: 'Cambodian Oud Direct',
      origin: 'Phnom Penh, Cambodia',
      destination: 'Dubai Warehouse, UAE',
      method: 'air',
      status: 'in_transit',
      progress: 40,
      estimatedArrival: '2024-01-28',
      actualArrival: null,
      trackingNumber: 'EK7890123456',
      carrier: 'Emirates SkyCargo',
      value: 45000,
      currency: 'USD',
      weight: '15 kg',
      dimensions: '40x30x20 cm',
      documents: {
        invoice: true,
        packingList: true,
        certificateOfOrigin: true,
        customsDeclaration: true,
        insurance: true,
        citesPermit: true
      },
      timeline: [
        { date: '2024-01-10', status: 'Order Confirmed', completed: true },
        { date: '2024-01-20', status: 'Goods Prepared', completed: true },
        { date: '2024-01-24', status: 'Shipped', completed: true },
        { date: '2024-01-26', status: 'In Transit', completed: false },
        { date: '2024-01-28', status: 'Delivered', completed: false }
      ]
    },
    {
      id: 'SH-2024-004',
      poNumber: 'PO-2024-004',
      vendor: 'Mumbai Attar House',
      origin: 'Mumbai, India',
      destination: 'Dubai Warehouse, UAE',
      method: 'sea',
      status: 'shipped',
      progress: 25,
      estimatedArrival: '2024-02-15',
      actualArrival: null,
      trackingNumber: 'MSC4567890123',
      carrier: 'MSC Shipping',
      value: 18750,
      currency: 'USD',
      weight: '120 kg',
      dimensions: '80x60x40 cm',
      documents: {
        invoice: true,
        packingList: true,
        certificateOfOrigin: false,
        customsDeclaration: true,
        insurance: true,
        billOfLading: true
      },
      timeline: [
        { date: '2024-01-08', status: 'Order Confirmed', completed: true },
        { date: '2024-01-15', status: 'Goods Prepared', completed: true },
        { date: '2024-01-22', status: 'Shipped', completed: true },
        { date: '2024-02-10', status: 'Port Arrival', completed: false },
        { date: '2024-02-15', status: 'Delivered', completed: false }
      ]
    }
  ];

  // Custom clearance steps for UAE
  const customsSteps = [
    { name: 'Document Submission', completed: true },
    { name: 'Initial Review', completed: true },
    { name: 'Physical Inspection', completed: false },
    { name: 'Duty Assessment', completed: false },
    { name: 'Payment Processing', completed: false },
    { name: 'Clearance Approval', completed: false }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'customs_clearance': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'air': return <Plane className="h-4 w-4" />;
      case 'sea': return <Ship className="h-4 w-4" />;
      case 'truck': return <Truck className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getDocumentStatus = (hasDoc) => {
    return hasDoc ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import Tracking</h1>
          <p className="text-gray-600">Track international shipments and customs clearance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Shipment
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Shipments</p>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-blue-600">+2 from last week</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-green-600">On schedule</p>
              </div>
              <Navigation className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">At Customs</p>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-yellow-600">Awaiting clearance</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Transit Time</p>
                <p className="text-2xl font-bold">12 days</p>
                <p className="text-xs text-purple-600">-2 days improved</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipments List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Current Shipments</CardTitle>
                  <CardDescription>Track your international imports and customs status</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                      <SelectItem value="thisQuarter">This Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <Card
                    key={shipment.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setSelectedShipment(shipment);
                      setShowShipmentDetails(true);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getMethodIcon(shipment.method)}
                          </div>
                          <div>
                            <div className="font-medium">{shipment.id}</div>
                            <div className="text-sm text-gray-600">{shipment.poNumber}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(shipment.status)}
                          <Badge className={getStatusColor(shipment.status)}>
                            {shipment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm font-medium">{shipment.vendor}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {shipment.origin} → {shipment.destination}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{shipment.currency} {shipment.value?.toLocaleString() || "0"}</div>
                          <div className="text-sm text-gray-600">{shipment.carrier} • {shipment.weight}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{shipment.progress}%</span>
                        </div>
                        <Progress value={shipment.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>ETA: {shipment.estimatedArrival}</span>
                          <span>Tracking: {shipment.trackingNumber}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customs Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                UAE Customs Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customsSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <div className="w-2 h-2 bg-current rounded-full" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      step.completed ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                Dubai Customs Portal
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Building className="h-4 w-4 mr-2" />
                Emirates Post Tracking
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                HS Code Lookup
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Duty Calculator
              </Button>
            </CardContent>
          </Card>

          {/* Important Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="font-medium text-yellow-800 text-sm">Document Missing</div>
                <div className="text-yellow-700 text-xs">SH-2024-002 needs Certificate of Origin</div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-medium text-blue-800 text-sm">Customs Inspection</div>
                <div className="text-blue-700 text-xs">SH-2024-003 scheduled for inspection</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Shipment Details Dialog */}
      <Dialog open={showShipmentDetails} onOpenChange={setShowShipmentDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Shipment Details - {selectedShipment?.id}
            </DialogTitle>
            <DialogDescription>
              Complete tracking information and documentation status
            </DialogDescription>
          </DialogHeader>

          {selectedShipment && (
            <Tabs defaultValue="tracking" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="customs">Customs</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
              </TabsList>

              <TabsContent value="tracking" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Shipment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tracking Number:</span>
                        <span className="font-medium">{selectedShipment.trackingNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carrier:</span>
                        <span className="font-medium">{selectedShipment.carrier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <div className="flex items-center gap-1">
                          {getMethodIcon(selectedShipment.method)}
                          <span className="font-medium capitalize">{selectedShipment.method}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Value:</span>
                        <span className="font-medium">{selectedShipment.currency} {selectedShipment.value?.toLocaleString() || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{selectedShipment.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dimensions:</span>
                        <span className="font-medium">{selectedShipment.dimensions}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Route Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-gray-600 text-sm">Origin</div>
                        <div className="font-medium flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedShipment.origin}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-sm">Destination</div>
                        <div className="font-medium flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedShipment.destination}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-sm">Estimated Arrival</div>
                        <div className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {selectedShipment.estimatedArrival}
                        </div>
                      </div>
                      {selectedShipment.actualArrival && (
                        <div>
                          <div className="text-gray-600 text-sm">Actual Arrival</div>
                          <div className="font-medium flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            {selectedShipment.actualArrival}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tracking Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedShipment.timeline.map((event, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            event.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {event.completed ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Clock className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${
                              event.completed ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {event.status}
                            </div>
                            <div className="text-sm text-gray-600">{event.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Required Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getDocumentStatus(selectedShipment.documents.invoice)}
                          <span>Commercial Invoice</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getDocumentStatus(selectedShipment.documents.packingList)}
                          <span>Packing List</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getDocumentStatus(selectedShipment.documents.certificateOfOrigin)}
                          <span>Certificate of Origin</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getDocumentStatus(selectedShipment.documents.customsDeclaration)}
                          <span>Customs Declaration</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getDocumentStatus(selectedShipment.documents.insurance)}
                          <span>Insurance Certificate</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {selectedShipment.documents.citesPermit && (
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getDocumentStatus(selectedShipment.documents.citesPermit)}
                            <span>CITES Permit</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {selectedShipment.documents.billOfLading && (
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getDocumentStatus(selectedShipment.documents.billOfLading)}
                            <span>Bill of Lading</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="customs" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customs Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">HS Code:</span>
                        <span className="font-medium">3301.90</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duty Rate:</span>
                        <span className="font-medium">5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">VAT Rate:</span>
                        <span className="font-medium">5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customs Value:</span>
                        <span className="font-medium">AED {(selectedShipment.value * 3.67).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Duty:</span>
                        <span className="font-medium">AED {(selectedShipment.value * 3.67 * 0.05).toFixed(0)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Clearance Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {customsSteps.map((step, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                              {step.completed ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                            </div>
                            <span className={`text-sm ${
                              step.completed ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {step.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Special Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="font-medium text-blue-800">CITES Permit Required</div>
                        <div className="text-blue-700">Natural oud products require CITES documentation for legal import</div>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="font-medium text-yellow-800">Ingredient Declaration</div>
                        <div className="text-yellow-700">All perfume oils must declare ingredients for UAE health regulations</div>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="font-medium text-green-800">Halal Certification</div>
                        <div className="text-green-700">Products certified halal for UAE market compliance</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contacts" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Vendor Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span>{selectedShipment.vendor}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>export@vendor.com</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>+123-456-7890</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Vendor
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Customs Broker</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span>Dubai Customs Services</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>broker@dubaicustoms.ae</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>+971-4-123-4567</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Broker
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Carrier Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carrier:</span>
                      <span className="font-medium">{selectedShipment.carrier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking:</span>
                      <span className="font-medium">{selectedShipment.trackingNumber}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Globe className="h-4 w-4 mr-2" />
                        Track Online
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Carrier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportTrackingPage;