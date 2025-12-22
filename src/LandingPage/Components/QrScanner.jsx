import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../Supabase/supabase-client";

function QrScanner({ onClose }) {
    const navigate = useNavigate();

    useEffect(() => {
        let scanned = false;

        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: 250,
            },
            false
        );

        scanner.render(
            async (decodedText) => {
                if (scanned) return;

                let eventId = null;
                const text = decodedText;

                try {
                    if (text.toLowerCase().includes("index.html")) return;

                    const match = text.match(/(?:\/attendance\/|attendance\/)([A-Za-z0-9_-]+)/i);
                    if (match) eventId = match[1];
                } catch (e) {
                }

                if (!eventId) return;
                scanned = true;

                try {
                    await scanner.clear();
                } catch (e) {
                }

                try {
                    const { data } = await supabase.auth.getSession();
                    const session = data?.session;
                    if (!session) {
                        navigate(`/signup?redirect=/attendance/${eventId}`);
                        if (typeof onClose === "function") onClose();
                    } else {
                        navigate(`/attendance/${eventId}`, { state: { fromScanner: true } });
                        if (typeof onClose === "function") onClose();
                    }
                } catch (e) {
                    navigate(`/attendance/${eventId}`, { state: { fromScanner: true } });
                    if (typeof onClose === "function") onClose();
                }
            },
            (error) => {
            }
        );

        return () => {
            scanner.clear().catch(() => {});
        };
    }, [navigate, onClose]);

    return (
        <div className="qr-box">
            <div id="qr-reader" />
        </div>
    );
}

export default QrScanner;
