import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  X,
  Flashlight,
  FlashlightOff,
  RotateCcw,
  Keyboard,
  Maximize,
  Minimize,
  Focus,
  ScanLine,
  CheckCircle,
  AlertCircle,
  Zap,
  Settings,
  Image as ImageIcon,
  Upload,
  Download,
  RefreshCw,
  Volume2,
  VolumeX
} from 'lucide-react';

const AdvancedBarcodeScanner = ({
  onBarcodeScanned,
  onClose,
  mode = 'camera',
  enableMultiScan = false,
  enableBatchScan = false,
  enableImageUpload = true,
  enableContinuousMode = false,
  supportedFormats = ['code_128', 'ean', 'upc', 'code_39', 'qr_code'],
  onScanHistory,
  onSettings
}) => {
  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scannerMode, setScannerMode] = useState(mode);
  const [scannerReady, setScannerReady] = useState(false);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [lastScannedCode, setLastScannedCode] = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const [multiScanResults, setMultiScanResults] = useState([]);

  // Camera state
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [autoFocus, setAutoFocus] = useState(true);
  const [cameraConstraints, setCameraConstraints] = useState({
    width: { ideal: 1280, max: 1920 },
    height: { ideal: 720, max: 1080 },
    facingMode: 'environment'
  });

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [continuousMode, setContinuousMode] = useState(enableContinuousMode);
  const [batchMode, setBatchMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);

  // Advanced features state
  const [scanQuality, setScanQuality] = useState('auto');
  const [processingSpeed, setProcessingSpeed] = useState('fast');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.8);
  const [duplicateFilter, setDuplicateFilter] = useState(true);
  const [autoCorrection, setAutoCorrection] = useState(true);

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const manualInputRef = useRef(null);
  const scannerInstanceRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Initialize scanner
  useEffect(() => {
    if (scannerMode === 'camera') {
      initializeScanner();
    } else if (scannerMode === 'manual' && manualInputRef.current) {
      manualInputRef.current.focus();
    }

    return () => {
      cleanup();
    };
  }, [scannerMode, selectedCamera]);

  // Initialize audio context for beep sounds
  useEffect(() => {
    if (soundEnabled && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Audio context not supported');
      }
    }
  }, [soundEnabled]);

  const initializeScanner = async () => {
    try {
      setError(null);
      setScannerReady(false);

      // Get available cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(cameras);

      if (cameras.length === 0) {
        throw new Error('No cameras found');
      }

      // Select camera
      let cameraId = selectedCamera;
      if (!cameraId) {
        // Prefer back camera
        const backCamera = cameras.find(camera =>
          camera.label.toLowerCase().includes('back') ||
          camera.label.toLowerCase().includes('rear') ||
          camera.label.toLowerCase().includes('environment')
        );
        cameraId = backCamera ? backCamera.deviceId : cameras[0].deviceId;
        setSelectedCamera(cameraId);
      }

      // Request camera access with advanced constraints
      const constraints = {
        video: {
          ...cameraConstraints,
          deviceId: cameraId ? { exact: cameraId } : undefined,
          zoom: zoomLevel !== 1 ? zoomLevel : undefined,
          focusMode: autoFocus ? 'continuous' : 'manual',
          exposureMode: 'continuous',
          whiteBalanceMode: 'continuous'
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.addEventListener('loadedmetadata', handleVideoLoaded);
      }

      // Initialize barcode detection library
      await initializeBarcodeDetection();

    } catch (err) {
      console.error('Scanner initialization error:', err);
      setError(err.message);
      setScannerMode('manual');
    }
  };

  const handleVideoLoaded = () => {
    setScannerReady(true);
    if (continuousMode || batchMode) {
      startScanning();
    }
  };

  const initializeBarcodeDetection = async () => {
    if (!videoRef.current) return;

    try {
      // Try to use native BarcodeDetector API if available
      if ('BarcodeDetector' in window) {
        const detector = new BarcodeDetector({
          formats: supportedFormats
        });
        scannerInstanceRef.current = { type: 'native', detector };
        console.log('Using native BarcodeDetector API');
        return;
      }

      // Fallback to QuaggaJS
      if (window.Quagga) {
        await initializeQuagga();
        return;
      }

      // Fallback to ZXing (if available)
      if (window.ZXing) {
        await initializeZXing();
        return;
      }

      console.warn('No barcode detection library available');
      setScannerReady(true);

    } catch (error) {
      console.error('Barcode detection initialization error:', error);
      setError('Failed to initialize barcode detection');
    }
  };

  const initializeQuagga = () => {
    return new Promise((resolve, reject) => {
      const config = {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current,
          constraints: {
            width: cameraConstraints.width.ideal,
            height: cameraConstraints.height.ideal,
            facingMode: cameraConstraints.facingMode
          }
        },
        decoder: {
          readers: supportedFormats.map(format => {
            const readerMap = {
              'code_128': 'code_128_reader',
              'ean': 'ean_reader',
              'upc': 'upc_reader',
              'code_39': 'code_39_reader',
              'qr_code': 'qr_reader'
            };
            return readerMap[format] || format + '_reader';
          }).filter(Boolean)
        },
        locator: {
          patchSize: scanQuality === 'high' ? 'large' : 'medium',
          halfSample: processingSpeed === 'fast'
        },
        numOfWorkers: navigator.hardwareConcurrency || 2,
        frequency: processingSpeed === 'fast' ? 20 : 10,
        locate: true,
        multiple: enableMultiScan
      };

      window.Quagga.init(config, (err) => {
        if (err) {
          reject(err);
          return;
        }

        window.Quagga.start();
        scannerInstanceRef.current = { type: 'quagga', instance: window.Quagga };

        // Set up barcode detection
        window.Quagga.onDetected(handleBarcodeDetected);
        resolve();
      });
    });
  };

  const initializeZXing = async () => {
    try {
      const codeReader = new window.ZXing.BrowserMultiFormatReader();
      scannerInstanceRef.current = { type: 'zxing', reader: codeReader };
      console.log('Using ZXing barcode reader');
    } catch (error) {
      throw new Error('Failed to initialize ZXing reader');
    }
  };

  const startScanning = () => {
    if (!scannerReady) return;

    setIsScanning(true);

    if (scannerInstanceRef.current?.type === 'native') {
      startNativeScanning();
    } else if (scannerInstanceRef.current?.type === 'zxing') {
      startZXingScanning();
    }
    // QuaggaJS starts automatically when initialized
  };

  const startNativeScanning = () => {
    const scanFrame = async () => {
      if (!isScanning || !videoRef.current || !canvasRef.current) return;

      try {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const barcodes = await scannerInstanceRef.current.detector.detect(imageData);

        if (barcodes.length > 0) {
          for (const barcode of barcodes) {
            if (barcode.rawValue && (!duplicateFilter || barcode.rawValue !== lastScannedCode)) {
              handleBarcodeDetected({
                codeResult: { code: barcode.rawValue },
                format: barcode.format,
                boundingBox: barcode.boundingBox
              });

              if (!continuousMode && !batchMode) break;
            }
          }
        }

        if (isScanning) {
          animationFrameRef.current = requestAnimationFrame(scanFrame);
        }
      } catch (error) {
        console.error('Native scanning error:', error);
      }
    };

    scanFrame();
  };

  const startZXingScanning = () => {
    const reader = scannerInstanceRef.current.reader;

    const scanContinuously = () => {
      if (!isScanning) return;

      reader.decodeFromVideoDevice(selectedCamera, videoRef.current.id, (result, err) => {
        if (result) {
          handleBarcodeDetected({
            codeResult: { code: result.text },
            format: result.format
          });
        }

        if (continuousMode || batchMode) {
          setTimeout(scanContinuously, 100);
        }
      });
    };

    scanContinuously();
  };

  const stopScanning = () => {
    setIsScanning(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (scannerInstanceRef.current?.type === 'quagga') {
      scannerInstanceRef.current.instance.stop();
    } else if (scannerInstanceRef.current?.type === 'zxing') {
      scannerInstanceRef.current.reader.reset();
    }
  };

  const handleBarcodeDetected = (result) => {
    const code = result.codeResult.code;
    const format = result.format || 'unknown';

    if (!code || (duplicateFilter && code === lastScannedCode)) return;

    // Quality check
    if (result.codeResult.quality && result.codeResult.quality < confidenceThreshold) {
      return;
    }

    // Auto-correction
    let correctedCode = code;
    if (autoCorrection) {
      correctedCode = applyAutoCorrection(code);
    }

    setLastScannedCode(correctedCode);

    const scanResult = {
      code: correctedCode,
      originalCode: code,
      format,
      timestamp: new Date().toISOString(),
      quality: result.codeResult.quality || 1
    };

    // Add to history
    setScanHistory(prev => [scanResult, ...prev.slice(0, 9)]);

    // Play sound feedback
    if (soundEnabled) {
      playSuccessSound();
    }

    // Vibrate feedback
    if (vibrateEnabled && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    if (batchMode) {
      setMultiScanResults(prev => [...prev, scanResult]);
    } else {
      onBarcodeScanned(correctedCode, scanResult);

      if (!continuousMode) {
        stopScanning();
      }
    }
  };

  const applyAutoCorrection = (code) => {
    // Basic auto-correction logic
    let corrected = code.trim().toUpperCase();

    // Remove common OCR errors
    corrected = corrected.replace(/[O0]/g, '0'); // Replace O with 0
    corrected = corrected.replace(/[Il1]/g, '1'); // Replace I, l with 1

    // Validate and fix check digits if possible
    if (/^\d{12,13}$/.test(corrected)) {
      // EAN/UPC check digit validation and correction
      const checkDigit = calculateEANCheckDigit(corrected.slice(0, -1));
      if (checkDigit !== corrected.slice(-1)) {
        corrected = corrected.slice(0, -1) + checkDigit;
      }
    }

    return corrected;
  };

  const calculateEANCheckDigit = (digits) => {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      const digit = parseInt(digits[i]);
      sum += (i % 2 === 0) ? digit : digit * 3;
    }
    return ((10 - (sum % 10)) % 10).toString();
  };

  const playSuccessSound = () => {
    if (!audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      oscillator.frequency.setValueAtTime(1200, audioContextRef.current.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.3);
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  };

  const cleanup = () => {
    stopScanning();

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (scannerInstanceRef.current?.type === 'quagga') {
      scannerInstanceRef.current.instance.stop();
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const toggleFlashlight = async () => {
    if (!stream) return;

    try {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !flashEnabled }]
        });
        setFlashEnabled(!flashEnabled);
      }
    } catch (error) {
      console.error('Failed to toggle flashlight:', error);
    }
  };

  const handleZoom = (delta) => {
    if (!stream) return;

    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();

    if (capabilities.zoom) {
      const newZoom = Math.max(
        capabilities.zoom.min,
        Math.min(capabilities.zoom.max, zoomLevel + delta)
      );

      track.applyConstraints({
        advanced: [{ zoom: newZoom }]
      }).then(() => {
        setZoomLevel(newZoom);
      });
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if (scannerInstanceRef.current?.type === 'native') {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const barcodes = await scannerInstanceRef.current.detector.detect(imageData);

          if (barcodes.length > 0) {
            handleBarcodeDetected({
              codeResult: { code: barcodes[0].rawValue },
              format: barcodes[0].format
            });
          } else {
            setError('No barcode found in image');
          }
        } else {
          setError('Image scanning not supported with current detection method');
        }
      };

      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('Image upload error:', error);
      setError('Failed to process image');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleBarcodeDetected({
        codeResult: { code: manualInput.trim() },
        format: 'manual'
      });
      setManualInput('');
    }
  };

  const switchMode = (newMode) => {
    stopScanning();
    cleanup();
    setScannerMode(newMode);
    setError(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const processBatchResults = () => {
    if (multiScanResults.length > 0) {
      onBarcodeScanned(multiScanResults);
      setMultiScanResults([]);
      setBatchMode(false);
    }
  };

  const ScannerControls = () => (
    <div className="flex items-center justify-center space-x-2 mb-4 flex-wrap">
      <button
        onClick={() => switchMode('camera')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          scannerMode === 'camera'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <Camera className="w-4 h-4 inline mr-2" />
        Camera
      </button>

      <button
        onClick={() => switchMode('manual')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          scannerMode === 'manual'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <Keyboard className="w-4 h-4 inline mr-2" />
        Manual
      </button>

      {enableImageUpload && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg font-medium transition-colors"
        >
          <ImageIcon className="w-4 h-4 inline mr-2" />
          Upload
        </button>
      )}
    </div>
  );

  const CameraScanner = () => (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-80 object-cover"
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: 'none' }}
        />

        {/* Scanning overlay */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-64 h-32 border-2 border-red-500 border-dashed animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <ScanLine className="w-8 h-8 text-red-500 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Corner guides */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-white opacity-70"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-white opacity-70"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-white opacity-70"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-white opacity-70"></div>
        </div>

        {/* Camera controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={toggleFlashlight}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
          >
            {flashEnabled ? (
              <FlashlightOff className="w-5 h-5" />
            ) : (
              <Flashlight className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={() => handleZoom(0.5)}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleZoom(-0.5)}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
          >
            <Minus className="w-5 h-5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Scanner status */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black bg-opacity-70 text-white px-3 py-2 rounded text-sm text-center">
            {isScanning ? (
              <div className="flex items-center justify-center space-x-2">
                <ScanLine className="w-4 h-4 animate-pulse" />
                <span>Scanning for barcodes...</span>
              </div>
            ) : (
              'Tap to start scanning'
            )}
          </div>
        </div>
      </div>

      {/* Scanner actions */}
      <div className="flex space-x-2 justify-center">
        {!isScanning ? (
          <button
            onClick={startScanning}
            disabled={!scannerReady}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Stop Scanning
          </button>
        )}

        {enableBatchScan && (
          <button
            onClick={() => setBatchMode(!batchMode)}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              batchMode
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Batch Mode {batchMode && `(${multiScanResults.length})`}
          </button>
        )}
      </div>

      {/* Batch results */}
      {batchMode && multiScanResults.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">
            Scanned Items ({multiScanResults.length}):
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {multiScanResults.map((result, index) => (
              <div key={index} className="text-xs font-mono bg-gray-100 p-2 rounded">
                {result.code} ({result.format})
              </div>
            ))}
          </div>
          <button
            onClick={processBatchResults}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Process Batch ({multiScanResults.length} items)
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={initializeScanner}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );

  const ManualScanner = () => (
    <div className="space-y-4">
      <form onSubmit={handleManualSubmit} className="space-y-4">
        <div>
          <label htmlFor="barcode-input" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Barcode Manually
          </label>
          <input
            ref={manualInputRef}
            id="barcode-input"
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Scan or type barcode here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={!manualInput.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-colors font-medium"
        >
          Add Product
        </button>
      </form>

      <div className="text-center text-sm text-gray-500">
        <p>You can also use a USB barcode scanner in this mode</p>
      </div>
    </div>
  );

  const ScanHistory = () => (
    scanHistory.length > 0 && (
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Scans</h4>
        <div className="max-h-40 overflow-y-auto space-y-2">
          {scanHistory.map((scan, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm"
            >
              <div>
                <div className="font-mono font-medium">{scan.code}</div>
                <div className="text-xs text-gray-500">{scan.format}</div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(scan.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Advanced Barcode Scanner</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-500" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Scanner Mode Controls */}
      <ScannerControls />

      {/* Scanner Interface */}
      {scannerMode === 'camera' ? <CameraScanner /> : <ManualScanner />}

      {/* Scan History */}
      <ScanHistory />

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      {/* Advanced Settings Panel */}
      {showSettings && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">Scanner Settings</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scan Quality
              </label>
              <select
                value={scanQuality}
                onChange={(e) => setScanQuality(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="auto">Auto</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="fast">Fast</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Processing Speed
              </label>
              <select
                value={processingSpeed}
                onChange={(e) => setProcessingSpeed(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="fast">Fast</option>
                <option value="balanced">Balanced</option>
                <option value="accurate">Accurate</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Sound feedback</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={vibrateEnabled}
                onChange={(e) => setVibrateEnabled(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Vibration feedback</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoCorrection}
                onChange={(e) => setAutoCorrection(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Auto correction</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={duplicateFilter}
                onChange={(e) => setDuplicateFilter(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Filter duplicates</span>
            </label>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Instructions</h4>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Point camera at barcode for automatic scanning</li>
          <li>• Use zoom controls for better focus on small barcodes</li>
          <li>• Enable flashlight in low-light conditions</li>
          <li>• Switch to manual mode for keyboard/USB scanner input</li>
          <li>• Use batch mode to scan multiple items quickly</li>
          <li>• Upload images containing barcodes for processing</li>
        </ul>
      </div>
    </div>
  );
};

export default AdvancedBarcodeScanner;