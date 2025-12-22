    import { Html5QrcodeScanner } from "html5-qrcode";
    import { useEffect, useRef, useState } from "react";
    import { useNavigate } from "react-router-dom";

    function QrScanner({ onClose }) {
    const navigate = useNavigate();
    const scannerRef = useRef(null);
    const hasScannedRef = useRef(false);

    const [decodedText, setDecodedText] = useState("");
    const [parsedEventId, setParsedEventId] = useState(null);
    const [scanError, setScanError] = useState(null);

    useEffect(() => {
        if (scannerRef.current) return;

        const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        false
        );

        scannerRef.current = scanner;

        scanner.render(
        (text) => {
            if (hasScannedRef.current) return;

            const normalized = String(text || "").replace(/\s+/g, "");
            const match = normalized.match(/attendance\/([A-Za-z0-9-]+)/i);

            if (!match) {
            setScanError("Invalid QR code");
            return;
            }

            const eventId = match[1];
            hasScannedRef.current = true;

            setDecodedText(text);
            setParsedEventId(eventId);
            setScanError(null);

            // stop camera safely
            scanner
            .clear()
            .catch(() => {});

            // IMPORTANT: SPA navigation only
            navigate(`/attendance/${eventId}?from=qr`, { replace: true });
        },
        (error) => {
            setScanError(String(error || "scan_error"));
        }
        );

        return () => {
        scanner.clear().catch(() => {});
        };
    }, [navigate]);

    return (
        <div className="qr-box">
        <div id="qr-reader" />

        {scanError && (
            <div style={{ marginTop: 12, color: "salmon", fontSize: 14 }}>
            {scanError}
            </div>
        )}

        {parsedEventId && (
            <div style={{ marginTop: 8, fontSize: 12 }}>
            Event ID: <strong>{parsedEventId}</strong>
            </div>
        )}
        </div>
    );
    }

    export default QrScanner;
