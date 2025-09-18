// src/components/attendance/MainAttendanceScreen.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import rccSeal from "@/assets/trac-seal.png";
import collegeBg from "@/assets/Our-Lady-of-Lourdes-Building.jpg";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const API_URL =
  "http://192.168.1.13/capstone/mainsystem/backend/attendance_api.php";

export const MainAttendanceScreen = () => {
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState("");
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      const date = now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });

      const weekday = now.toLocaleDateString("en-US", { weekday: "long" });

      // Time WITHOUT seconds
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });

      setCurrentTime(`${date}, ${weekday} | ${time}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    try {
      // Format time as HH:mm (no seconds)
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const formattedTime = `${hours}:${minutes}`;

      // --- Step 1: Check if student has already logged in today ---
      const checkRes = await fetch(
        `${API_URL}?action=checkAttendance&barcode_id=${barcode}`
      );
      const checkData = await checkRes.json();

      let formData = new URLSearchParams();

      if (checkData?.hasTimeIn && !checkData?.hasTimeOut) {
        // --- Second scan → Update time_out ---
        formData.append("barcode_id", barcode);
        formData.append("time_out", formattedTime);
        formData.append("action", "updateTimeout");
      } else {
        // --- First scan → Insert time_in ---
        formData.append("barcode_id", barcode);
        formData.append("time_in", formattedTime);
        formData.append("time_out", "");
        formData.append("status", "Present");
        formData.append("action", "addAttendance");
      }

      // --- Step 2: Send request to backend ---
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid JSON:", text);
        data = {};
      }

      console.log("Attendance response:", data);

      // --- Step 3: Navigate to confirmation screen ---
      navigate(
        `/attendance-confirmation?barcode=${barcode}&status=${encodeURIComponent(
          data.message ||
            (data.success
              ? checkData?.hasTimeIn
                ? "Time-out recorded"
                : "Time-in recorded"
              : "Failed")
        )}`
      );

      setBarcode(""); // Clear input after scan
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${collegeBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/50" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Full-width Brown Header Bar */}
        <div className="w-full bg-[#4B2E1A]/95 shadow-lg p-6 mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            REPUBLIC CENTRAL COLLEGES
          </h1>
          <p className="text-lg md:text-3xl text-white font-semibold tracking-wide">
            Time and Record Attendance Checking System (RCC-TRACS)
          </p>
          <p className="mt-4 text-2xl md:text-3xl text-yellow-200 font-bold">
            {currentTime}
          </p>
        </div>

        {/* Seal */}
        <div className="mb-16">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-b from-rcc-gold/20 to-rcc-panel/30 backdrop-blur-sm border-4 border-rcc-gold/30 flex items-center justify-center shadow-2xl">
            <img
              src={rccSeal}
              alt="Republic Central Colleges Seal"
              className="w-48 h-48 md:w-60 md:h-60 object-contain animate-spin-slow"
            />
          </div>
        </div>

        {/* Instruction Panel */}
        <Card className="bg-rcc-panel/90 border-rcc-border shadow-panel backdrop-blur-sm">
          <div className="p-6 text-center flex flex-col items-center gap-4">
            <p className="text-lg text-white font-medium px-4 py-2 bg-[#4B2E1A]/80 rounded-md shadow">
              Please scan your ID
            </p>

            <form
              onSubmit={handleBarcodeSubmit}
              className="w-full max-w-sm mt-4"
            >
              <Input
                type="text"
                placeholder="Barcode ID"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="px-4 py-3 text-lg text-center border-2 border-rcc-gold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoFocus
              />
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};
