// file = Html5QrcodePlugin.jsx
import { Html5QrcodeScanner, Html5QrcodeScannerState, Html5QrcodeSupportedFormats, QrcodeErrorCallback, QrcodeSuccessCallback } from 'html5-qrcode';
import { Html5QrcodeScannerConfig } from 'html5-qrcode/esm/html5-qrcode-scanner';
import { useEffect, useState } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

interface IQrScannerProps {
    successCallback: QrcodeSuccessCallback, errorCallback?: QrcodeErrorCallback,
    scan?: boolean,
}

const Html5QrcodePlugin = ({ successCallback, errorCallback, scan }: IQrScannerProps) => {
    const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        const config: Html5QrcodeScannerConfig = {
            fps: 10,
            qrbox: 600,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            useBarCodeDetectorIfSupported: true,
        };

        const scanner = new Html5QrcodeScanner(qrcodeRegionId, config, false);
        scanner.render(successCallback, errorCallback);
        setScanner(scanner);

        // cleanup function when component will unmount
        return () => {
            scanner.clear().catch(error => console.error("Failed to clear html5QrcodeScanner. ", error));
        };
    }, [errorCallback, successCallback]);

    useEffect(() => {
        if (!scanner) return;
        if (!scan && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
            scanner.pause(false);
        } else if (scan && scanner.getState() === Html5QrcodeScannerState.PAUSED) {
            scanner.resume();
        }

    }, [scan, scanner]);

    return (
        <div id={qrcodeRegionId} />
    );
};

export default Html5QrcodePlugin;