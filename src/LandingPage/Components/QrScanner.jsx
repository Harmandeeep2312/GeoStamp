import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function QrScanner() {
    const navigate = useNavigate();

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
            fps: 10,
            qrbox: 250,
        },
        false
        );

        scanner.render(
        (decodedText) => {
            if (decodedText.includes("/attendance/")) {
            const eventId = decodedText.split("/attendance/")[1];
            scanner.clear();
            navigate(`/attendance/${eventId}`);
            }
        },
        (error) => {
        }
        );

        return () => {
        scanner.clear().catch(() => {});
        };
    }, []);

    return (
        <div className="qr-box">
        <div id="qr-reader" />
        </div>
    );
}

export default QrScanner;
