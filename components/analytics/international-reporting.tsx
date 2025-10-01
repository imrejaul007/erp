'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  Languages,
  Shield,
  Archive,
  Share2,
  Mail,
  Printer,
  Eye,
  Lock,
  Users,
  Building,
  MapPin,
  Flag,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

interface ReportTemplate {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  complianceType?: 'vat' | 'commercial' | 'financial' | 'operational';
  required: boolean;
  lastGenerated?: Date;
  recipients: string[];
}

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  language: 'en' | 'ar' | 'both';
  dateRange: { start: Date; end: Date };
  includeCharts: boolean;
  watermark: boolean;
  password: boolean;
  encryption: boolean;
  digitalSignature: boolean;
}

interface ComplianceReport {
  id: string;
  type: string;
  status: 'pending' | 'generated' | 'submitted' | 'approved';
  dueDate: Date;
  generatedDate?: Date;
  submittedDate?: Date;
  authority: string;
  reference: string;
  description: string;
  descriptionAr: string;
}

interface InternationalReportingProps {
  region?: string;
  language?: 'en' | 'ar';
}

const COLORS = ['#8B4513', '#D2B48C', '#CD853F', '#F4A460', '#DEB887', '#BC8F8F'];

// Arabic translations
const translations = {
  en: {
    title: 'International Reporting & Compliance',
    subtitle: 'Multi-language reporting with regulatory compliance',
    reports: 'Reports',
    compliance: 'Compliance',
    exports: 'Exports',
    settings: 'Settings',
    generate: 'Generate Report',
    download: 'Download',
    schedule: 'Schedule',
    preview: 'Preview',
    send: 'Send',
    print: 'Print',
    lastGenerated: 'Last Generated',
    dueDate: 'Due Date',
    status: 'Status',
    pending: 'Pending',
    generated: 'Generated',
    submitted: 'Submitted',
    approved: 'Approved',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    annual: 'Annual',
    language: 'Language',
    format: 'Format',
    includeCharts: 'Include Charts',
    watermark: 'Add Watermark',
    password: 'Password Protection',
    encryption: 'Encryption',
    digitalSignature: 'Digital Signature',
    recipients: 'Recipients',
    vatReports: 'VAT Reports',
    financialReports: 'Financial Reports',
    operationalReports: 'Operational Reports',
    complianceStatus: 'Compliance Status',
    overdueReports: 'Overdue Reports',
    upcomingDeadlines: 'Upcoming Deadlines',
  },
  ar: {
    title: 'التقارير الدولية والامتثال',
    subtitle: 'تقارير متعددة اللغات مع الامتثال التنظيمي',
    reports: 'التقارير',
    compliance: 'الامتثال',
    exports: 'التصدير',
    settings: 'الإعدادات',
    generate: 'إنشاء تقرير',
    download: 'تحميل',
    schedule: 'جدولة',
    preview: 'معاينة',
    send: 'إرسال',
    print: 'طباعة',
    lastGenerated: 'آخر إنشاء',
    dueDate: 'تاريخ الاستحقاق',
    status: 'الحالة',
    pending: 'معلق',
    generated: 'تم إنشاؤه',
    submitted: 'تم الإرسال',
    approved: 'تمت الموافقة',
    daily: 'يومي',
    weekly: 'أسبوعي',
    monthly: 'شهري',
    quarterly: 'ربع سنوي',
    annual: 'سنوي',
    language: 'اللغة',
    format: 'التنسيق',
    includeCharts: 'تضمين الرسوم البيانية',
    watermark: 'إضافة علامة مائية',
    password: 'حماية بكلمة مرور',
    encryption: 'التشفير',
    digitalSignature: 'التوقيع الرقمي',
    recipients: 'المستلمون',
    vatReports: 'تقارير ضريبة القيمة المضافة',
    financialReports: 'التقارير المالية',
    operationalReports: 'التقارير التشغيلية',
    complianceStatus: 'حالة الامتثال',
    overdueReports: 'التقارير المتأخرة',
    upcomingDeadlines: 'المواعيد النهائية القادمة',
  },
};

export default function InternationalReporting({ region = 'UAE', language = 'en' }: InternationalReportingProps) {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>(language);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    language: 'en',
    dateRange: { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() },
    includeCharts: true,
    watermark: true,
    password: false,
    encryption: false,
    digitalSignature: false,
  });
  const [complianceStats, setComplianceStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const t = translations[currentLanguage];
  const isRTL = currentLanguage === 'ar';

  const fetchReportingData = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append('region', region);
      params.append('language', currentLanguage);

      const [templatesRes, complianceRes, statsRes] = await Promise.all([
        fetch(`/api/analytics/reporting?type=templates&${params.toString()}`),
        fetch(`/api/analytics/reporting?type=compliance&${params.toString()}`),
        fetch(`/api/analytics/reporting?type=stats&${params.toString()}`),
      ]);

      const [templatesData, complianceData, statsData] = await Promise.all([
        templatesRes.json(),
        complianceRes.json(),
        statsRes.json(),
      ]);

      setReportTemplates(templatesData.templates || []);
      setComplianceReports(complianceData.reports || []);
      setComplianceStats(statsData.stats || {});

    } catch (error) {
      console.error('Error fetching reporting data:', error);
    } finally {
      setLoading(false);
    }
  }, [region, currentLanguage]);

  useEffect(() => {
    fetchReportingData();
  }, [fetchReportingData]);

  const generateReport = async (templateId: string) => {
    try {
      setGeneratingReport(templateId);

      const response = await fetch('/api/analytics/reporting/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          exportOptions,
          region,
          language: currentLanguage,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `report-${templateId}-${Date.now()}.${exportOptions.format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Update last generated timestamp
        setReportTemplates(prev =>
          prev.map(template =>
            template.id === templateId
              ? { ...template, lastGenerated: new Date() }
              : template
          )
        );
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGeneratingReport(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'submitted':
        return 'text-blue-600 bg-blue-100';
      case 'generated':
        return 'text-orange-600 bg-orange-100';
      case 'pending':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return <Clock className="h-4 w-4" />;
      case 'weekly':
        return <Calendar className="h-4 w-4" />;
      case 'monthly':
        return <Calendar className="h-4 w-4" />;
      case 'quarterly':
        return <Calendar className="h-4 w-4" />;
      case 'annual':
        return <Calendar className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading reporting system...</div>;
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-oud-800">{t.title}</h2>
          <p className="text-oud-600">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
          >
            <Languages className="h-4 w-4 mr-2" />
            {currentLanguage === 'en' ? 'العربية' : 'English'}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            {t.settings}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchReportingData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">{t.complianceStatus}</p>
                <p className="text-xl font-bold text-green-600">
                  {complianceStats.compliantReports || 0}/{complianceStats.totalReports || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">{t.overdueReports}</p>
                <p className="text-xl font-bold text-red-600">
                  {complianceStats.overdueReports || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">{t.upcomingDeadlines}</p>
                <p className="text-xl font-bold text-orange-600">
                  {complianceStats.upcomingDeadlines || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-oud-600">Reports Generated</p>
                <p className="text-xl font-bold text-oud-800">
                  {complianceStats.reportsGenerated || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-oud-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">{t.reports}</TabsTrigger>
          <TabsTrigger value="compliance">{t.compliance}</TabsTrigger>
          <TabsTrigger value="exports">{t.exports}</TabsTrigger>
          <TabsTrigger value="settings">{t.settings}</TabsTrigger>
        </TabsList>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* VAT Reports */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-oud-500" />
                  {t.vatReports}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportTemplates
                    .filter(template => template.complianceType === 'vat')
                    .map((template) => (
                    <div key={template.id} className="border border-oud-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-oud-800">
                          {currentLanguage === 'ar' ? template.nameAr : template.name}
                        </h4>
                        {template.required && (
                          <Badge className="bg-red-100 text-red-600 text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-oud-600 mb-3">
                        {currentLanguage === 'ar' ? template.descriptionAr : template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFrequencyIcon(template.frequency)}
                          <span className="text-xs text-oud-500">
                            {t[template.frequency as keyof typeof t]}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => generateReport(template.id)}
                          disabled={generatingReport === template.id}
                        >
                          {generatingReport === template.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <Download className="h-3 w-3 mr-1" />
                          )}
                          {t.generate}
                        </Button>
                      </div>
                      {template.lastGenerated && (
                        <p className="text-xs text-oud-500 mt-2">
                          {t.lastGenerated}: {template.lastGenerated.toLocaleDateString(currentLanguage === 'ar' ? 'ar-AE' : 'en-AE')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial Reports */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-oud-500" />
                  {t.financialReports}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportTemplates
                    .filter(template => template.complianceType === 'financial')
                    .map((template) => (
                    <div key={template.id} className="border border-oud-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-oud-800">
                          {currentLanguage === 'ar' ? template.nameAr : template.name}
                        </h4>
                        {template.required && (
                          <Badge className="bg-red-100 text-red-600 text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-oud-600 mb-3">
                        {currentLanguage === 'ar' ? template.descriptionAr : template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFrequencyIcon(template.frequency)}
                          <span className="text-xs text-oud-500">
                            {t[template.frequency as keyof typeof t]}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => generateReport(template.id)}
                          disabled={generatingReport === template.id}
                        >
                          {generatingReport === template.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <Download className="h-3 w-3 mr-1" />
                          )}
                          {t.generate}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Operational Reports */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-oud-500" />
                  {t.operationalReports}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportTemplates
                    .filter(template => template.complianceType === 'operational')
                    .map((template) => (
                    <div key={template.id} className="border border-oud-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-oud-800">
                          {currentLanguage === 'ar' ? template.nameAr : template.name}
                        </h4>
                        {template.required && (
                          <Badge className="bg-red-100 text-red-600 text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-oud-600 mb-3">
                        {currentLanguage === 'ar' ? template.descriptionAr : template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFrequencyIcon(template.frequency)}
                          <span className="text-xs text-oud-500">
                            {t[template.frequency as keyof typeof t]}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => generateReport(template.id)}
                          disabled={generatingReport === template.id}
                        >
                          {generatingReport === template.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <Download className="h-3 w-3 mr-1" />
                          )}
                          {t.generate}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Status Chart */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Compliance Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip />
                    <Legend />
                    <RechartsPieChart
                      data={[
                        { name: 'Compliant', value: complianceStats.compliantReports || 0 },
                        { name: 'Pending', value: complianceStats.pendingReports || 0 },
                        { name: 'Overdue', value: complianceStats.overdueReports || 0 },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#ef4444" />
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Compliance Timeline */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Compliance Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceReports.slice(0, 6).map((report) => (
                    <div key={report.id} className="flex items-center gap-4 p-3 border border-oud-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <Flag className="h-5 w-5 text-oud-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-oud-800">
                          {currentLanguage === 'ar' ? report.descriptionAr : report.description}
                        </h4>
                        <p className="text-sm text-oud-600">{report.authority}</p>
                        <p className="text-xs text-oud-500">
                          Due: {report.dueDate.toLocaleDateString(currentLanguage === 'ar' ? 'ar-AE' : 'en-AE')}
                        </p>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {t[report.status as keyof typeof t]}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Compliance Table */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Detailed Compliance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-oud-200">
                      <th className={`py-2 px-4 text-oud-700 ${isRTL ? 'text-right' : 'text-left'}`}>Report</th>
                      <th className={`py-2 px-4 text-oud-700 ${isRTL ? 'text-right' : 'text-left'}`}>Authority</th>
                      <th className={`py-2 px-4 text-oud-700 ${isRTL ? 'text-right' : 'text-left'}`}>Due Date</th>
                      <th className={`py-2 px-4 text-oud-700 ${isRTL ? 'text-right' : 'text-left'}`}>Status</th>
                      <th className={`py-2 px-4 text-oud-700 ${isRTL ? 'text-right' : 'text-left'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceReports.map((report) => (
                      <tr key={report.id} className="border-b border-oud-100 hover:bg-oud-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-oud-800">
                              {currentLanguage === 'ar' ? report.descriptionAr : report.description}
                            </p>
                            <p className="text-sm text-oud-600">{report.reference}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-oud-800">{report.authority}</td>
                        <td className="py-3 px-4 text-oud-800">
                          {report.dueDate.toLocaleDateString(currentLanguage === 'ar' ? 'ar-AE' : 'en-AE')}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(report.status)}>
                            {t[report.status as keyof typeof t]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              {t.preview}
                            </Button>
                            <Button size="sm">
                              <Download className="h-3 w-3 mr-1" />
                              {t.download}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Settings Tab */}
        <TabsContent value="exports" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Export Configuration</CardTitle>
              <CardDescription>Configure export settings for reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-oud-700 mb-2 block">{t.format}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['pdf', 'excel', 'csv', 'json'] as const).map((format) => (
                        <Button
                          key={format}
                          variant={exportOptions.format === format ? "default" : "outline"}
                          size="sm"
                          onClick={() => setExportOptions(prev => ({ ...prev, format }))}
                        >
                          {format === 'pdf' && <FileText className="h-3 w-3 mr-1" />}
                          {format === 'excel' && <FileSpreadsheet className="h-3 w-3 mr-1" />}
                          {format.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-oud-700 mb-2 block">{t.language}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['en', 'ar', 'both'] as const).map((lang) => (
                        <Button
                          key={lang}
                          variant={exportOptions.language === lang ? "default" : "outline"}
                          size="sm"
                          onClick={() => setExportOptions(prev => ({ ...prev, language: lang }))}
                        >
                          {lang === 'en' && 'English'}
                          {lang === 'ar' && 'العربية'}
                          {lang === 'both' && 'Both'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-oud-700">Security Options</label>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-oud-600">{t.watermark}</span>
                      <input
                        type="checkbox"
                        checked={exportOptions.watermark}
                        onChange={(e) => setExportOptions(prev => ({ ...prev, watermark: e.target.checked }))}
                        className="rounded border-oud-300"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-oud-600">{t.password}</span>
                      <input
                        type="checkbox"
                        checked={exportOptions.password}
                        onChange={(e) => setExportOptions(prev => ({ ...prev, password: e.target.checked }))}
                        className="rounded border-oud-300"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-oud-600">{t.encryption}</span>
                      <input
                        type="checkbox"
                        checked={exportOptions.encryption}
                        onChange={(e) => setExportOptions(prev => ({ ...prev, encryption: e.target.checked }))}
                        className="rounded border-oud-300"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-oud-600">{t.digitalSignature}</span>
                      <input
                        type="checkbox"
                        checked={exportOptions.digitalSignature}
                        onChange={(e) => setExportOptions(prev => ({ ...prev, digitalSignature: e.target.checked }))}
                        className="rounded border-oud-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-oud-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-oud-800">Scheduled Exports</h4>
                    <p className="text-sm text-oud-600">Automatically generate and send reports</p>
                  </div>
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    {t.schedule}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-oud-700 mb-2 block">Region</label>
                    <select className="w-full p-2 border border-oud-300 rounded-md">
                      <option value="UAE">United Arab Emirates</option>
                      <option value="KSA">Kingdom of Saudi Arabia</option>
                      <option value="QAT">Qatar</option>
                      <option value="KWT">Kuwait</option>
                      <option value="BHR">Bahrain</option>
                      <option value="OMN">Oman</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-oud-700 mb-2 block">Time Zone</label>
                    <select className="w-full p-2 border border-oud-300 rounded-md">
                      <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
                      <option value="Asia/Riyadh">Asia/Riyadh (UTC+3)</option>
                      <option value="Asia/Qatar">Asia/Qatar (UTC+3)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-oud-700 mb-2 block">Currency</label>
                    <select className="w-full p-2 border border-oud-300 rounded-md">
                      <option value="AED">AED - UAE Dirham</option>
                      <option value="SAR">SAR - Saudi Riyal</option>
                      <option value="QAR">QAR - Qatari Riyal</option>
                      <option value="KWD">KWD - Kuwaiti Dinar</option>
                      <option value="BHD">BHD - Bahraini Dinar</option>
                      <option value="OMR">OMR - Omani Rial</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-oud-600">Email Notifications</span>
                    <input type="checkbox" defaultChecked className="rounded border-oud-300" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-oud-600">Compliance Alerts</span>
                    <input type="checkbox" defaultChecked className="rounded border-oud-300" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-oud-600">Report Generation Alerts</span>
                    <input type="checkbox" defaultChecked className="rounded border-oud-300" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-oud-600">Deadline Reminders</span>
                    <input type="checkbox" defaultChecked className="rounded border-oud-300" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-oud-700 mb-2 block">Reminder Timing</label>
                    <select className="w-full p-2 border border-oud-300 rounded-md">
                      <option value="1">1 day before</option>
                      <option value="3">3 days before</option>
                      <option value="7">1 week before</option>
                      <option value="14">2 weeks before</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}