'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Package,
  Truck,
  MapPin,
  Calendar,
  Clock,
  Globe,
  FileText,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Plane,
  Ship,
  Building,
  DollarSign
} from 'lucide-react'

interface ShipmentTracking {
  id: string
  location: string
  status: string
  description?: string
  eventDate: string
  latitude?: number
  longitude?: number
}

interface Shipment {
  id: string
  shipmentNo: string
  purchaseOrder?: {
    id: string
    poNumber: string
  }
  supplier: {
    id: string
    name: string
    country: string
  }
  carrier: 'ARAMEX' | 'DHL' | 'FEDEX' | 'UPS' | 'EMIRATES_POST' | 'ROAD_TRANSPORT' | 'SEA_FREIGHT' | 'AIR_FREIGHT' | 'OTHER'
  trackingNumber?: string
  awbNumber?: string
  status: 'PREPARING' | 'DISPATCHED' | 'IN_TRANSIT' | 'CUSTOMS_CLEARANCE' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'DELAYED' | 'CANCELLED' | 'RETURNED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  originAddress: string
  originCity: string
  originCountry: string
  destinationAddress: string
  destinationCity: string
  destinationCountry: string
  shipDate?: string
  estimatedArrival?: string
  actualArrival?: string
  packages: number
  totalWeight?: number
  totalVolume?: number
  dimensions?: string
  shippingCost: number
  insurance: number
  customsDuty: number
  otherCharges: number
  totalCost: number
  currency: string
  hsCode?: string
  customsDeclaration?: string
  commercialInvoice?: string
  packingList?: string
  certificateOrigin?: string
  importLicense?: string
  notes?: string
  trackingEvents: ShipmentTracking[]
}

const mockShipments: Shipment[] = [
  {
    id: '1',
    shipmentNo: 'SH-2024-001',
    purchaseOrder: {
      id: '1',
      poNumber: 'PO-2024-001'
    },
    supplier: {
      id: '1',
      name: 'Al Haramain Perfumes',
      country: 'UAE'
    },
    carrier: 'ARAMEX',
    trackingNumber: 'ARX123456789AE',
    status: 'DELIVERED',
    priority: 'HIGH',
    originAddress: 'Al Ras Area, Deira',
    originCity: 'Dubai',
    originCountry: 'UAE',
    destinationAddress: 'Sheikh Zayed Road',
    destinationCity: 'Dubai',
    destinationCountry: 'UAE',
    shipDate: '2024-03-16',
    estimatedArrival: '2024-03-18',
    actualArrival: '2024-03-17',
    packages: 3,
    totalWeight: 25.5,
    totalVolume: 0.85,
    dimensions: '80x60x40 cm',
    shippingCost: 250,
    insurance: 150,
    customsDuty: 0,
    otherCharges: 50,
    totalCost: 450,
    currency: 'AED',
    hsCode: '3303.00.90',
    notes: 'Fragile - Handle with care',
    trackingEvents: [
      {
        id: '1',
        location: 'Dubai, UAE',
        status: 'DELIVERED',
        description: 'Package delivered successfully',
        eventDate: '2024-03-17T14:30:00Z'
      },
      {
        id: '2',
        location: 'Dubai, UAE',
        status: 'OUT_FOR_DELIVERY',
        description: 'Out for delivery',
        eventDate: '2024-03-17T08:00:00Z'
      },
      {
        id: '3',
        location: 'Dubai, UAE',
        status: 'IN_TRANSIT',
        description: 'In transit to destination',
        eventDate: '2024-03-16T20:00:00Z'
      },
      {
        id: '4',
        location: 'Dubai, UAE',
        status: 'DISPATCHED',
        description: 'Package dispatched from origin',
        eventDate: '2024-03-16T10:00:00Z'
      }
    ]
  },
  {
    id: '2',
    shipmentNo: 'SH-2024-002',
    purchaseOrder: {
      id: '3',
      poNumber: 'PO-2024-003'
    },
    supplier: {
      id: '3',
      name: 'Cambodian Oud Traders',
      country: 'Cambodia'
    },
    carrier: 'DHL',
    trackingNumber: 'DHL987654321KH',
    awbNumber: 'AWB-KH-001234',
    status: 'CUSTOMS_CLEARANCE',
    priority: 'URGENT',
    originAddress: 'Phnom Penh Port',
    originCity: 'Phnom Penh',
    originCountry: 'Cambodia',
    destinationAddress: 'Al Qusais Industrial Area',
    destinationCity: 'Dubai',
    destinationCountry: 'UAE',
    shipDate: '2024-03-20',
    estimatedArrival: '2024-03-25',
    packages: 5,
    totalWeight: 45.2,
    totalVolume: 1.25,
    dimensions: '100x80x50 cm',
    shippingCost: 1200,
    insurance: 500,
    customsDuty: 750,
    otherCharges: 200,
    totalCost: 2650,
    currency: 'AED',
    hsCode: '1401.90.00',
    customsDeclaration: 'DECL-KH-2024-001',
    commercialInvoice: 'INV-KH-2024-001',
    packingList: 'PL-KH-2024-001',
    certificateOrigin: 'CO-KH-2024-001',
    importLicense: 'IL-UAE-2024-001',
    notes: 'Wild oud - requires CITES permit and special handling',
    trackingEvents: [
      {
        id: '1',
        location: 'Dubai, UAE',
        status: 'CUSTOMS_CLEARANCE',
        description: 'Customs clearance in progress',
        eventDate: '2024-03-23T09:00:00Z'
      },
      {
        id: '2',
        location: 'Dubai, UAE',
        status: 'IN_TRANSIT',
        description: 'Arrived at destination country',
        eventDate: '2024-03-22T18:30:00Z'
      },
      {
        id: '3',
        location: 'Singapore',
        status: 'IN_TRANSIT',
        description: 'In transit via Singapore hub',
        eventDate: '2024-03-21T14:00:00Z'
      },
      {
        id: '4',
        location: 'Phnom Penh, Cambodia',
        status: 'DISPATCHED',
        description: 'Package dispatched from origin',
        eventDate: '2024-03-20T16:00:00Z'
      }
    ]
  },
  {
    id: '3',
    shipmentNo: 'SH-2024-003',
    supplier: {
      id: '2',
      name: 'Mysore Sandalwood Co.',
      country: 'India'
    },
    carrier: 'SEA_FREIGHT',
    trackingNumber: 'MSC-INDIA-001',
    status: 'IN_TRANSIT',
    priority: 'MEDIUM',
    originAddress: 'Mysore Industrial Area',
    originCity: 'Mysore',
    originCountry: 'India',
    destinationAddress: 'Jebel Ali Port',
    destinationCity: 'Dubai',
    destinationCountry: 'UAE',
    shipDate: '2024-03-18',
    estimatedArrival: '2024-03-28',
    packages: 10,
    totalWeight: 125.5,
    totalVolume: 3.25,
    dimensions: '120x100x80 cm',
    shippingCost: 800,
    insurance: 300,
    customsDuty: 400,
    otherCharges: 150,
    totalCost: 1650,
    currency: 'AED',
    hsCode: '4401.22.00',
    notes: 'Bulk sandalwood shipment - sea freight',
    trackingEvents: [
      {
        id: '1',
        location: 'Arabian Sea',
        status: 'IN_TRANSIT',
        description: 'Vessel en route to destination',
        eventDate: '2024-03-22T12:00:00Z'
      },
      {
        id: '2',
        location: 'Mumbai Port, India',
        status: 'IN_TRANSIT',
        description: 'Departed from Mumbai Port',
        eventDate: '2024-03-19T08:00:00Z'
      },
      {
        id: '3',
        location: 'Mumbai Port, India',
        status: 'DISPATCHED',
        description: 'Loaded on vessel',
        eventDate: '2024-03-18T14:00:00Z'
      }
    ]
  }
]

const ShipmentTrackingComponent: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [filterCarrier, setFilterCarrier] = useState<string>('ALL')
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch =
      shipment.shipmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.purchaseOrder?.poNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'ALL' || shipment.status === filterStatus
    const matchesCarrier = filterCarrier === 'ALL' || shipment.carrier === filterCarrier

    return matchesSearch && matchesStatus && matchesCarrier
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PREPARING': return 'bg-gray-100 text-gray-800'
      case 'DISPATCHED': return 'bg-blue-100 text-blue-800'
      case 'IN_TRANSIT': return 'bg-purple-100 text-purple-800'
      case 'CUSTOMS_CLEARANCE': return 'bg-yellow-100 text-yellow-800'
      case 'OUT_FOR_DELIVERY': return 'bg-orange-100 text-orange-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'DELAYED': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'RETURNED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'URGENT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCarrierIcon = (carrier: string) => {
    switch (carrier) {
      case 'AIR_FREIGHT':
      case 'DHL':
      case 'FEDEX':
      case 'UPS':
      case 'ARAMEX':
      case 'EMIRATES_POST':
        return <Plane className="h-4 w-4" />
      case 'SEA_FREIGHT':
        return <Ship className="h-4 w-4" />
      case 'ROAD_TRANSPORT':
        return <Truck className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const statusCounts = {
    all: shipments.length,
    inTransit: shipments.filter(s => ['DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(s.status)).length,
    customs: shipments.filter(s => s.status === 'CUSTOMS_CLEARANCE').length,
    delivered: shipments.filter(s => s.status === 'DELIVERED').length,
    delayed: shipments.filter(s => s.status === 'DELAYED').length,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const ShipmentCard: React.FC<{ shipment: Shipment }> = ({ shipment }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{shipment.shipmentNo}</h3>
              <Badge className={getStatusColor(shipment.status)}>
                {shipment.status.replace('_', ' ')}
              </Badge>
              <Badge className={getPriorityColor(shipment.priority)}>
                {shipment.priority}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {getCarrierIcon(shipment.carrier)}
                {shipment.carrier.replace('_', ' ')}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {shipment.supplier.name}
                </div>
                {shipment.purchaseOrder && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {shipment.purchaseOrder.poNumber}
                  </div>
                )}
                {shipment.trackingNumber && (
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    {shipment.trackingNumber}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {shipment.originCity}, {shipment.originCountry} → {shipment.destinationCity}, {shipment.destinationCountry}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {shipment.shipDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Shipped: {formatDate(shipment.shipDate)}
                  </div>
                )}
                {shipment.estimatedArrival && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    ETA: {formatDate(shipment.estimatedArrival)}
                  </div>
                )}
                {shipment.actualArrival && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Delivered: {formatDate(shipment.actualArrival)}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {shipment.packages} package{shipment.packages !== 1 ? 's' : ''}
            </div>
            {shipment.totalWeight && (
              <div className="text-sm text-gray-600">
                {shipment.totalWeight} kg
              </div>
            )}
            <div className="text-sm font-medium text-blue-600">
              {shipment.currency} {shipment.totalCost.toLocaleString()}
            </div>
          </div>
        </div>

        {shipment.notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">{shipment.notes}</p>
          </div>
        )}

        {/* Latest Tracking Event */}
        {shipment.trackingEvents.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Latest Update:</span>
              <span>{shipment.trackingEvents[0].description}</span>
              <span className="text-gray-500">
                • {formatDateTime(shipment.trackingEvents[0].eventDate)}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex gap-2 text-xs text-gray-500">
            {shipment.hsCode && <span>HS Code: {shipment.hsCode}</span>}
            {shipment.customsDeclaration && <span>• Customs: {shipment.customsDeclaration}</span>}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedShipment(shipment)}>
              <Eye className="h-4 w-4 mr-1" />
              Track
            </Button>
            {shipment.status !== 'DELIVERED' && (
              <Button size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Documents
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shipment Tracking</h1>
          <p className="text-gray-600">Track shipments from suppliers to stores with real-time updates</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.inTransit}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Customs</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.customs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.delivered}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delayed</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.delayed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by shipment number, tracking number, or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="PREPARING">Preparing</option>
                <option value="DISPATCHED">Dispatched</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="CUSTOMS_CLEARANCE">Customs Clearance</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="DELAYED">Delayed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filterCarrier}
                onChange={(e) => setFilterCarrier(e.target.value)}
              >
                <option value="ALL">All Carriers</option>
                <option value="ARAMEX">Aramex</option>
                <option value="DHL">DHL</option>
                <option value="FEDEX">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="EMIRATES_POST">Emirates Post</option>
                <option value="ROAD_TRANSPORT">Road Transport</option>
                <option value="SEA_FREIGHT">Sea Freight</option>
                <option value="AIR_FREIGHT">Air Freight</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipments List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Shipments ({filteredShipments.length})
          </h2>
        </div>
        <div className="space-y-4">
          {filteredShipments.map(shipment => (
            <ShipmentCard key={shipment.id} shipment={shipment} />
          ))}
        </div>
      </div>

      {filteredShipments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Detailed Tracking Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Shipment Details - {selectedShipment.shipmentNo}</span>
                <Button variant="outline" onClick={() => setSelectedShipment(null)}>
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tracking Timeline */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Tracking Timeline</h3>
                <div className="space-y-4">
                  {selectedShipment.trackingEvents.map((event, index) => (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className={`w-4 h-4 rounded-full mt-1 ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{event.status.replace('_', ' ')}</p>
                            <p className="text-sm text-gray-600">{event.location}</p>
                            {event.description && (
                              <p className="text-sm text-gray-700">{event.description}</p>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDateTime(event.eventDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Shipment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carrier:</span>
                      <span>{selectedShipment.carrier.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number:</span>
                      <span>{selectedShipment.trackingNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Packages:</span>
                      <span>{selectedShipment.packages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span>{selectedShipment.totalWeight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimensions:</span>
                      <span>{selectedShipment.dimensions}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cost Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span>{selectedShipment.currency} {selectedShipment.shippingCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance:</span>
                      <span>{selectedShipment.currency} {selectedShipment.insurance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customs Duty:</span>
                      <span>{selectedShipment.currency} {selectedShipment.customsDuty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other Charges:</span>
                      <span>{selectedShipment.currency} {selectedShipment.otherCharges}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span>{selectedShipment.currency} {selectedShipment.totalCost}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {(selectedShipment.commercialInvoice || selectedShipment.packingList || selectedShipment.certificateOrigin) && (
                <div>
                  <h4 className="font-semibold mb-2">Documents</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedShipment.commercialInvoice && (
                      <Badge variant="outline">Commercial Invoice</Badge>
                    )}
                    {selectedShipment.packingList && (
                      <Badge variant="outline">Packing List</Badge>
                    )}
                    {selectedShipment.certificateOrigin && (
                      <Badge variant="outline">Certificate of Origin</Badge>
                    )}
                    {selectedShipment.importLicense && (
                      <Badge variant="outline">Import License</Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ShipmentTrackingComponent