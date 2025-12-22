import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../Supabase/supabase-client";

function QrScanner({ onClose }) {
    const navigate = useNavigate();
    const [decodedText, setDecodedText] = useState("");
    const [parsedEventId, setParsedEventId] = useState(null);
    const [scanError, setScanError] = useState(null);
    const [sessionPresent, setSessionPresent] = useState(null);
    const [lastScan, setLastScan] = useState(null);
    const [debugVisible, setDebugVisible] = useState(() => localStorage.getItem("qr_debug") === "1");

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
            async (text) => {
                setDecodedText(text || "");
                setScanError(null);
                setLastScan(new Date().toISOString());

                if (scanned) return;

                try {
                    if (String(text).toLowerCase().includes("index.html")) return;
                } catch (e) {
                    setScanError(String(e));
                    return;
                }

                let eventId = null;
                try {
                    const match = String(text).match(/(?:\/attendance\/|attendance\/)([A-Za-z0-9_-]+)/i);
                    if (match) eventId = match[1];
                } catch (e) {
                    setScanError(String(e));
                }

                setParsedEventId(eventId || null);
                setDebugVisible(true);
                localStorage.setItem("qr_debug", "1");

                if (!eventId) return;
                scanned = true;

                try {
                    await scanner.clear();
                } catch (e) {
                }

                try {
                    const { data } = await supabase.auth.getSession();
                    const session = data?.session;
                    setSessionPresent(!!session);

                    // brief pause so the overlay is visible on mobile before navigation
                    await new Promise((r) => setTimeout(r, 700));

                    if (!session) {
                        navigate(`/signup?redirect=/attendance/${eventId}`);
                        if (typeof onClose === "function") onClose();
                    } else {
                        navigate(`/attendance/${eventId}`, { state: { fromScanner: true } });
                        if (typeof onClose === "function") onClose();
                    }
                } catch (e) {
                    setScanError(String(e));
                    await new Promise((r) => setTimeout(r, 700));
                    navigate(`/attendance/${eventId}`, { state: { fromScanner: true } });
                    if (typeof onClose === "function") onClose();
                }

                window.__qr_debug__ = {
                    decodedText: text,
                    eventId,
                    lastScan: new Date().toISOString(),
                    sessionPresent: sessionPresent,
                    error: scanError,
                };
            },
            (error) => {
                setScanError(String(error || "scan_error"));
                setLastScan(new Date().toISOString());
            }
        );

        return () => {
            scanner.clear().catch(() => {});
        };
    }, [navigate, onClose, sessionPresent, scanError]);

    const toggleDebug = () => {
        const next = !debugVisible;
        setDebugVisible(next);
        localStorage.setItem("qr_debug", next ? "1" : "0");
    };

    const copy = async (text) => {
        try {
            await navigator.clipboard.writeText(text || "");
            alert("Copied to clipboard");
        } catch (e) {
            alert("Copy failed");
        }
    };

    return (
        <div className="qr-box">
            <div id="qr-reader" />

            <div style={{ position: "fixed", left: 12, bottom: 12, zIndex: 9999 }}>
                <button onClick={toggleDebug} style={{ padding: 8, borderRadius: 8 }}>
                    {debugVisible ? "Hide QR Debug" : "Show QR Debug"}
                </button>
            </div>

            {debugVisible && (
                <div style={{ position: "fixed", left: 12, bottom: 64, zIndex: 9999, width: 320, maxWidth: "90vw", background: "rgba(2,6,23,0.95)", color: "#e5faff", border: "1px solid rgba(34,211,238,0.25)", borderRadius: 8, padding: 12, fontSize: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <strong>QR Debug</strong>
                        <small>{lastScan ? new Date(lastScan).toLocaleTimeString() : "—"}</small>
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <div style={{ fontWeight: 700 }}>Decoded</div>
                        <div style={{ wordBreak: "break-all" }}>{decodedText || "—"}</div>
                        <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                            <button onClick={() => copy(decodedText)} style={{ padding: 6, borderRadius: 6 }}>Copy</button>
                            <button onClick={() => { setDecodedText(""); setParsedEventId(null); setScanError(null); }} style={{ padding: 6, borderRadius: 6 }}>Clear</button>
                        </div>
                    </div>

                    <div style={{ marginTop: 10 }}>
                        <div style={{ fontWeight: 700 }}>Parsed Event ID</div>
                        <div>{parsedEventId || "—"}</div>
                    </div>

                    <div style={{ marginTop: 10 }}>
                        <div style={{ fontWeight: 700 }}>Session</div>
                        <div>{sessionPresent == null ? "—" : sessionPresent ? "Authenticated" : "No session"}</div>
                    </div>

                    <div style={{ marginTop: 10 }}>
                        <div style={{ fontWeight: 700 }}>Last Error</div>
                        <div style={{ color: "salmon" }}>{scanError || "—"}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QrScanner;
