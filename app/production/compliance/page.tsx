'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
  Search,
  RefreshCw,
  Award,
  Globe,
  BookOpen,
  AlertCircle
} from 'lucide-react';

interface ComplianceItem {
  id: string;
  category: 'cites' | 'fda' | 'ifra' | 'vat' | 'customs' | 'labeling' | 'halal';
  productName: string;
  regulation: string;
  status: 'compliant' | 'non_compliant' | 'pending' | 'expiring_soon';
  lastChecked: string;
  expiryDate?: string;
  certificationNumber?: string;
  issues?: string[];
  actions?: string[];
}

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
  documentUrl: string;
}

export default function CompliancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock compliance data
  const complianceItems: ComplianceItem[] = [
    {
      id: 'COMP-001',
      category: 'cites',
      productName: 'Royal Cambodian Oud Oil',
      regulation: 'CITES Appendix II - Agarwood',
      status: 'compliant',
      lastChecked: '2025-09-28',
      certificationNumber: 'CITES-AE-2025-001234',
      expiryDate: '2026-09-28'
    },
    {
      id: 'COMP-002',
      category: 'ifra',
      productName: 'Jasmine Essential Oil',
      regulation: 'IFRA 50th Amendment Standards',
      status: 'compliant',
      lastChecked: '2025-09-25',
      certificationNumber: 'IFRA-50-2025-5678'
    },
    {
      id: 'COMP-003',
      category: 'cites',
      productName: 'Hindi Black Oud',
      regulation: 'CITES Appendix II - Agarwood',
      status: 'expiring_soon',
      lastChecked: '2025-09-20',
      certificationNumber: 'CITES-AE-2024-009876',
      expiryDate: '2025-10-15',
      actions: ['Renew CITES permit before expiry', 'Update documentation']
    },
    {
      id: 'COMP-004',
      category: 'fda',
      productName: 'Taif Rose Attar',
      regulation: 'FDA Cosmetic Regulation - 21 CFR',
      status: 'non_compliant',
      lastChecked: '2025-09-30',
      issues: [
        'Missing allergen declaration on label',
        'Batch number format non-compliant',
        'Ingredient list not in descending order'
      ],
      actions: [
        'Update product labels immediately',
        'Reformulate batch numbering system',
        'Reorder ingredient list per FDA requirements'
      ]
    },
    {
      id: 'COMP-005',
      category: 'halal',
      productName: 'Amber Musk Blend',
      regulation: 'UAE Halal Certification',
      status: 'compliant',
      lastChecked: '2025-09-28',
      certificationNumber: 'HALAL-UAE-2025-4567',
      expiryDate: '2026-03-15'
    },
    {
      id: 'COMP-006',
      category: 'labeling',
      productName: 'Sandalwood Oil',
      regulation: 'UAE Labeling Requirements',
      status: 'pending',
      lastChecked: '2025-09-29',
      actions: ['Awaiting label review by regulatory body', 'Submit updated documentation']
    },
    {
      id: 'COMP-007',
      category: 'vat',
      productName: 'All Products',
      regulation: 'UAE VAT Compliance',
      status: 'compliant',
      lastChecked: '2025-10-01'
    },
    {
      id: 'COMP-008',
      category: 'customs',
      productName: 'Imported Raw Agarwood',
      regulation: 'UAE Customs Declaration',
      status: 'compliant',
      lastChecked: '2025-09-27',
      certificationNumber: 'CUSTOMS-2025-789456'
    }
  ];

  // Certificates
  const certificates: Certificate[] = [
    {
      id: 'CERT-001',
      name: 'CITES Export Permit',
      issuer: 'UAE Ministry of Environment',
      issueDate: '2024-09-28',
      expiryDate: '2026-09-28',
      status: 'valid',
      documentUrl: '/certificates/cites-001.pdf'
    },
    {
      id: 'CERT-002',
      name: 'IFRA Compliance Certificate',
      issuer: 'International Fragrance Association',
      issueDate: '2025-01-15',
      expiryDate: '2027-01-15',
      status: 'valid',
      documentUrl: '/certificates/ifra-002.pdf'
    },
    {
      id: 'CERT-003',
      name: 'Halal Certification',
      issuer: 'Emirates Authority for Standardization',
      issueDate: '2025-03-15',
      expiryDate: '2026-03-15',
      status: 'valid',
      documentUrl: '/certificates/halal-003.pdf'
    },
    {
      id: 'CERT-004',
      name: 'GCC Cosmetic Registration',
      issuer: 'GCC Standardization Organization',
      issueDate: '2024-06-01',
      expiryDate: '2025-11-30',
      status: 'expiring_soon',
      documentUrl: '/certificates/gcc-004.pdf'
    }
  ];

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.regulation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const complianceStats = {
    compliant: complianceItems.filter(i => i.status === 'compliant').length,
    nonCompliant: complianceItems.filter(i => i.status === 'non_compliant').length,
    pending: complianceItems.filter(i => i.status === 'pending').length,
    expiringSoon: complianceItems.filter(i => i.status === 'expiring_soon').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': case 'valid': return 'bg-green-100 text-green-700';
      case 'non_compliant': case 'expired': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'expiring_soon': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': case 'valid': return <CheckCircle className="h-4 w-4" />;
      case 'non_compliant': case 'expired': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'expiring_soon': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      cites: 'CITES',
      fda: 'FDA',
      ifra: 'IFRA',
      vat: 'VAT',
      customs: 'Customs',
      labeling: 'Labeling',
      halal: 'Halal'
    };
    return labels[category] || category;
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Regulatory Compliance Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Track and manage all regulatory requirements and certifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Run Compliance Check
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliant</p>
                <p className="text-2xl font-bold text-gray-900">{complianceStats.compliant}</p>
                <p className="text-xs text-green-600 mt-1">All requirements met</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Non-Compliant</p>
                <p className="text-2xl font-bold text-gray-900">{complianceStats.nonCompliant}</p>
                <p className="text-xs text-red-600 mt-1">Requires immediate action</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">{complianceStats.expiringSoon}</p>
                <p className="text-xs text-orange-600 mt-1">Within 30 days</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{complianceStats.pending}</p>
                <p className="text-xs text-yellow-600 mt-1">Awaiting verification</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by product or regulation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'cites', 'fda', 'ifra', 'halal', 'vat', 'customs', 'labeling'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {category === 'all' ? 'All Categories' : getCategoryLabel(category)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="compliance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="regulations">Regulations Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Compliance Overview
              </CardTitle>
              <CardDescription>Current compliance status for all products and regulations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="border-l-4" style={{
                    borderLeftColor: item.status === 'compliant' ? '#10b981' :
                                   item.status === 'non_compliant' ? '#ef4444' :
                                   item.status === 'expiring_soon' ? '#f97316' : '#eab308'
                  }}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                            <Badge variant="outline" className="text-xs">
                              {getCategoryLabel(item.category)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{item.regulation}</p>
                        </div>
                        <Badge className={`${getStatusColor(item.status)} flex items-center gap-1`}>
                          {getStatusIcon(item.status)}
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Last Checked:</span>
                          <p className="font-medium text-gray-900">{new Date(item.lastChecked).toLocaleDateString()}</p>
                        </div>
                        {item.certificationNumber && (
                          <div>
                            <span className="text-gray-600">Cert #:</span>
                            <p className="font-medium text-gray-900">{item.certificationNumber}</p>
                          </div>
                        )}
                        {item.expiryDate && (
                          <div>
                            <span className="text-gray-600">Expiry Date:</span>
                            <p className="font-medium text-gray-900">{new Date(item.expiryDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>

                      {item.issues && item.issues.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <h4 className="font-semibold text-red-900 text-sm mb-2 flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            Issues Found:
                          </h4>
                          <ul className="space-y-1">
                            {item.issues.map((issue, idx) => (
                              <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                                <span className="text-red-600 mt-0.5">•</span>
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.actions && item.actions.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h4 className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Required Actions:
                          </h4>
                          <ul className="space-y-1">
                            {item.actions.map((action, idx) => (
                              <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Certificates & Permits
              </CardTitle>
              <CardDescription>All active certifications and their validity periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <Card key={cert.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                          <p className="text-sm text-gray-600">{cert.issuer}</p>
                        </div>
                        <Badge className={getStatusColor(cert.status)}>
                          {cert.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Issue Date:</span>
                          <span className="font-medium text-gray-900">{new Date(cert.issueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expiry Date:</span>
                          <span className="font-medium text-gray-900">{new Date(cert.expiryDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Certificate ID:</span>
                          <span className="font-medium text-gray-900">{cert.id}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          View Document
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regulations" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-green-600" />
                  CITES Regulations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-gray-700">Convention on International Trade in Endangered Species</p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-1">Requirements:</h4>
                  <ul className="space-y-1 text-green-800">
                    <li>• Valid CITES permit for agarwood trading</li>
                    <li>• Proper documentation of source and origin</li>
                    <li>• Annual renewal required</li>
                    <li>• Compliance with Appendix II regulations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  IFRA Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-gray-700">International Fragrance Association Guidelines</p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-1">Requirements:</h4>
                  <ul className="space-y-1 text-blue-800">
                    <li>• Adherence to 50th Amendment standards</li>
                    <li>• Allergen testing and declaration</li>
                    <li>• Maximum concentration limits compliance</li>
                    <li>• Safety assessment documentation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                  FDA Cosmetic Regulations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-gray-700">21 CFR Parts 700-740 Compliance</p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-1">Requirements:</h4>
                  <ul className="space-y-1 text-purple-800">
                    <li>• Proper ingredient labeling</li>
                    <li>• Allergen warnings where applicable</li>
                    <li>• Manufacturing practice compliance</li>
                    <li>• Product safety substantiation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-amber-600" />
                  Halal Certification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-gray-700">UAE Halal Standards and Guidelines</p>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-1">Requirements:</h4>
                  <ul className="space-y-1 text-amber-800">
                    <li>• Halal-compliant ingredients only</li>
                    <li>• Certified manufacturing processes</li>
                    <li>• Regular audits and inspections</li>
                    <li>• Proper Halal labeling and certification marks</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
