'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Download,
  Plus,
  BookOpen,
  Users,
  Target,
  TrendingUp,
  Calendar,
  ArrowLeft} from 'lucide-react';

interface TrainingProgram {
  id: string;
  name: string;
  category: 'safety' | 'product_knowledge' | 'compliance' | 'sales' | 'technical' | 'leadership';
  duration: string;
  status: 'active' | 'completed' | 'scheduled';
  progress: number;
  enrolledStaff: number;
  completedStaff: number;
  startDate: string;
  endDate: string;
  instructor: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  completedCourses: number;
  ongoingCourses: number;
  certifications: number;
  overallProgress: number;
  nextCertificationDue?: string;
}

interface Certification {
  id: string;
  name: string;
  staffName: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
  renewalRequired: boolean;
}

export default function TrainingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock training programs
  const trainingPrograms: TrainingProgram[] = [
    {
      id: 'TRN-001',
      name: 'Advanced Oud Distillation Techniques',
      category: 'technical',
      duration: '3 weeks',
      status: 'active',
      progress: 65,
      enrolledStaff: 8,
      completedStaff: 5,
      startDate: '2025-09-15',
      endDate: '2025-10-06',
      instructor: 'Master Ali Hassan'
    },
    {
      id: 'TRN-002',
      name: 'Workplace Safety & Hazard Prevention',
      category: 'safety',
      duration: '1 week',
      status: 'active',
      progress: 85,
      enrolledStaff: 25,
      completedStaff: 21,
      startDate: '2025-09-20',
      endDate: '2025-09-27',
      instructor: 'Safety Officer Ahmed'
    },
    {
      id: 'TRN-003',
      name: 'CITES Compliance & Documentation',
      category: 'compliance',
      duration: '2 days',
      status: 'completed',
      progress: 100,
      enrolledStaff: 12,
      completedStaff: 12,
      startDate: '2025-09-01',
      endDate: '2025-09-02',
      instructor: 'Compliance Manager Sara'
    },
    {
      id: 'TRN-004',
      name: 'Customer Service Excellence',
      category: 'sales',
      duration: '1 week',
      status: 'active',
      progress: 40,
      enrolledStaff: 15,
      completedStaff: 6,
      startDate: '2025-09-25',
      endDate: '2025-10-02',
      instructor: 'Sales Director Omar'
    },
    {
      id: 'TRN-005',
      name: 'Perfume Blending Fundamentals',
      category: 'product_knowledge',
      duration: '2 weeks',
      status: 'scheduled',
      progress: 0,
      enrolledStaff: 10,
      completedStaff: 0,
      startDate: '2025-10-15',
      endDate: '2025-10-29',
      instructor: 'Master Perfumer Fatima'
    },
    {
      id: 'TRN-006',
      name: 'Leadership & Team Management',
      category: 'leadership',
      duration: '4 weeks',
      status: 'active',
      progress: 50,
      enrolledStaff: 6,
      completedStaff: 3,
      startDate: '2025-09-10',
      endDate: '2025-10-08',
      instructor: 'HR Manager Khalid'
    }
  ];

  // Staff members
  const staffMembers: StaffMember[] = [
    {
      id: 'STF-001',
      name: 'Mohammed Abdullah',
      role: 'Senior Distiller',
      department: 'Production',
      completedCourses: 12,
      ongoingCourses: 2,
      certifications: 4,
      overallProgress: 85,
      nextCertificationDue: '2025-11-15'
    },
    {
      id: 'STF-002',
      name: 'Layla Al-Mansoori',
      role: 'Sales Manager',
      department: 'Sales',
      completedCourses: 8,
      ongoingCourses: 1,
      certifications: 3,
      overallProgress: 70
    },
    {
      id: 'STF-003',
      name: 'Hassan Ibrahim',
      role: 'Quality Control Specialist',
      department: 'Production',
      completedCourses: 15,
      ongoingCourses: 1,
      certifications: 5,
      overallProgress: 92,
      nextCertificationDue: '2026-01-20'
    },
    {
      id: 'STF-004',
      name: 'Aisha Rahman',
      role: 'Compliance Officer',
      department: 'Administration',
      completedCourses: 10,
      ongoingCourses: 2,
      certifications: 6,
      overallProgress: 78,
      nextCertificationDue: '2025-10-30'
    },
    {
      id: 'STF-005',
      name: 'Omar Khalifa',
      role: 'Production Supervisor',
      department: 'Production',
      completedCourses: 11,
      ongoingCourses: 3,
      certifications: 4,
      overallProgress: 65
    }
  ];

  // Certifications
  const certifications: Certification[] = [
    {
      id: 'CERT-001',
      name: 'Advanced Distillation Certification',
      staffName: 'Mohammed Abdullah',
      issueDate: '2024-11-15',
      expiryDate: '2025-11-15',
      status: 'expiring_soon',
      renewalRequired: true
    },
    {
      id: 'CERT-002',
      name: 'CITES Documentation Specialist',
      staffName: 'Aisha Rahman',
      issueDate: '2024-10-30',
      expiryDate: '2025-10-30',
      status: 'expiring_soon',
      renewalRequired: true
    },
    {
      id: 'CERT-003',
      name: 'Quality Control Professional',
      staffName: 'Hassan Ibrahim',
      issueDate: '2025-01-20',
      expiryDate: '2026-01-20',
      status: 'valid',
      renewalRequired: false
    },
    {
      id: 'CERT-004',
      name: 'Sales Excellence Certification',
      staffName: 'Layla Al-Mansoori',
      issueDate: '2025-03-10',
      expiryDate: '2026-03-10',
      status: 'valid',
      renewalRequired: false
    }
  ];

  const filteredPrograms = trainingPrograms.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const trainingStats = {
    activePrograms: trainingPrograms.filter(p => p.status === 'active').length,
    totalEnrolled: trainingPrograms.reduce((sum, p) => sum + p.enrolledStaff, 0),
    avgCompletion: Math.round(trainingPrograms.reduce((sum, p) => sum + p.progress, 0) / trainingPrograms.length),
    expiringCerts: certifications.filter(c => c.status === 'expiring_soon').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-purple-100 text-purple-700';
      case 'valid': return 'bg-green-100 text-green-700';
      case 'expiring_soon': return 'bg-orange-100 text-orange-700';
      case 'expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      safety: 'Safety',
      product_knowledge: 'Product Knowledge',
      compliance: 'Compliance',
      sales: 'Sales',
      technical: 'Technical',
      leadership: 'Leadership'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      safety: 'bg-red-100 text-red-700',
      product_knowledge: 'bg-purple-100 text-purple-700',
      compliance: 'bg-blue-100 text-blue-700',
      sales: 'bg-green-100 text-green-700',
      technical: 'bg-orange-100 text-orange-700',
      leadership: 'bg-indigo-100 text-indigo-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
                  <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>


          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Training & Certification Management
          </h1>
          <p className="text-gray-600 mt-1">Track employee development and certification compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Plus className="h-4 w-4" />
            New Training Program
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold text-gray-900">{trainingStats.activePrograms}</p>
                <p className="text-xs text-blue-600 mt-1">Currently running</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Enrolled</p>
                <p className="text-2xl font-bold text-gray-900">{trainingStats.totalEnrolled}</p>
                <p className="text-xs text-green-600 mt-1">Staff members</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                <p className="text-2xl font-bold text-gray-900">{trainingStats.avgCompletion}%</p>
                <p className="text-xs text-purple-600 mt-1">Across all programs</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Certs</p>
                <p className="text-2xl font-bold text-gray-900">{trainingStats.expiringCerts}</p>
                <p className="text-xs text-orange-600 mt-1">Require renewal</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
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
                placeholder="Search training programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'safety', 'product_knowledge', 'compliance', 'sales', 'technical', 'leadership'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  {category === 'all' ? 'All' : getCategoryLabel(category)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="programs">Training Programs</TabsTrigger>
          <TabsTrigger value="staff">Staff Progress</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                Training Programs Overview
              </CardTitle>
              <CardDescription>All training programs and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPrograms.map((program) => (
                  <Card key={program.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{program.name}</h3>
                            <Badge className={getCategoryColor(program.category)}>
                              {getCategoryLabel(program.category)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">Instructor: {program.instructor}</p>
                        </div>
                        <Badge className={getStatusColor(program.status)}>
                          {program.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <p className="font-medium text-gray-900">{program.duration}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Start Date:</span>
                          <p className="font-medium text-gray-900">{new Date(program.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">End Date:</span>
                          <p className="font-medium text-gray-900">{new Date(program.endDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Enrolled:</span>
                          <p className="font-medium text-gray-900">{program.completedStaff}/{program.enrolledStaff} completed</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Overall Progress</span>
                          <span className="font-medium text-gray-900">{program.progress}%</span>
                        </div>
                        <Progress value={program.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Staff Training Progress
              </CardTitle>
              <CardDescription>Individual employee training and certification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Staff Member</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Completed</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Ongoing</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Certifications</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Progress</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Next Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffMembers.map((staff) => (
                      <tr key={staff.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.role}</div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline">{staff.department}</Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-semibold text-green-600">{staff.completedCourses}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-semibold text-blue-600">{staff.ongoingCourses}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Award className="h-4 w-4 text-purple-600" />
                            <span className="font-semibold text-purple-600">{staff.certifications}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <Progress value={staff.overallProgress} className="h-2 w-32" />
                            <span className="text-xs text-gray-600">{staff.overallProgress}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {staff.nextCertificationDue ? (
                            <span className="text-sm text-gray-900">
                              {new Date(staff.nextCertificationDue).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Certification Management
              </CardTitle>
              <CardDescription>Track all certifications and renewal requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <Card key={cert.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                          <p className="text-sm text-gray-600">{cert.staffName}</p>
                        </div>
                        <Badge className={getStatusColor(cert.status)}>
                          {cert.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Issue Date:</span>
                          <p className="font-medium text-gray-900">{new Date(cert.issueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Expiry Date:</span>
                          <p className="font-medium text-gray-900">{new Date(cert.expiryDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Renewal:</span>
                          <p className="font-medium text-gray-900">
                            {cert.renewalRequired ? (
                              <span className="text-orange-600 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Required
                              </span>
                            ) : (
                              <span className="text-green-600">Not Required</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {cert.renewalRequired && (
                        <div className="mt-3">
                          <Button variant="outline" size="sm" className="w-full">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Renewal
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
