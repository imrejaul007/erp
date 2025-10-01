import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Flashlight, FlashlightOff, RotateCcw, Keyboard } from 'lucide-react';

const BarcodeScanner = ({ onBarcodeScanned, onClose, mode = 'camera' }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [scannerMode, setScannerMode] = useState(mode);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [scannerReady, setScannerReady] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState('');
  const [scanHistory, setScanHistory] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scannerInstanceRef = useRef(null);
  const manualInputRef = useRef(null);

  // Initialize barcode scanner
  useEffect(() => {
    if (scannerMode === 'camera') {
      initializeScanner();
    } else {
      // Focus on manual input when in manual mode
      if (manualInputRef.current) {
        manualInputRef.current.focus();
      }
    }

    return () => {
      cleanup();
    };
  }, [scannerMode]);

  const initializeScanner = async () => {
    try {
      setError(null);

      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.addEventListener('loadedmetadata', () => {
          setScannerReady(true);
          startScanning();
        });
      }

      // Initialize QuaggaJS barcode scanner
      if (window.Quagga) {
        initializeQuagga();
      } else {
        // Fallback to basic manual scanning if QuaggaJS is not available
        console.warn('QuaggaJS not available, using manual scanning');
        setScannerReady(true);
      }

    } catch (err) {
      console.error('Scanner initialization error:', err);
      setError(err.message);
      // Fallback to manual input mode
      setScannerMode('manual');
    }
  };

  const initializeQuagga = () => {
    if (!videoRef.current) return;

    const config = {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: videoRef.current,
        constraints: {
          width: 640,
          height: 480,
          facingMode: "environment"
        }
      },
      decoder: {
        readers: [
          "code_128_reader",
          "ean_reader",
          "ean_8_reader",
          "code_39_reader",
          "code_39_vin_reader",
          "codabar_reader",
          "upc_reader",
          "upc_e_reader",
          "i2of5_reader"
        ]
      },
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      numOfWorkers: 2,
      frequency: 10,
      locate: true
    };

    window.Quagga.init(config, (err) => {
      if (err) {
        console.error('Quagga initialization error:', err);
        setError('Scanner initialization failed');
        return;
      }

      window.Quagga.start();
      scannerInstanceRef.current = window.Quagga;

      // Set up barcode detection
      window.Quagga.onDetected((result) => {
        const code = result.codeResult.code;
        if (code && code !== lastScannedCode) {
          handleBarcodeDetected(code);
        }
      });
    });
  };

  const startScanning = () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (scannerInstanceRef.current) {
      scannerInstanceRef.current.stop();
    }
  };

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (scannerInstanceRef.current) {
      scannerInstanceRef.current.stop();
    }
  };

  const handleBarcodeDetected = (code) => {
    if (!code || code === lastScannedCode) return;

    setLastScannedCode(code);
    setScanHistory(prev => [
      { code, timestamp: new Date().toLocaleTimeString() },
      ...prev.slice(0, 4) // Keep last 5 scans
    ]);

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    // Call the callback
    onBarcodeScanned(code);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleBarcodeDetected(manualInput.trim());
      setManualInput('');
    }
  };

  const toggleFlashlight = () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      if (track && track.getCapabilities().torch) {
        track.applyConstraints({
          advanced: [{ torch: !flashEnabled }]
        });
        setFlashEnabled(!flashEnabled);
      }
    }
  };

  const switchMode = (newMode) => {
    stopScanning();
    cleanup();
    setScannerMode(newMode);
    setError(null);
  };

  const ScannerControls = () => (
    <div className="flex items-center justify-center space-x-4 mb-4">
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
    </div>
  );

  const CameraScanner = () => (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-64 object-cover"
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
        <div className="absolute inset-0 border-2 border-red-500 border-dashed opacity-50">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-24 border-2 border-red-500"></div>
        </div>

        {/* Flash control */}
        <div className="absolute top-4 right-4">
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
        </div>

        {/* Scanner status */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black bg-opacity-70 text-white px-3 py-2 rounded text-sm text-center">
            {isScanning ? 'Scanning for barcodes...' : 'Initializing scanner...'}
          </div>
        </div>
      </div>

      {/* Retry button if error */}
      {error && (
        <button
          onClick={initializeScanner}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Camera</span>
        </button>
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
        <div className="space-y-2">
          {scanHistory.map((scan, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm"
            >
              <span className="font-mono">{scan.code}</span>
              <span className="text-gray-500">{scan.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Barcode Scanner</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Scanner Mode Controls */}
      <ScannerControls />

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Scanner Interface */}
      {scannerMode === 'camera' ? <CameraScanner /> : <ManualScanner />}

      {/* Scan History */}
      <ScanHistory />

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Instructions</h4>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Point camera at barcode for automatic scanning</li>
          <li>• Switch to manual mode for keyboard/USB scanner input</li>
          <li>• Ensure good lighting for better scan accuracy</li>
          <li>• Hold steady when scanning</li>
        </ul>
      </div>
    </div>
  );
};

export default BarcodeScanner;