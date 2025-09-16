// src/components/attendance/AttendanceConfirmation.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, CreditCard, GraduationCap, Building } from "lucide-react";

import rccSeal from "@/assets/rcc.seal.png";
import collegeBg from "@/assets/Our-Lady-of-Lourdes-Building.jpg";
import tracsSeal from "@/assets/trac-seal.png";

interface StudentInfo {
  student_name: string;
  barcode_id: string;
  year_level: string;
  department: string;
  time_in?: string;
  time_out?: string;
  status?: string;
}

const ATTENDANCE_API =
  "http://192.168.1.13/capstone/mainsystem/backend/attendance_api.php";

export const AttendanceConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

  // Extract query params
  const queryParams = new URLSearchParams(location.search);
  const barcode = queryParams.get("barcode");
  const status = queryParams.get("status") || "Attendance Recorded";

  useEffect(() => {
    if (!barcode) return;

    const fetchStudentData = async () => {
      try {
        const res = await fetch(`${ATTENDANCE_API}?barcode_id=${barcode}`);
        const data = await res.json();

        let record: any = null;
        if (Array.isArray(data)) {
          record = data[0];
        } else {
          record = data;
        }

        if (!record) return;

        // Format date
        const now = new Date();
        setFormattedDate(
          now.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })
        );

        // Decide which time to show
        let timeToShow: string | undefined;
        if (status.toLowerCase().includes("out") && record.time_out) {
          timeToShow = record.time_out;
        } else if (record.time_in) {
          timeToShow = record.time_in;
        }

        if (timeToShow) {
          setFormattedTime(timeToShow);
        }

        setStudent({
          student_name: record.student_name || "Unknown",
          barcode_id: record.barcode_id,
          year_level: record.year_level,
          department: record.department,
          time_in: record.time_in,
          time_out: record.time_out,
          status: record.status,
        });
      } catch (error) {
        console.error("Error fetching student info:", error);
      }
    };

    fetchStudentData();

    // Auto-redirect after 4s
    const timeout = setTimeout(() => {
      navigate("/attendance");
    }, 4000);

    return () => clearTimeout(timeout);
  }, [barcode, navigate, status]);

  const isTimeIn = status.toLowerCase().includes("in");
  const bannerColor = isTimeIn ? "bg-green-600" : "bg-blue-600";
  const label = isTimeIn ? "Check-in Time" : "Check-out Time";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative flex flex-col"
      style={{ backgroundImage: `url(${collegeBg})` }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <img src={rccSeal} alt="RCC Seal" className="w-20 h-20 sm:w-24 sm:h-24" />
          <img src={tracsSeal} alt="TRACS Seal" className="w-20 h-20 sm:w-24 sm:h-24" />
        </div>

        {/* Dynamic Banner */}
        <div
          className={`${bannerColor} text-white text-center py-5 sm:py-6 text-2xl sm:text-4xl font-extrabold shadow-md`}
        >
          {status}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 max-w-6xl w-full">
            {/* Student Photo */}
            <div className="bg-white rounded-lg shadow-lg flex justify-center items-center p-4 sm:p-6">
              {barcode ? (
                <div className="w-full max-w-[420px] aspect-[3/4] flex justify-center items-center">
                  <img
                    src={`http://192.168.1.13/capstone/mainsystem/students/${barcode}.jpg`}
                    alt="Student"
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = "/fallback-student.png")
                    }
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-lg sm:text-2xl">No photo available</p>
              )}
            </div>

            {/* Info Section */}
            <div className="flex flex-col gap-6 sm:gap-8">
              {/* Time */}
              <div className="bg-[#4B2E1A] text-white rounded-md p-4 sm:p-6 shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
                  {label}
                </h2>
                <p className="text-2xl sm:text-4xl font-mono font-semibold">
                  {formattedDate} {formattedTime}
                </p>
              </div>

              {/* Student Info */}
              <div className="bg-[#4B2E1A] text-white rounded-md p-6 sm:p-8 shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
                  Personal Information
                </h2>
                {student ? (
                  <div className="space-y-4 sm:space-y-6 text-lg sm:text-2xl">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <User className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-300" />
                      <span>
                        <strong>Student Name:</strong> {student.student_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-300" />
                      <span>
                        <strong>Barcode ID:</strong> {student.barcode_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-300" />
                      <span>
                        <strong>Year Level:</strong> {student.year_level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Building className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-300" />
                      <span>
                        <strong>Department:</strong> {student.department}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-300 text-lg sm:text-xl">
                    Loading student info...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-black/70 text-center text-white text-sm sm:text-lg">
          Powered by TRACS • Attendance System
        </div>
      </div>
    </div>
  );
};
