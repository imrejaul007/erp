'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  GitBranch, ArrowLeft, Plus, CheckCircle2, AlertCircle, TrendingUp,
  Package, Weight, DollarSign, Activity
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SegregationPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('active');
  const [isNewSegregationDialogOpen, setIsNewSegregationDialogOpen] = useState(false);
  const [selectedSegregation, setSelectedSegregation] = useState<any>(null);
  const [isSegregationDetailOpen, setIsSegregationDetailOpen] = useState(false);
  const [outputCategories, setOutputCategories] = useState([
    { id: 1, type: '', quality: '', weight: '', sku: '' }
  ]);

  // Cost tracking states
  const [sourceLotCost, setSourceLotCost] = useState('560000'); // Example: landed cost from lot
  const [inputWeight, setInputWeight] = useState('100');

  // Employee costs
  const [employees, setEmployees] = useState([
    { id: 1, name: '', type: 'hourly', hours: '', rate: '', fixedAmount: '' }
  ]);

  // Additional task costs
  const [taskCosts, setTaskCosts] = useState([
    { id: 1, taskName: '', amount: '', description: '' }
  ]);

  // Calculate total employee cost
  const calculateEmployeeCost = () => {
    return employees.reduce((total, emp) => {
      if (emp.type === 'hourly') {
        return total + ((parseFloat(emp.hours) || 0) * (parseFloat(emp.rate) || 0));
      } else {
        return total + (parseFloat(emp.fixedAmount) || 0);
      }
    }, 0);
  };

  // Calculate total task costs
  const calculateTaskCosts = () => {
    return taskCosts.reduce((total, task) => total + (parseFloat(task.amount) || 0), 0);
  };

  // Calculate total segregation cost
  const calculateTotalSegregationCost = () => {
    return calculateEmployeeCost() + calculateTaskCosts();
  };

  // Calculate grand total cost
  const calculateGrandTotalCost = () => {
    return (parseFloat(sourceLotCost) || 0) + calculateTotalSegregationCost();
  };

  // Calculate cost per kg (for distribution)
  const calculateCostPerKg = () => {
    const totalWeight = parseFloat(inputWeight) || 1;
    return calculateGrandTotalCost() / totalWeight;
  };

  // Calculate cost for specific output based on weight
  const calculateOutputCost = (weight: string) => {
    const w = parseFloat(weight) || 0;
    return w * calculateCostPerKg();
  };

  const segregationSummary = {
    inProgress: 8,
    completedToday: 5,
    completedThisMonth: 145,
    avgWastage: 3.2,
    outputSKUs: 156,
    totalValue: 845000
  };

  const activeSegregation = [
    {
      id: 'SEG-2024-198',
      batchNo: 'CAMOD-2024-085',
      rawMaterial: 'Cambodian Oud Wood',
      inputWeight: 115.0,
      startDate: '2024-10-02',
      operator: 'Ahmed Al-Rashid',
      progress: 45,
      stage: 'Grading',
      expectedOutputs: 5,
      estimatedCompletion: '2024-10-02 18:00',
      status: 'in-progress'
    },
    {
      id: 'SEG-2024-199',
      batchNo: 'HINDI-2024-092',
      rawMaterial: 'Hindi Oud Wood',
      inputWeight: 76.7,
      startDate: '2024-10-02',
      operator: 'Fatima Hassan',
      progress: 20,
      stage: 'Initial Sorting',
      expectedOutputs: 4,
      estimatedCompletion: '2024-10-02 17:30',
      status: 'in-progress'
    }
  ];

  const completedSegregation = [
    {
      id: 'SEG-2024-195',
      batchNo: 'VIET-2024-075',
      rawMaterial: 'Vietnamese Oud Wood',
      inputWeight: 54.3,
      completedDate: '2024-10-01',
      operator: 'Mohammed Saeed',
      outputs: [
        { grade: 'Premium Chips', weight: 8.5, sku: 'OUD-VIET-PREM-CH', value: 85000 },
        { grade: 'Grade A Chips', weight: 15.2, sku: 'OUD-VIET-A-CH', value: 91200 },
        { grade: 'Grade B Chips', weight: 18.6, sku: 'OUD-VIET-B-CH', value: 74400 },
        { grade: 'Powder', weight: 9.8, sku: 'OUD-VIET-PWD', value: 29400 },
        { grade: 'Dust (By-product)', weight: 0.5, sku: 'OUD-VIET-DUST', value: 500 }
      ],
      totalOutputWeight: 52.6,
      wastage: 1.7,
      wastagePercent: 3.1,
      totalValue: 280500,
      status: 'completed'
    },
    {
      id: 'SEG-2024-192',
      batchNo: 'INDO-2024-088',
      rawMaterial: 'Indonesian Oud Wood',
      inputWeight: 98.5,
      completedDate: '2024-09-30',
      operator: 'Ahmed Al-Rashid',
      outputs: [
        { grade: 'Premium Chips', weight: 12.5, sku: 'OUD-INDO-PREM-CH', value: 137500 },
        { grade: 'Grade A Chips', weight: 28.4, sku: 'OUD-INDO-A-CH', value: 227200 },
        { grade: 'Grade B Chips', weight: 35.2, sku: 'OUD-INDO-B-CH', value: 176000 },
        { grade: 'Grade C Chips', weight: 15.8, sku: 'OUD-INDO-C-CH', value: 47400 },
        { grade: 'Powder', weight: 5.2, sku: 'OUD-INDO-PWD', value: 15600 }
      ],
      totalOutputWeight: 97.1,
      wastage: 1.4,
      wastagePercent: 1.4,
      totalValue: 603700,
      status: 'completed'
    }
  ];

  const gradeDefinitions = [
    {
      grade: 'Premium',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      criteria: [
        'Large, dense chips with high resin content',
        'Rich, complex aroma profile',
        'Dark color, minimal impurities',
        'Size: 2-5 cm chunks'
      ],
      avgYield: '10-15%',
      priceMultiplier: '10x'
    },
    {
      grade: 'Grade A',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      criteria: [
        'Medium to large chips, good resin',
        'Strong, pleasant aroma',
        'Consistent color and texture',
        'Size: 1-3 cm chips'
      ],
      avgYield: '25-30%',
      priceMultiplier: '6x'
    },
    {
      grade: 'Grade B',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      criteria: [
        'Medium chips, moderate resin',
        'Decent aroma characteristics',
        'Some color variation acceptable',
        'Size: 0.5-1.5 cm chips'
      ],
      avgYield: '30-35%',
      priceMultiplier: '4x'
    },
    {
      grade: 'Grade C',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      criteria: [
        'Small chips, lower resin content',
        'Light to moderate aroma',
        'Mixed quality acceptable',
        'Size: 0.2-0.8 cm chips'
      ],
      avgYield: '15-20%',
      priceMultiplier: '2x'
    },
    {
      grade: 'Powder',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      criteria: [
        'Fine powder from processing',
        'Used for incense and blending',
        'Variable aroma strength',
        'Size: < 2mm particles'
      ],
      avgYield: '8-12%',
      priceMultiplier: '3x'
    },
    {
      grade: 'Dust/By-product',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      criteria: [
        'Very fine particles',
        'Minimal commercial value',
        'Used for low-grade incense',
        'Size: < 0.5mm'
      ],
      avgYield: '1-3%',
      priceMultiplier: '1x'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/production')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Segregation Process</h1>
            <p className="text-muted-foreground">
              Grade sorting, quality-based segregation & multi-output batch tracking
            </p>
          </div>
        </div>
        <Dialog open={isNewSegregationDialogOpen} onOpenChange={setIsNewSegregationDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Start New Segregation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Start New Segregation Process</DialogTitle>
              <DialogDescription>
                Select raw material batch to begin grade sorting and segregation
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Raw Material Selection & Source Cost</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batch-number">Raw Material Batch</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HINDI-2024-095">HINDI-2024-095 - Hindi Oud (100kg) - AED 560,000</SelectItem>
                        <SelectItem value="CAMOD-2024-090">CAMOD-2024-090 - Cambodian Oud (125kg) - AED 712,500</SelectItem>
                        <SelectItem value="VIET-2024-085">VIET-2024-085 - Vietnamese Oud (98kg) - AED 485,000</SelectItem>
                        <SelectItem value="INDO-2024-088">INDO-2024-088 - Indonesian Oud (142kg) - AED 625,400</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="input-weight">Input Weight (kg) *</Label>
                    <Input
                      id="input-weight"
                      type="number"
                      placeholder="100"
                      step="0.1"
                      value={inputWeight}
                      onChange={(e) => setInputWeight(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source-cost">Source Lot Cost (Total Landed) *</Label>
                    <Input
                      id="source-cost"
                      type="number"
                      placeholder="560000"
                      value={sourceLotCost}
                      onChange={(e) => setSourceLotCost(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Landed cost from raw material lot
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg mt-6">
                      <p className="text-xs text-muted-foreground">Source Cost per kg</p>
                      <p className="text-lg font-bold">
                        AED {(parseFloat(sourceLotCost) / parseFloat(inputWeight || '1')).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200 my-4" />

              {/* Employee Costs Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Employee Labor Costs</h3>
                    <p className="text-sm text-muted-foreground">
                      Add employees working on segregation (hourly or fixed salary)
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEmployees([...employees, {
                        id: Date.now(),
                        name: '',
                        type: 'hourly',
                        hours: '',
                        rate: '',
                        fixedAmount: ''
                      }]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {employees.map((emp, index) => (
                    <div key={emp.id} className="p-4 border-2 rounded-lg bg-amber-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm text-gray-900">Employee #{index + 1}</h4>
                        {employees.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEmployees(employees.filter(e => e.id !== emp.id));
                            }}
                          >
                            <AlertCircle className="h-4 w-4" />
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor={`emp-name-${emp.id}`}>Employee Name</Label>
                          <Input
                            id={`emp-name-${emp.id}`}
                            placeholder="Ahmed Al-Rashid"
                            value={emp.name}
                            onChange={(e) => {
                              const updated = employees.map(e =>
                                e.id === emp.id ? { ...e, name: e.target.value } : e
                              );
                              setEmployees(updated);
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`emp-type-${emp.id}`}>Payment Type</Label>
                          <Select
                            value={emp.type}
                            onValueChange={(value) => {
                              const updated = employees.map(e =>
                                e.id === emp.id ? { ...e, type: value } : e
                              );
                              setEmployees(updated);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly Rate</SelectItem>
                              <SelectItem value="fixed">Fixed Salary</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {emp.type === 'hourly' ? (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor={`emp-hours-${emp.id}`}>Hours Worked</Label>
                              <Input
                                id={`emp-hours-${emp.id}`}
                                type="number"
                                step="0.5"
                                placeholder="8"
                                value={emp.hours}
                                onChange={(e) => {
                                  const updated = employees.map(e =>
                                    e.id === emp.id ? { ...e, hours: e.target.value } : e
                                  );
                                  setEmployees(updated);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`emp-rate-${emp.id}`}>Rate per Hour (AED)</Label>
                              <Input
                                id={`emp-rate-${emp.id}`}
                                type="number"
                                step="0.01"
                                placeholder="50"
                                value={emp.rate}
                                onChange={(e) => {
                                  const updated = employees.map(e =>
                                    e.id === emp.id ? { ...e, rate: e.target.value } : e
                                  );
                                  setEmployees(updated);
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2 col-span-2">
                            <Label htmlFor={`emp-fixed-${emp.id}`}>Fixed Amount (AED)</Label>
                            <Input
                              id={`emp-fixed-${emp.id}`}
                              type="number"
                              step="0.01"
                              placeholder="2000"
                              value={emp.fixedAmount}
                              onChange={(e) => {
                                const updated = employees.map(e =>
                                  e.id === emp.id ? { ...e, fixedAmount: e.target.value } : e
                                );
                                setEmployees(updated);
                              }}
                            />
                          </div>
                        )}

                        <div className="col-span-2 p-2 bg-white rounded">
                          <p className="text-sm font-semibold">
                            Employee Cost: AED {emp.type === 'hourly'
                              ? ((parseFloat(emp.hours) || 0) * (parseFloat(emp.rate) || 0)).toLocaleString()
                              : (parseFloat(emp.fixedAmount) || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-amber-100 rounded-lg">
                  <p className="text-sm font-semibold">
                    Total Employee Cost: AED {calculateEmployeeCost().toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="h-px bg-gray-200 my-4" />

              {/* Additional Task Costs Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Additional Task Costs</h3>
                    <p className="text-sm text-muted-foreground">
                      Cleaning, coloring, special processing, utilities, etc.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTaskCosts([...taskCosts, {
                        id: Date.now(),
                        taskName: '',
                        amount: '',
                        description: ''
                      }]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task Cost
                  </Button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {taskCosts.map((task, index) => (
                    <div key={task.id} className="p-4 border-2 rounded-lg bg-green-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm">Task #{index + 1}</h4>
                        {taskCosts.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTaskCosts(taskCosts.filter(t => t.id !== task.id));
                            }}
                          >
                            <AlertCircle className="h-4 w-4" />
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor={`task-name-${task.id}`}>Task Name</Label>
                          <Select
                            value={task.taskName}
                            onValueChange={(value) => {
                              const updated = taskCosts.map(t =>
                                t.id === task.id ? { ...t, taskName: value } : t
                              );
                              setTaskCosts(updated);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select task" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cleaning">Cleaning & Washing</SelectItem>
                              <SelectItem value="coloring">Coloring/Dyeing</SelectItem>
                              <SelectItem value="drying">Drying Process</SelectItem>
                              <SelectItem value="polishing">Polishing</SelectItem>
                              <SelectItem value="utilities">Utilities (Electric/Water)</SelectItem>
                              <SelectItem value="equipment">Equipment Rental</SelectItem>
                              <SelectItem value="chemicals">Chemicals & Materials</SelectItem>
                              <SelectItem value="quality-check">Quality Inspection</SelectItem>
                              <SelectItem value="other">Other (Custom)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`task-amount-${task.id}`}>Cost (AED)</Label>
                          <Input
                            id={`task-amount-${task.id}`}
                            type="number"
                            step="0.01"
                            placeholder="500"
                            value={task.amount}
                            onChange={(e) => {
                              const updated = taskCosts.map(t =>
                                t.id === task.id ? { ...t, amount: e.target.value } : t
                              );
                              setTaskCosts(updated);
                            }}
                          />
                        </div>

                        <div className="space-y-2 col-span-2">
                          <Label htmlFor={`task-desc-${task.id}`}>Description (Optional)</Label>
                          <Input
                            id={`task-desc-${task.id}`}
                            placeholder="Details about this task..."
                            value={task.description}
                            onChange={(e) => {
                              const updated = taskCosts.map(t =>
                                t.id === task.id ? { ...t, description: e.target.value } : t
                              );
                              setTaskCosts(updated);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-green-100 rounded-lg">
                  <p className="text-sm font-semibold">
                    Total Task Costs: AED {calculateTaskCosts().toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="h-px bg-gray-200 my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Operator & Equipment</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="operator">Assign Operator</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ahmed">Ahmed Al-Rashid (Specialist)</SelectItem>
                        <SelectItem value="fatima">Fatima Hassan (Senior)</SelectItem>
                        <SelectItem value="mohammed">Mohammed Saeed (Expert)</SelectItem>
                        <SelectItem value="aisha">Aisha Al-Mansoori (Lead)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workstation">Workstation</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select workstation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ws1">Workstation 1 (Available)</SelectItem>
                        <SelectItem value="ws2">Workstation 2 (Available)</SelectItem>
                        <SelectItem value="ws3">Workstation 3 (In Use)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Segregation Output Categories</h3>
                    <p className="text-sm text-muted-foreground">
                      Add multiple outputs with custom wood type and quality names
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOutputCategories([...outputCategories, {
                        id: Date.now(),
                        type: '',
                        quality: '',
                        weight: '',
                        sku: ''
                      }]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {outputCategories.map((category, index) => (
                    <div key={category.id} className="p-4 border-2 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm text-gray-900">Output #{index + 1}</h4>
                        {outputCategories.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setOutputCategories(outputCategories.filter(c => c.id !== category.id));
                            }}
                          >
                            <AlertCircle className="h-4 w-4" />
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor={`type-${category.id}`}>Wood Type *</Label>
                          <Input
                            id={`type-${category.id}`}
                            placeholder="e.g., Muri, Salla, Super, Chips, Powder"
                            value={category.type}
                            onChange={(e) => {
                              const updated = outputCategories.map(c =>
                                c.id === category.id ? { ...c, type: e.target.value } : c
                              );
                              setOutputCategories(updated);
                            }}
                          />
                          <p className="text-xs text-muted-foreground">
                            Custom name for wood type/cut
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`quality-${category.id}`}>Quality Grade *</Label>
                          <Input
                            id={`quality-${category.id}`}
                            placeholder="e.g., Super, A+, Premium, Grade 1"
                            value={category.quality}
                            onChange={(e) => {
                              const updated = outputCategories.map(c =>
                                c.id === category.id ? { ...c, quality: e.target.value } : c
                              );
                              setOutputCategories(updated);
                            }}
                          />
                          <p className="text-xs text-muted-foreground">
                            Custom quality classification
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`weight-${category.id}`}>Weight (kg) *</Label>
                          <Input
                            id={`weight-${category.id}`}
                            type="number"
                            step="0.01"
                            placeholder="15.5"
                            value={category.weight}
                            onChange={(e) => {
                              const updated = outputCategories.map(c =>
                                c.id === category.id ? { ...c, weight: e.target.value } : c
                              );
                              setOutputCategories(updated);
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`sku-${category.id}`}>SKU (Auto-generated)</Label>
                          <Input
                            id={`sku-${category.id}`}
                            placeholder="HINDI-MURI-SUPER"
                            value={category.sku}
                            onChange={(e) => {
                              const updated = outputCategories.map(c =>
                                c.id === category.id ? { ...c, sku: e.target.value } : c
                              );
                              setOutputCategories(updated);
                            }}
                          />
                          <p className="text-xs text-muted-foreground">
                            Custom or auto SKU
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900">Example Segregation:</p>
                      <p className="text-blue-700 mt-1">
                        100kg Hindi Oud → Muri Super (25kg) + Muri Grade A (30kg) + Salla Premium (20kg) +
                        Salla Grade B (15kg) + Chips (8kg) + Powder (2kg)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">Total Output Weight:</span>
                    <span className="text-lg font-bold text-primary">
                      {outputCategories.reduce((sum, cat) => sum + (parseFloat(cat.weight) || 0), 0).toFixed(2)} kg
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200 my-4" />

              {/* Grand Total Cost Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Grand Total Cost Summary</h3>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2">
                      <h4 className="font-bold text-lg">Cost Breakdown</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex justify-between p-3 bg-white rounded">
                        <span className="text-sm font-medium">Source Lot Cost:</span>
                        <span className="text-sm font-bold">AED {(parseFloat(sourceLotCost) || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-amber-100 rounded">
                        <span className="text-sm font-medium">Employee Costs:</span>
                        <span className="text-sm font-bold">AED {calculateEmployeeCost().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-green-100 rounded">
                        <span className="text-sm font-medium">Task Costs:</span>
                        <span className="text-sm font-bold">AED {calculateTaskCosts().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-100 rounded">
                        <span className="text-sm font-medium">Segregation Total:</span>
                        <span className="text-sm font-bold">AED {calculateTotalSegregationCost().toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="h-px bg-blue-300 my-3" />

                    <div className="flex justify-between p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border-2 border-green-300">
                      <span className="text-lg font-bold">GRAND TOTAL COST:</span>
                      <span className="text-2xl font-bold text-green-700">
                        AED {calculateGrandTotalCost().toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </span>
                    </div>

                    <div className="flex justify-between p-3 bg-purple-100 rounded-lg">
                      <span className="text-sm font-semibold">Cost per kg (True Landed + Segregation):</span>
                      <span className="text-lg font-bold text-purple-700">
                        AED {calculateCostPerKg().toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} / kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Output Cost Distribution Table */}
                {outputCategories.some(cat => cat.weight) && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Cost Distribution Across Outputs</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-100">
                            <TableHead className="font-bold">Wood Type</TableHead>
                            <TableHead className="font-bold">Quality Grade</TableHead>
                            <TableHead className="font-bold">Weight (kg)</TableHead>
                            <TableHead className="font-bold">% of Total</TableHead>
                            <TableHead className="font-bold">Allocated Cost</TableHead>
                            <TableHead className="font-bold">Cost per kg</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {outputCategories
                            .filter(cat => cat.weight)
                            .map((category, index) => {
                              const weight = parseFloat(category.weight) || 0;
                              const totalOutputWeight = outputCategories.reduce((sum, cat) => sum + (parseFloat(cat.weight) || 0), 0);
                              const percentage = totalOutputWeight > 0 ? (weight / totalOutputWeight) * 100 : 0;
                              const allocatedCost = calculateOutputCost(category.weight);

                              return (
                                <TableRow key={category.id} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                                  <TableCell className="font-medium">{category.type || '—'}</TableCell>
                                  <TableCell className="font-medium">{category.quality || '—'}</TableCell>
                                  <TableCell className="font-bold">{weight.toFixed(2)}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold">{percentage.toFixed(1)}%</span>
                                      <Progress value={percentage} className="w-16 h-2" />
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-bold text-green-700">
                                    AED {allocatedCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                  </TableCell>
                                  <TableCell className="font-bold text-purple-700">
                                    AED {calculateCostPerKg().toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          <TableRow className="bg-gradient-to-r from-green-100 to-blue-100 font-bold">
                            <TableCell colSpan={2} className="text-right">TOTAL:</TableCell>
                            <TableCell>
                              {outputCategories.reduce((sum, cat) => sum + (parseFloat(cat.weight) || 0), 0).toFixed(2)} kg
                            </TableCell>
                            <TableCell>100%</TableCell>
                            <TableCell className="text-green-700">
                              AED {calculateGrandTotalCost().toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </TableCell>
                            <TableCell>—</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                          <p className="font-semibold">Example:</p>
                          <p className="mt-1">
                            If total cost is AED {calculateGrandTotalCost().toLocaleString()} and total weight is {outputCategories.reduce((sum, cat) => sum + (parseFloat(cat.weight) || 0), 0).toFixed(2)}kg,
                            then each kg costs AED {calculateCostPerKg().toLocaleString(undefined, {minimumFractionDigits: 2})}.
                            This cost is distributed proportionally across all outputs based on weight.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input id="notes" placeholder="Additional notes or special instructions..." />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsNewSegregationDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Handle form submission here
                  setIsNewSegregationDialogOpen(false);
                  // Show success message or redirect
                }}>
                  Start Segregation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl">{segregationSummary.inProgress}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">
              {segregationSummary.completedToday} completed today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Wastage</CardDescription>
            <CardTitle className="text-3xl">{segregationSummary.avgWastage}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100 - segregationSummary.avgWastage} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {(100 - segregationSummary.avgWastage).toFixed(1)}% recovery rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Output SKUs Created</CardDescription>
            <CardTitle className="text-3xl">{segregationSummary.outputSKUs}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Value (Month)</CardDescription>
            <CardTitle className="text-3xl">AED {(segregationSummary.totalValue / 1000).toFixed(0)}K</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">
              From {segregationSummary.completedThisMonth} batches
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="active">Active Segregation</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="grades">Grade Definitions</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Segregation Processes</CardTitle>
              <CardDescription>Currently running segregation batches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSegregation.map((seg) => (
                  <div
                    key={seg.id}
                    className="space-y-3 p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors group"
                    onClick={() => {
                      setSelectedSegregation(seg);
                      setIsSegregationDetailOpen(true);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-gray-900">{seg.id}</h3>
                          <Badge variant="outline">{seg.batchNo}</Badge>
                          <Badge variant="default" className="bg-blue-600 text-white">
                            <Activity className="h-3 w-3 mr-1" />
                            {seg.stage}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-gray-900">{seg.rawMaterial}</p>
                        <p className="text-xs text-gray-700 group-hover:text-gray-800">
                          Input: {seg.inputWeight} kg • Operator: {seg.operator} • Started: {seg.startDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary group-hover:text-primary">{seg.progress}%</p>
                        <p className="text-xs text-gray-600 group-hover:text-gray-700">Complete</p>
                      </div>
                    </div>
                    <Progress value={seg.progress} />
                    <div className="flex items-center justify-between pt-2 text-sm">
                      <span className="text-gray-700 group-hover:text-gray-800">Expected {seg.expectedOutputs} output grades</span>
                      <span className="text-gray-700 group-hover:text-gray-800">ETA: {seg.estimatedCompletion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedSegregation.map((seg) => (
            <Card
              key={seg.id}
              className="cursor-pointer hover:bg-blue-50 transition-colors group"
              onClick={() => {
                setSelectedSegregation(seg);
                setIsSegregationDetailOpen(true);
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-gray-900 group-hover:text-gray-900">{seg.id}</CardTitle>
                      <Badge variant="outline">{seg.batchNo}</Badge>
                      <Badge variant="default" className="bg-green-600 text-white">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                    <CardDescription className="mt-1 text-gray-700 group-hover:text-gray-800">
                      {seg.rawMaterial} • {seg.completedDate} • Operator: {seg.operator}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">AED {seg.totalValue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total value</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Input/Output Summary */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Input Weight</p>
                      <p className="text-xl font-bold">{seg.inputWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Output Weight</p>
                      <p className="text-xl font-bold text-green-600">{seg.totalOutputWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Wastage</p>
                      <p className="text-xl font-bold text-red-600">{seg.wastage} kg ({seg.wastagePercent}%)</p>
                    </div>
                  </div>

                  {/* Output Products Table */}
                  <div>
                    <h4 className="font-semibold mb-3">Output Products Created:</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Grade</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>% of Input</TableHead>
                          <TableHead>Estimated Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {seg.outputs.map((output, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  output.grade.includes('Premium')
                                    ? 'bg-purple-100 text-purple-700 border-purple-700'
                                    : output.grade.includes('Grade A')
                                    ? 'bg-blue-100 text-blue-700 border-blue-700'
                                    : output.grade.includes('Grade B')
                                    ? 'bg-green-100 text-green-700 border-green-700'
                                    : output.grade.includes('Powder')
                                    ? 'bg-orange-100 text-orange-700 border-orange-700'
                                    : 'bg-gray-100 text-gray-700 border-gray-700'
                                }
                              >
                                {output.grade}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{output.sku}</TableCell>
                            <TableCell className="font-semibold">{output.weight} kg</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{((output.weight / seg.inputWeight) * 100).toFixed(1)}%</span>
                                <Progress value={(output.weight / seg.inputWeight) * 100} className="w-16 h-2" />
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-green-600">
                              AED {output.value.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Reconciliation */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">Weight Reconciliation Complete</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {seg.outputs.length} SKUs auto-created and added to inventory
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Oud Grade Classification System</CardTitle>
              <CardDescription>Quality grading criteria and expected yields</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gradeDefinitions.map((grade) => (
                  <Card key={grade.grade} className={`${grade.bgColor} border-2`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className={grade.color}>{grade.grade}</CardTitle>
                        <Badge variant="outline" className="font-bold">
                          {grade.priceMultiplier} value
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Quality Criteria:</h4>
                        <ul className="space-y-1">
                          {grade.criteria.map((criterion, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <CheckCircle2 className={`h-4 w-4 ${grade.color} flex-shrink-0 mt-0.5`} />
                              <span>{criterion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Typical Yield</p>
                          <p className="font-semibold">{grade.avgYield}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Price Multiple</p>
                          <p className="font-semibold">{grade.priceMultiplier}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Segregation Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Multi-Output Tracking</h3>
                <p className="text-xs text-muted-foreground">
                  One batch creates multiple output SKUs automatically
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Weight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Weight Reconciliation</h3>
                <p className="text-xs text-muted-foreground">
                  Before/after weight tracking with wastage calculation
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Auto Stock Update</h3>
                <p className="text-xs text-muted-foreground">
                  Inventory automatically updated with new SKUs
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Grade-Specific Pricing</h3>
                <p className="text-xs text-muted-foreground">
                  Automatic pricing based on quality grade
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segregation Detail Dialog */}
      <Dialog open={isSegregationDetailOpen} onOpenChange={setIsSegregationDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Segregation Details - {selectedSegregation?.id}</DialogTitle>
            <DialogDescription>
              Complete information for segregation batch
            </DialogDescription>
          </DialogHeader>
          {selectedSegregation && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <Package className="h-4 w-4 text-primary" />
                    Batch Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Segregation ID:</span>
                      <span className="font-semibold text-gray-900">{selectedSegregation.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source Batch:</span>
                      <span className="font-semibold text-gray-900">{selectedSegregation.batchNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Raw Material:</span>
                      <span className="font-semibold text-gray-900">{selectedSegregation.rawMaterial}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operator:</span>
                      <span className="font-semibold text-gray-900">{selectedSegregation.operator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={selectedSegregation.status === 'completed' ? 'default' : 'secondary'}
                             className={selectedSegregation.status === 'completed' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}>
                        {selectedSegregation.status === 'completed' ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <Weight className="h-4 w-4 text-primary" />
                    Weight Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Input Weight:</span>
                      <span className="font-bold text-gray-900">{selectedSegregation.inputWeight} kg</span>
                    </div>
                    {selectedSegregation.totalOutputWeight && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Output Weight:</span>
                          <span className="font-bold text-gray-900">{selectedSegregation.totalOutputWeight} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Wastage:</span>
                          <span className="font-semibold text-red-600">{selectedSegregation.wastage} kg ({selectedSegregation.wastagePercent}%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Recovery Rate:</span>
                          <span className="font-semibold text-green-600">{(100 - selectedSegregation.wastagePercent).toFixed(1)}%</span>
                        </div>
                      </>
                    )}
                    {selectedSegregation.progress !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-bold text-primary">{selectedSegregation.progress}%</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Outputs Table (for completed) */}
              {selectedSegregation.outputs && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 text-gray-900">Output Breakdown</h3>
                  <Table className="table-modern">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grade</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Yield %</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSegregation.outputs.map((output: any, index: number) => (
                        <TableRow key={index} className="group">
                          <TableCell className="font-medium text-gray-900 group-hover:text-gray-900">{output.grade}</TableCell>
                          <TableCell className="text-gray-900 group-hover:text-gray-900">{output.weight} kg</TableCell>
                          <TableCell className="text-gray-900 group-hover:text-gray-900">
                            <Badge variant="outline">{output.sku}</Badge>
                          </TableCell>
                          <TableCell className="text-gray-900 group-hover:text-gray-900">
                            {((output.weight / selectedSegregation.inputWeight) * 100).toFixed(1)}%
                          </TableCell>
                          <TableCell className="font-semibold text-green-600 group-hover:text-green-700">
                            AED {output.value.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Total Value:</span>
                      <span className="text-xl font-bold text-green-600">AED {selectedSegregation.totalValue?.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Timeline (for in-progress) */}
              {selectedSegregation.stage && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 text-gray-900">Process Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Started</p>
                        <p className="text-xs text-gray-600">{selectedSegregation.startDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Current Stage: {selectedSegregation.stage}</p>
                        <Progress value={selectedSegregation.progress} className="w-full mt-2" />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-500">Expected Completion</p>
                        <p className="text-xs text-gray-600">{selectedSegregation.estimatedCompletion}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                {selectedSegregation.status === 'in-progress' && (
                  <>
                    <Button variant="outline">
                      Update Progress
                    </Button>
                    <Button>
                      Complete Segregation
                    </Button>
                  </>
                )}
                {selectedSegregation.status === 'completed' && (
                  <>
                    <Button variant="outline">
                      Print Report
                    </Button>
                    <Button variant="outline">
                      View Inventory Impact
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setIsSegregationDetailOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
