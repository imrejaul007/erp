'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Alert,
  AlertDescription
} from '@/components/ui/alert';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  Upload,
  Eye,
  Calendar,
  Users,
  Building,
  Phone,
  Mail,
  Globe,
  Award,
  Bookmark,
  Star,
  Info,
  ExternalLink
} from 'lucide-react';
import {
  ProductionBatch,
  Recipe,
  Material,
  QualityControl
} from '@/types/production';
import { format, addMonths, addDays, isBefore, isAfter } from 'date-fns';

interface ComplianceStandard {
  id: string;
  name: string;
  authority: string;
  type: 'mandatory' | 'optional' | 'recommended';
  category: 'safety' | 'quality' | 'labeling' | 'environmental' | 'documentation';
  description: string;
  requirements: string[];
  validityPeriod?: number; // in months
  renewalRequired: boolean;
  lastUpdated: Date;
  nextReview?: Date;
  status: 'active' | 'pending' | 'expired' | 'under_review';
}

interface ComplianceCertificate {
  id: string;
  standardId: string;
  certificateNumber: string;
  issuedBy: string;
  issuedDate: Date;
  expiryDate: Date;
  status: 'valid' | 'expired' | 'pending_renewal' | 'suspended';
  documentUrl?: string;
  batchIds?: string[];
  notes?: string;
}

interface ComplianceCheck {
  id: string;
  batchId: string;
  standardId: string;
  status: 'compliant' | 'non_compliant' | 'pending' | 'under_review';
  checkDate: Date;
  checkedBy: string;
  findings: ComplianceFinding[];
  correctiveActions?: CorrectiveAction[];
  nextCheckDue?: Date;
}

interface ComplianceFinding {
  id: string;
  type: 'violation' | 'observation' | 'recommendation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  requirement: string;
  evidence?: string;
  deadline?: Date;
}

interface CorrectiveAction {
  id: string;
  findingId: string;
  action: string;
  assignedTo: string;
  dueDate: Date;
  status: 'open' | 'in_progress' | 'completed' | 'overdue';
  completedDate?: Date;
  notes?: string;
}

interface UAEComplianceProps {
  batches: ProductionBatch[];
  recipes: Recipe[];
  materials: Material[];
  qualityControls: QualityControl[];
  onGenerateReport: (standardId: string, batchIds: string[]) => void;
  onSubmitCertificate: (certificate: Partial<ComplianceCertificate>) => void;
  onCreateCorrectiveAction: (action: Partial<CorrectiveAction>) => void;
}

const UAECompliance: React.FC<UAEComplianceProps> = ({
  batches,
  recipes,
  materials,
  qualityControls,
  onGenerateReport,
  onSubmitCertificate,
  onCreateCorrectiveAction
}) => {
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [complianceFilter, setComplianceFilter] = useState<'all' | 'compliant' | 'non_compliant' | 'pending'>('all');

  // UAE Compliance Standards for Perfume Industry
  const complianceStandards: ComplianceStandard[] = [
    {
      id: 'uae-esma-001',
      name: 'ESMA Cosmetic Products Regulation',
      authority: 'Emirates Authority for Standardization and Metrology (ESMA)',
      type: 'mandatory',
      category: 'safety',
      description: 'Safety requirements for cosmetic products including perfumes and fragrances',
      requirements: [
        'Product safety assessment by qualified person',
        'Cosmetic product notification to ESMA',
        'Compliance with ingredient restrictions',
        'Microbiological testing',
        'Heavy metals testing',
        'Allergen declaration',
        'Safety information file maintenance'
      ],
      validityPeriod: 12,
      renewalRequired: true,
      lastUpdated: new Date('2023-01-15'),
      nextReview: new Date('2024-01-15'),
      status: 'active'
    },
    {
      id: 'uae-moccae-001',
      name: 'Ministry of Climate Change Product Approval',
      authority: 'Ministry of Climate Change and Environment (MOCCAE)',
      type: 'mandatory',
      category: 'environmental',
      description: 'Environmental compliance for perfume manufacturing and distribution',
      requirements: [
        'Environmental impact assessment',
        'Waste management plan',
        'Chemical inventory declaration',
        'VOC emissions compliance',
        'Packaging material approval',
        'Disposal guidelines compliance'
      ],
      validityPeriod: 24,
      renewalRequired: true,
      lastUpdated: new Date('2023-03-01'),
      nextReview: new Date('2025-03-01'),
      status: 'active'
    },
    {
      id: 'uae-moh-001',
      name: 'Ministry of Health Approval',
      authority: 'Ministry of Health and Prevention',
      type: 'mandatory',
      category: 'safety',
      description: 'Health and safety approval for cosmetic products',
      requirements: [
        'Product registration with MoH',
        'Clinical safety data',
        'Ingredient safety documentation',
        'Manufacturing facility inspection',
        'Quality management system certification',
        'Adverse event reporting system'
      ],
      validityPeriod: 36,
      renewalRequired: true,
      lastUpdated: new Date('2023-02-01'),
      nextReview: new Date('2026-02-01'),
      status: 'active'
    },
    {
      id: 'uae-quality-001',
      name: 'UAE Quality Mark',
      authority: 'Emirates Authority for Standardization and Metrology (ESMA)',
      type: 'optional',
      category: 'quality',
      description: 'Voluntary quality certification for premium products',
      requirements: [
        'ISO 9001 compliance',
        'Product testing to international standards',
        'Supply chain traceability',
        'Customer satisfaction surveys',
        'Continuous improvement documentation'
      ],
      validityPeriod: 24,
      renewalRequired: true,
      lastUpdated: new Date('2023-06-01'),
      nextReview: new Date('2025-06-01'),
      status: 'active'
    },
    {
      id: 'uae-halal-001',
      name: 'UAE Halal Certification',
      authority: 'Emirates Authority for Standardization and Metrology (ESMA)',
      type: 'optional',
      category: 'quality',
      description: 'Halal compliance for products targeting Muslim consumers',
      requirements: [
        'Halal ingredient verification',
        'Halal manufacturing process audit',
        'Supply chain Halal compliance',
        'Segregation of Halal and non-Halal products',
        'Halal certification of suppliers',
        'Regular audit and monitoring'
      ],
      validityPeriod: 12,
      renewalRequired: true,
      lastUpdated: new Date('2023-04-01'),
      nextReview: new Date('2024-04-01'),
      status: 'active'
    },
    {
      id: 'gcc-001',
      name: 'GCC Standardization Organization',
      authority: 'GCC Standardization Organization (GSO)',
      type: 'recommended',
      category: 'quality',
      description: 'Regional standards for cosmetic products in GCC countries',
      requirements: [
        'GCC marking compliance',
        'Regional ingredient standards',
        'Multilingual labeling',
        'Regional testing requirements',
        'Cross-border trade documentation'
      ],
      validityPeriod: 24,
      renewalRequired: true,
      lastUpdated: new Date('2023-05-01'),
      nextReview: new Date('2025-05-01'),
      status: 'active'
    }
  ];

  // Mock compliance certificates
  const [certificates, setCertificates] = useState<ComplianceCertificate[]>([
    {
      id: 'cert-001',
      standardId: 'uae-esma-001',
      certificateNumber: 'ESMA/COS/2023/001234',
      issuedBy: 'ESMA',
      issuedDate: new Date('2023-06-01'),
      expiryDate: new Date('2024-06-01'),
      status: 'valid',
      documentUrl: '/certificates/esma-001.pdf',
      batchIds: [batches[0]?.id].filter(Boolean),
      notes: 'Initial certification for perfume product line'
    },
    {
      id: 'cert-002',
      standardId: 'uae-moh-001',
      certificateNumber: 'MOH/REG/2023/005678',
      issuedBy: 'Ministry of Health',
      issuedDate: new Date('2023-01-15'),
      expiryDate: new Date('2024-01-15'),
      status: 'pending_renewal',
      documentUrl: '/certificates/moh-001.pdf',
      notes: 'Renewal application submitted'
    }
  ]);

  // Mock compliance checks
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([
    {
      id: 'check-001',
      batchId: batches[0]?.id || '',
      standardId: 'uae-esma-001',
      status: 'compliant',
      checkDate: new Date(),
      checkedBy: 'Quality Manager',
      findings: [],
      nextCheckDue: addMonths(new Date(), 3)
    }
  ]);

  // Calculate compliance statistics
  const complianceStats = useMemo(() => {
    const totalStandards = complianceStandards.filter(s => s.type === 'mandatory').length;
    const validCertificates = certificates.filter(c => c.status === 'valid').length;
    const expiringCertificates = certificates.filter(c => {
      const daysToExpiry = Math.ceil((c.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysToExpiry <= 30 && daysToExpiry > 0;
    }).length;
    const expiredCertificates = certificates.filter(c => c.status === 'expired' || isBefore(c.expiryDate, new Date())).length;

    const batchChecks = batches.map(batch => {
      const checks = complianceChecks.filter(check => check.batchId === batch.id);
      const compliantChecks = checks.filter(check => check.status === 'compliant').length;
      const totalChecks = checks.length;
      return totalChecks > 0 ? compliantChecks / totalChecks : 0;
    });

    const overallCompliance = batchChecks.length > 0
      ? (batchChecks.reduce((sum, rate) => sum + rate, 0) / batchChecks.length) * 100
      : 0;

    return {
      totalStandards,
      validCertificates,
      expiringCertificates,
      expiredCertificates,
      overallCompliance
    };
  }, [complianceStandards, certificates, complianceChecks, batches]);

  // Filter compliance checks
  const filteredChecks = complianceChecks.filter(check => {
    if (complianceFilter === 'all') return true;
    return check.status === complianceFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'non_compliant':
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'pending_renewal':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const generateComplianceReport = () => {
    if (!selectedStandard || selectedBatches.length === 0) return;

    onGenerateReport(selectedStandard.id, selectedBatches);
    setIsReportDialogOpen(false);
    setSelectedBatches([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">UAE Compliance Management</h2>
          <p className="text-gray-600">Ensure compliance with UAE regulations for perfume production</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Compliance Report</DialogTitle>
              </DialogHeader>
              <ComplianceReportForm
                standards={complianceStandards}
                batches={batches}
                selectedStandard={selectedStandard}
                setSelectedStandard={setSelectedStandard}
                selectedBatches={selectedBatches}
                setSelectedBatches={setSelectedBatches}
                onGenerate={generateComplianceReport}
                onCancel={() => setIsReportDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Button>
            <Shield className="w-4 h-4 mr-2" />
            Compliance Audit
          </Button>
        </div>
      </div>

      {/* Compliance Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Compliance</p>
                <p className="text-2xl font-bold text-green-600">
                  {complianceStats.overallCompliance.toFixed(1)}%
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valid Certificates</p>
                <p className="text-2xl font-bold text-blue-600">{complianceStats.validCertificates}</p>
              </div>
              <Award className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">{complianceStats.expiringCertificates}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-red-600">{complianceStats.expiredCertificates}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Standards</p>
                <p className="text-2xl font-bold">{complianceStats.totalStandards}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Certificates Alert */}
      {complianceStats.expiringCertificates > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <p className="font-medium text-yellow-800">
              {complianceStats.expiringCertificates} certificate(s) expiring within 30 days
            </p>
            <p className="text-yellow-700">
              Please initiate renewal process to maintain compliance status.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Compliance Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="standards" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="standards">Standards</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="checks">Compliance Checks</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
            </TabsList>

            <TabsContent value="standards" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complianceStandards.map(standard => (
                  <Card key={standard.id} className={`border-l-4 ${
                    standard.type === 'mandatory' ? 'border-l-red-500' :
                    standard.type === 'optional' ? 'border-l-blue-500' : 'border-l-green-500'
                  }`}>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{standard.name}</h3>
                            <p className="text-sm text-gray-600">{standard.authority}</p>
                          </div>
                          <div className="flex gap-1">
                            <Badge variant={
                              standard.type === 'mandatory' ? 'destructive' :
                              standard.type === 'optional' ? 'default' : 'secondary'
                            }>
                              {standard.type}
                            </Badge>
                            <Badge variant="outline">{standard.category}</Badge>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700">{standard.description}</p>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Key Requirements:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {standard.requirements.slice(0, 3).map((req, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {req}
                              </li>
                            ))}
                            {standard.requirements.length > 3 && (
                              <li className="text-blue-600">
                                +{standard.requirements.length - 3} more requirements
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <span>
                            Valid: {standard.validityPeriod} months
                          </span>
                          <span>
                            Next Review: {standard.nextReview ? format(standard.nextReview, 'MMM yyyy') : 'TBD'}
                          </span>
                        </div>

                        <Button size="sm" variant="outline" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-4">
              <div className="space-y-4">
                {certificates.map(certificate => {
                  const standard = complianceStandards.find(s => s.id === certificate.standardId);
                  const daysToExpiry = Math.ceil((certificate.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <Card key={certificate.id}>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{standard?.name}</h3>
                              <p className="text-sm text-gray-600">
                                Certificate: {certificate.certificateNumber}
                              </p>
                              <p className="text-sm text-gray-600">
                                Issued by: {certificate.issuedBy}
                              </p>
                            </div>
                            <Badge className={getStatusColor(certificate.status)}>
                              {certificate.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Issued Date</p>
                              <p className="font-medium">
                                {format(certificate.issuedDate, 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Expiry Date</p>
                              <p className="font-medium">
                                {format(certificate.expiryDate, 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Days Remaining</p>
                              <p className={`font-medium ${
                                daysToExpiry < 0 ? 'text-red-600' :
                                daysToExpiry <= 30 ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {daysToExpiry < 0 ? 'Expired' : `${daysToExpiry} days`}
                              </p>
                            </div>
                          </div>

                          {certificate.notes && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-700">{certificate.notes}</p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            {certificate.documentUrl && (
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            )}
                            {daysToExpiry <= 30 && (
                              <Button size="sm">
                                <Clock className="w-4 h-4 mr-2" />
                                Renew Certificate
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="checks" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Compliance Checks</h3>
                <Select value={complianceFilter} onValueChange={(value: any) => setComplianceFilter(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Checks</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch</TableHead>
                    <TableHead>Standard</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check Date</TableHead>
                    <TableHead>Checked By</TableHead>
                    <TableHead>Next Check</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChecks.map(check => {
                    const batch = batches.find(b => b.id === check.batchId);
                    const standard = complianceStandards.find(s => s.id === check.standardId);

                    return (
                      <TableRow key={check.id}>
                        <TableCell className="font-medium">
                          {batch?.batchNumber || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{standard?.name}</p>
                            <p className="text-xs text-gray-600">{standard?.authority}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(check.status)}>
                            {check.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(check.checkDate, 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>{check.checkedBy}</TableCell>
                        <TableCell>
                          {check.nextCheckDue ? format(check.nextCheckDue, 'MMM dd, yyyy') : 'TBD'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="documentation" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Safety Data Sheets', count: 25, type: 'PDF', lastUpdated: '2 days ago' },
                  { name: 'Ingredient Specifications', count: 48, type: 'PDF', lastUpdated: '1 week ago' },
                  { name: 'Quality Certificates', count: 12, type: 'PDF', lastUpdated: '3 days ago' },
                  { name: 'Manufacturing Records', count: 156, type: 'PDF', lastUpdated: 'Today' },
                  { name: 'Audit Reports', count: 8, type: 'PDF', lastUpdated: '2 weeks ago' },
                  { name: 'Regulatory Submissions', count: 6, type: 'PDF', lastUpdated: '1 month ago' }
                ].map((doc, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{doc.name}</h4>
                            <p className="text-sm text-gray-600">{doc.count} documents</p>
                          </div>
                          <Badge variant="outline">{doc.type}</Badge>
                        </div>

                        <p className="text-xs text-gray-600">
                          Last updated: {doc.lastUpdated}
                        </p>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Regulatory Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Regulatory Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'Emirates Authority for Standardization and Metrology',
                acronym: 'ESMA',
                phone: '+971 4 206 2200',
                email: 'info@esma.gov.ae',
                website: 'www.esma.gov.ae',
                department: 'Cosmetics Registration Department'
              },
              {
                name: 'Ministry of Health and Prevention',
                acronym: 'MoHAP',
                phone: '+971 4 404 2222',
                email: 'customerservice@mohap.gov.ae',
                website: 'www.mohap.gov.ae',
                department: 'Product Registration Division'
              },
              {
                name: 'Ministry of Climate Change and Environment',
                acronym: 'MOCCAE',
                phone: '+971 4 206 5222',
                email: 'info@moccae.gov.ae',
                website: 'www.moccae.gov.ae',
                department: 'Chemical Substances Department'
              }
            ].map((contact, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">{contact.acronym}</h4>
                      <p className="text-sm text-gray-600">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.department}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="text-blue-600">{contact.website}</span>
                      </div>
                    </div>

                    <Button size="sm" variant="outline" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Compliance Report Form Component
interface ComplianceReportFormProps {
  standards: ComplianceStandard[];
  batches: ProductionBatch[];
  selectedStandard: ComplianceStandard | null;
  setSelectedStandard: (standard: ComplianceStandard | null) => void;
  selectedBatches: string[];
  setSelectedBatches: (batches: string[]) => void;
  onGenerate: () => void;
  onCancel: () => void;
}

const ComplianceReportForm: React.FC<ComplianceReportFormProps> = ({
  standards,
  batches,
  selectedStandard,
  setSelectedStandard,
  selectedBatches,
  setSelectedBatches,
  onGenerate,
  onCancel
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Select Standard</Label>
        <Select
          value={selectedStandard?.id || ''}
          onValueChange={(value) => {
            const standard = standards.find(s => s.id === value);
            setSelectedStandard(standard || null);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose compliance standard" />
          </SelectTrigger>
          <SelectContent>
            {standards.map(standard => (
              <SelectItem key={standard.id} value={standard.id}>
                {standard.name} ({standard.authority})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedStandard && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">{selectedStandard.description}</p>
        </div>
      )}

      <div>
        <Label>Select Batches</Label>
        <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-3">
          {batches.map(batch => (
            <label key={batch.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedBatches.includes(batch.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBatches([...selectedBatches, batch.id]);
                  } else {
                    setSelectedBatches(selectedBatches.filter(id => id !== batch.id));
                  }
                }}
              />
              <span className="text-sm">
                {batch.batchNumber} - {batch.recipe?.name || 'Custom'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onGenerate} disabled={!selectedStandard || selectedBatches.length === 0}>
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>
    </div>
  );
};

export default UAECompliance;