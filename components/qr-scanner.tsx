// file = Html5QrcodePlugin.jsx
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats, QrcodeErrorCallback, QrcodeSuccessCallback } from 'html5-qrcode';
import { Html5QrcodeScannerConfig } from 'html5-qrcode/esm/html5-qrcode-scanner';
import { useEffect } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

interface IQrScannerProps {
    successCallback: QrcodeSuccessCallback, errorCallback?: QrcodeErrorCallback,
    fps?: number, qrbox?: number, aspectRatio?: number, disableFlip?: boolean,
}

const Html5QrcodePlugin = (props: IQrScannerProps) => {

    useEffect(() => {
        const { fps, qrbox, aspectRatio, disableFlip } = props;

        const config: Html5QrcodeScannerConfig = {
            fps: fps || 4,
            qrbox: qrbox || 600,
            aspectRatio,
            disableFlip,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            useBarCodeDetectorIfSupported: true,
        };

        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, false);
        html5QrcodeScanner.render(props.successCallback, props.errorCallback);

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => console.error("Failed to clear html5QrcodeScanner. ", error));
        };
    }, [props]);

    return (
        <div id={qrcodeRegionId} />
    );
};

export default Html5QrcodePlugin;