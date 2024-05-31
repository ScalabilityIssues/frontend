import { useEffect, useState } from "react";


interface IQrCodeProps { data?: Uint8Array, className?: string, alt: string }

export default function QrCode({ data, className, alt }: IQrCodeProps) {
    const [src, setSrc] = useState<string>();

    useEffect(() => {
        if (data) {
            const src = URL.createObjectURL(new Blob([data], { type: 'image/png' }));
            setSrc(src);
            return () => URL.revokeObjectURL(src);
        }
    }, [data]);

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} className={`qrcode ${className}`} alt={alt} />
    );
}