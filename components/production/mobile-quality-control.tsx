'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Smartphone,
  Camera,
  Mic,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Star,
  Upload,
  Download,
  QrCode,
  Thermometer,
  Droplets,
  FlaskConical,
  Eye,
  Nose,
  Palette,
  Scale,
  Timer,
  MapPin,
  User,
  Wifi,
  WifiOff
} from 'lucide-react';
import {
  ProductionBatch,
  QualityControl,
  QualityResult,
  CreateQualityControlData
} from '@/types/production';
import { format } from 'date-fns';

interface MobileQCTest {
  id: string;
  name: string;
  category: 'visual' | 'olfactory' | 'physical' | 'chemical' | 'compliance';
  icon: React.ReactNode;
  description: string;
  instructions: string[];
  duration: number; // in minutes
  requiredEquipment?: string[];
  mobileOptimized: boolean;
  complianceStandard?: string;
}

interface QCTestResult {
  testId: string;
  score: number;
  result: QualityResult;
  notes: string;
  images: string[];
  audioNotes?: string;
  location?: { lat: number; lng: number };
  timestamp: Date;
  inspector: string;
}

interface MobileQualityControlProps {
  batches: ProductionBatch[];
  qualityControls: QualityControl[];
  onCreateQualityControl: (data: CreateQualityControlData) => void;
  onUpdateQualityControl: (id: string, data: Partial<QualityControl>) => void;
  onUploadImages: (images: File[]) => Promise<string[]>;
  onUploadAudio: (audio: File) => Promise<string>;
}

const MobileQualityControl: React.FC<MobileQualityControlProps> = ({
  batches,
  qualityControls,
  onCreateQualityControl,
  onUpdateQualityControl,
  onUploadImages,
  onUploadAudio
}) => {
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);
  const [isTestingMode, setIsTestingMode] = useState(false);
  const [currentTest, setCurrentTest] = useState<MobileQCTest | null>(null);
  const [testResults, setTestResults] = useState<QCTestResult[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [geolocation, setGeolocation] = useState<{ lat: number; lng: number } | null>(null);
  const [inspector, setInspector] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Mobile-optimized QC tests for perfume and oud products
  const mobileQCTests: MobileQCTest[] = [
    {
      id: 'visual-clarity',
      name: 'Visual Clarity Check',
      category: 'visual',
      icon: <Eye className="w-5 h-5" />,
      description: 'Assess visual appearance, clarity, and color',
      instructions: [
        'Hold bottle against white background',
        'Check for particles or cloudiness',
        'Assess color consistency',
        'Take photo from multiple angles',
        'Rate clarity from 1-10'
      ],
      duration: 5,
      mobileOptimized: true,
      complianceStandard: 'UAE-ESMA'
    },
    {
      id: 'fragrance-profile',
      name: 'Fragrance Profile Assessment',
      category: 'olfactory',
      icon: <Nose className="w-5 h-5" />,
      description: 'Evaluate scent profile and intensity',
      instructions: [
        'Allow sample to reach room temperature',
        'Test initial impression (top notes)',
        'Wait 5 minutes, test again (heart notes)',
        'Wait 15 minutes, test base notes',
        'Record audio notes during testing',
        'Rate overall quality 1-10'
      ],
      duration: 20,
      mobileOptimized: true
    },
    {
      id: 'color-consistency',
      name: 'Color Consistency',
      category: 'visual',
      icon: <Palette className="w-5 h-5" />,
      description: 'Check color matching against standards',
      instructions: [
        'Compare with reference color chart',
        'Use standardized lighting',
        'Take photo with color reference',
        'Note any variations',
        'Rate color accuracy 1-10'
      ],
      duration: 5,
      mobileOptimized: true
    },
    {
      id: 'specific-gravity',
      name: 'Specific Gravity Test',
      category: 'physical',
      icon: <Scale className="w-5 h-5" />,
      description: 'Measure density and specific gravity',
      instructions: [
        'Use digital hydrometer or scale',
        'Ensure sample is at 20°C',
        'Take 3 measurements',
        'Calculate average',
        'Compare against specifications'
      ],
      duration: 10,
      requiredEquipment: ['Digital hydrometer', 'Thermometer'],
      mobileOptimized: false
    },
    {
      id: 'alcohol-content',
      name: 'Alcohol Content Verification',
      category: 'chemical',
      icon: <FlaskConical className="w-5 h-5" />,
      description: 'Verify alcohol percentage',
      instructions: [
        'Use refractometer or digital meter',
        'Calibrate equipment',
        'Take measurement at room temperature',
        'Record percentage',
        'Verify against recipe specifications'
      ],
      duration: 5,
      requiredEquipment: ['Refractometer', 'Calibration solution'],
      mobileOptimized: false,
      complianceStandard: 'UAE-ESMA'
    },
    {
      id: 'ph-test',
      name: 'pH Level Test',
      category: 'chemical',
      icon: <Thermometer className="w-5 h-5" />,
      description: 'Test pH levels for stability',
      instructions: [
        'Use pH meter or strips',
        'Ensure sample temperature is stable',
        'Take multiple readings',
        'Record pH value',
        'Check against acceptable range'
      ],
      duration: 5,
      requiredEquipment: ['pH meter', 'pH strips'],
      mobileOptimized: true
    },
    {
      id: 'packaging-inspection',
      name: 'Packaging Inspection',
      category: 'visual',
      icon: <FileText className="w-5 h-5" />,
      description: 'Inspect packaging quality and labeling',
      instructions: [
        'Check bottle for defects',
        'Verify label placement and quality',
        'Check spray mechanism (if applicable)',
        'Verify batch number and expiry date',
        'Take photos of any issues'
      ],
      duration: 10,
      mobileOptimized: true,
      complianceStandard: 'UAE-ESMA'
    },
    {
      id: 'leak-test',
      name: 'Leak Test',
      category: 'physical',
      icon: <Droplets className="w-5 h-5" />,
      description: 'Test for leaks in packaging',
      instructions: [
        'Invert bottle for 2 minutes',
        'Check for any leakage',
        'Test spray mechanism',
        'Check cap seal integrity',
        'Document any issues'
      ],
      duration: 5,
      mobileOptimized: true
    }
  ];

  // Check if device supports required features
  const checkDeviceCapabilities = () => {
    const capabilities = {
      camera: !!navigator.mediaDevices?.getUserMedia,
      microphone: !!navigator.mediaDevices?.getUserMedia,
      geolocation: !!navigator.geolocation,
      storage: !!window.localStorage,
      offline: 'serviceWorker' in navigator
    };
    return capabilities;
  };

  const capabilities = checkDeviceCapabilities();

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  React.useEffect(() => {
    getCurrentLocation();

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const startTest = (test: MobileQCTest) => {
    setCurrentTest(test);
    setIsTestingMode(true);
  };

  const completeTest = async (result: QCTestResult) => {
    setTestResults(prev => [...prev, result]);
    setCurrentTest(null);
    setIsTestingMode(false);

    // Auto-save if online
    if (isOnline && selectedBatch) {
      try {
        await onCreateQualityControl({
          batchId: selectedBatch.id,
          testType: result.testId,
          testDate: result.timestamp,
          result: result.result,
          score: result.score,
          notes: result.notes,
          testedBy: result.inspector
        });
      } catch (error) {
        console.error('Failed to save test result:', error);
        // Store in local storage for later sync
        const offlineTests = JSON.parse(localStorage.getItem('offlineQCTests') || '[]');
        offlineTests.push(result);
        localStorage.setItem('offlineQCTests', JSON.stringify(offlineTests));
      }
    }
  };

  const syncOfflineTests = async () => {
    const offlineTests = JSON.parse(localStorage.getItem('offlineQCTests') || '[]');
    for (const test of offlineTests) {
      try {
        await onCreateQualityControl({
          batchId: test.batchId,
          testType: test.testId,
          testDate: test.timestamp,
          result: test.result,
          score: test.score,
          notes: test.notes,
          testedBy: test.inspector
        });
      } catch (error) {
        console.error('Failed to sync test:', error);
        break; // Stop syncing if network fails
      }
    }
    localStorage.removeItem('offlineQCTests');
  };

  const getTestsByCategory = (category: string) => {
    return mobileQCTests.filter(test => test.category === category);
  };

  const getCategoryStats = (category: string) => {
    const categoryTests = getTestsByCategory(category);
    const completedTests = testResults.filter(result =>
      categoryTests.some(test => test.id === result.testId)
    );

    return {
      total: categoryTests.length,
      completed: completedTests.length,
      averageScore: completedTests.length > 0
        ? completedTests.reduce((sum, result) => sum + result.score, 0) / completedTests.length
        : 0
    };
  };

  const generateQRCode = (batch: ProductionBatch) => {
    const data = {
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      recipe: batch.recipe?.name,
      timestamp: new Date().toISOString()
    };
    return `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
  };

  return (
    <div className="space-y-6">
      {/* Mobile Status Bar */}
      <div className="bg-gray-100 p-3 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Smartphone className="w-4 h-4" />
              <span>Mobile QC</span>
            </div>
            <div className="flex items-center gap-1">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">Offline</span>
                </>
              )}
            </div>
            {geolocation && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600">Located</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isOnline && (
              <Button size="sm" variant="outline" onClick={syncOfflineTests}>
                <Upload className="w-4 h-4 mr-1" />
                Sync
              </Button>
            )}
            <Button size="sm" variant="outline">
              <QrCode className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Device Capabilities Check */}
      <Alert>
        <Smartphone className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-1">
            <p>Mobile capabilities:</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant={capabilities.camera ? "default" : "destructive"}>
                📷 Camera {capabilities.camera ? "✓" : "✗"}
              </Badge>
              <Badge variant={capabilities.microphone ? "default" : "destructive"}>
                🎤 Microphone {capabilities.microphone ? "✓" : "✗"}
              </Badge>
              <Badge variant={capabilities.geolocation ? "default" : "destructive"}>
                📍 Location {capabilities.geolocation ? "✓" : "✗"}
              </Badge>
              <Badge variant={capabilities.offline ? "default" : "destructive"}>
                📴 Offline {capabilities.offline ? "✓" : "✗"}
              </Badge>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Batch Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Batch for Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select
              value={selectedBatch?.id || ''}
              onValueChange={(value) => {
                const batch = batches.find(b => b.id === value);
                setSelectedBatch(batch || null);
                setTestResults([]); // Reset test results for new batch
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose batch to test" />
              </SelectTrigger>
              <SelectContent>
                {batches.map(batch => (
                  <SelectItem key={batch.id} value={batch.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{batch.batchNumber}</span>
                      <Badge variant="outline" className="ml-2">
                        {batch.recipe?.name || 'Custom'}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedBatch && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Batch:</p>
                    <p className="font-medium">{selectedBatch.batchNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Quantity:</p>
                    <p className="font-medium">{selectedBatch.plannedQuantity} {selectedBatch.unit}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Recipe:</p>
                    <p className="font-medium">{selectedBatch.recipe?.name || 'Custom'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status:</p>
                    <Badge variant="outline">{selectedBatch.status}</Badge>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="inspector">Inspector Name</Label>
              <Input
                id="inspector"
                value={inspector}
                onChange={(e) => setInspector(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedBatch && (
        <>
          {/* QC Test Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="visual" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="visual">Visual</TabsTrigger>
                  <TabsTrigger value="olfactory">Olfactory</TabsTrigger>
                  <TabsTrigger value="physical">Physical</TabsTrigger>
                  <TabsTrigger value="chemical">Chemical</TabsTrigger>
                </TabsList>

                {['visual', 'olfactory', 'physical', 'chemical'].map(category => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Tests:</p>
                          <p className="font-medium">
                            {getCategoryStats(category).completed}/{getCategoryStats(category).total}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Progress:</p>
                          <Progress
                            value={(getCategoryStats(category).completed / getCategoryStats(category).total) * 100}
                            className="w-full mt-1"
                          />
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Score:</p>
                          <p className="font-medium">
                            {getCategoryStats(category).averageScore.toFixed(1)}/10
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getTestsByCategory(category).map(test => {
                        const isCompleted = testResults.some(result => result.testId === test.id);
                        const testResult = testResults.find(result => result.testId === test.id);

                        return (
                          <Card key={test.id} className={`border ${isCompleted ? 'border-green-200 bg-green-50' : ''}`}>
                            <CardContent className="pt-4">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-2">
                                    {test.icon}
                                    <div>
                                      <h4 className="font-medium">{test.name}</h4>
                                      <p className="text-sm text-gray-600">{test.description}</p>
                                    </div>
                                  </div>
                                  {isCompleted && (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  )}
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Timer className="w-4 h-4" />
                                    {test.duration}min
                                  </div>
                                  {test.mobileOptimized && (
                                    <div className="flex items-center gap-1">
                                      <Smartphone className="w-4 h-4" />
                                      Mobile
                                    </div>
                                  )}
                                  {test.complianceStandard && (
                                    <Badge variant="outline" className="text-xs">
                                      {test.complianceStandard}
                                    </Badge>
                                  )}
                                </div>

                                {test.requiredEquipment && (
                                  <div className="text-xs text-orange-600">
                                    Equipment: {test.requiredEquipment.join(', ')}
                                  </div>
                                )}

                                {isCompleted && testResult ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Star className="w-4 h-4 text-yellow-500" />
                                      <span className="font-medium">{testResult.score}/10</span>
                                      <Badge variant={
                                        testResult.result === QualityResult.PASS ? 'default' :
                                        testResult.result === QualityResult.FAIL ? 'destructive' : 'secondary'
                                      }>
                                        {testResult.result}
                                      </Badge>
                                    </div>
                                    <Button size="sm" variant="outline" className="w-full">
                                      <Eye className="w-4 h-4 mr-1" />
                                      View Results
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="w-full"
                                    onClick={() => startTest(test)}
                                    disabled={!inspector}
                                  >
                                    Start Test
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Test Results Summary */}
          {testResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {testResults.filter(r => r.result === QualityResult.PASS).length}
                      </p>
                      <p className="text-sm text-gray-600">Passed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {testResults.filter(r => r.result === QualityResult.FAIL).length}
                      </p>
                      <p className="text-sm text-gray-600">Failed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {(testResults.reduce((sum, r) => sum + r.score, 0) / testResults.length).toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-600">Avg Score</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                    <Button className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Certificate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Test Execution Modal */}
      {currentTest && isTestingMode && (
        <TestExecutionModal
          test={currentTest}
          batch={selectedBatch!}
          inspector={inspector}
          onComplete={completeTest}
          onCancel={() => {
            setCurrentTest(null);
            setIsTestingMode(false);
          }}
          capabilities={capabilities}
          geolocation={geolocation}
          onUploadImages={onUploadImages}
          onUploadAudio={onUploadAudio}
        />
      )}
    </div>
  );
};

// Test Execution Modal Component
interface TestExecutionModalProps {
  test: MobileQCTest;
  batch: ProductionBatch;
  inspector: string;
  onComplete: (result: QCTestResult) => void;
  onCancel: () => void;
  capabilities: any;
  geolocation: { lat: number; lng: number } | null;
  onUploadImages: (images: File[]) => Promise<string[]>;
  onUploadAudio: (audio: File) => Promise<string>;
}

const TestExecutionModal: React.FC<TestExecutionModalProps> = ({
  test,
  batch,
  inspector,
  onComplete,
  onCancel,
  capabilities,
  geolocation,
  onUploadImages,
  onUploadAudio
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(5);
  const [result, setResult] = useState<QualityResult>(QualityResult.PENDING);
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [audioNote, setAudioNote] = useState<string>('');
  const [startTime] = useState(new Date());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      try {
        const uploadedUrls = await onUploadImages(files);
        setImages(prev => [...prev, ...uploadedUrls]);
      } catch (error) {
        console.error('Failed to upload images:', error);
      }
    }
  };

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const audioUrl = await onUploadAudio(file);
        setAudioNote(audioUrl);
      } catch (error) {
        console.error('Failed to upload audio:', error);
      }
    }
  };

  const handleComplete = () => {
    const testResult: QCTestResult = {
      testId: test.id,
      score,
      result,
      notes,
      images,
      audioNotes: audioNote,
      location: geolocation,
      timestamp: new Date(),
      inspector
    };

    onComplete(testResult);
  };

  const nextStep = () => {
    if (currentStep < test.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {test.icon}
            {test.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep + 1} of {test.instructions.length}</span>
              <span>{Math.round(((currentStep + 1) / test.instructions.length) * 100)}%</span>
            </div>
            <Progress value={((currentStep + 1) / test.instructions.length) * 100} />
          </div>

          {/* Current Instruction */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Current Step:</h3>
                <p className="text-lg">{test.instructions[currentStep]}</p>

                {/* Step-specific controls */}
                {test.instructions[currentStep].toLowerCase().includes('photo') && capabilities.camera && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {images.length > 0 && (
                      <p className="text-sm text-green-600">
                        {images.length} photo(s) captured
                      </p>
                    )}
                  </div>
                )}

                {test.instructions[currentStep].toLowerCase().includes('audio') && capabilities.microphone && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => audioInputRef.current?.click()}
                      className="w-full"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Record Audio Note
                    </Button>
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                    {audioNote && (
                      <p className="text-sm text-green-600">
                        Audio note recorded
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            {currentStep === test.instructions.length - 1 ? (
              <Button onClick={() => setCurrentStep(-1)}>
                Complete Instructions
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
              </Button>
            )}
          </div>

          {/* Final Scoring (after instructions) */}
          {currentStep === -1 && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Quality Score (1-10)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={score}
                      onChange={(e) => setScore(parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className="font-medium w-12">{score}/10</span>
                  </div>
                </div>

                <div>
                  <Label>Result</Label>
                  <Select value={result} onValueChange={(value: QualityResult) => setResult(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={QualityResult.PASS}>Pass</SelectItem>
                      <SelectItem value={QualityResult.FAIL}>Fail</SelectItem>
                      <SelectItem value={QualityResult.RETEST_REQUIRED}>Retest Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add detailed observations..."
                    rows={3}
                  />
                </div>

                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>Inspector: {inspector}</div>
                    <div>Duration: {Math.round((Date.now() - startTime.getTime()) / 60000)}min</div>
                    <div>Images: {images.length}</div>
                    <div>Audio: {audioNote ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={onCancel} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleComplete} className="flex-1">
                    Complete Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileQualityControl;