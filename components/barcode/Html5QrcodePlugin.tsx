'use client';

import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface Html5QrcodePluginProps {
  fps: number;
  qrbox: number;
  disableFlip: boolean;
  qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
  qrCodeErrorCallback?: (errorMessage: string) => void;
}

const Html5QrcodePlugin = ({
  fps,
  qrbox,
  disableFlip,
  qrCodeSuccessCallback,
  qrCodeErrorCallback,
}: Html5QrcodePluginProps) => {
  const qrcodeRegionId = 'html5qr-code-full-region';

  useEffect(() => {
    const config = {
      fps,
      qrbox: { width: qrbox, height: qrbox },
      disableFlip,
      rememberLastUsedCamera: true,
      supportedScanTypes: [],
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      false
    );

    html5QrcodeScanner.render(
      qrCodeSuccessCallback,
      qrCodeErrorCallback
    );

    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error('Failed to clear scanner:', error);
      });
    };
  }, [fps, qrbox, disableFlip, qrCodeSuccessCallback, qrCodeErrorCallback]);

  return (
    <div className="w-full">
      <div id={qrcodeRegionId} className="w-full" />
    </div>
  );
};

export default Html5QrcodePlugin;
