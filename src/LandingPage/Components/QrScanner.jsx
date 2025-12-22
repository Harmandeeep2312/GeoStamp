import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../Supabase/supabase-client";

function QrScanner() {
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
                if (scanned) return; // ignore duplicate callbacks

                // Try to extract eventId from multiple possible QR payloads
                let eventId = null;

                try {
                    // url like https://site/.../attendance/<id>
                    const match = decodedText.match(/attendance\/([A-Za-z0-9_-]+)/i);
                    if (match) {
                        eventId = match[1];
                    } else {
                        // query param like ?eventId=<id>
                        const qp = decodedText.match(/[?&]eventId=([A-Za-z0-9_-]+)/i);
                        if (qp) eventId = qp[1];
                        else {
                            // plain UUID-ish or token
                            const uuid = decodedText.match(/[0-9a-fA-F-]{36}/);
                            if (uuid) eventId = uuid[0];
                            else if (/^[A-Za-z0-9_-]{6,}$/i.test(decodedText)) eventId = decodedText.trim();
                        }
                    }
                } catch (e) {
                    // ignore parse errors
                }

                if (!eventId) return;
                scanned = true;

                // clear scanner before nav
                try {
                    await scanner.clear();
                } catch (e) {
                    // ignore
                }

                // if user not authenticated, send them to signup and include redirect
                try {
                    const { data } = await supabase.auth.getSession();
                    const session = data?.session;
                    if (!session) {
                        navigate(`/signup?redirect=/attendance/${eventId}`);
                    } else {
                        navigate(`/attendance/${eventId}`);
                    }
                } catch (e) {
                    navigate(`/attendance/${eventId}`);
                }
            },
            (error) => {
                // ignore scan errors
            }
        );

        return () => {
            // defensive clear
            scanner.clear().catch(() => {});
        };
    }, [navigate]);

    return (
        <div className="qr-box">
            <div id="qr-reader" />
        </div>
    );
}

export default QrScanner;
