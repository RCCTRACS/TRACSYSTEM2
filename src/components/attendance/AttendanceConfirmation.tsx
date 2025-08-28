// src/components/attendance/AttendanceConfirmation.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  User,
  CreditCard,
  GraduationCap,
  Building,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import studentPhoto from "@/assets/student-photo.jpg";
import rccSeal from "@/assets/rcc.seal.png";
import collegeBg from "@/assets/Our-Lady-of-Lourdes-Building.jpg";
import tracsSeal from "@/assets/trac-seal.png";

export const AttendanceConfirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  const currentTime = new Date();
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${collegeBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/40" />
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <img src={rccSeal} alt="RCC Seal" className="w-20 h-20" />
            <div className="text-rcc-panel-foreground">
              <h1 className="text-3xl font-oldenglish">Republic Central Colleges</h1>
              <p className="text-sm opacity-100">FAITH • SCIENCE • VIRTUE</p>
            </div>
          </div>
          <img src={tracsSeal} alt="TRACS Seal" className="w-20 h-20 opacity-100" />
        </div>

        <div className="mx-7 mb-9">
          <Card className="bg-rcc-success/95 border-rcc-success text-white shadow-elegant">
            <div className="flex items-center gap-3 p-4">
              <CheckCircle className="h-10 w-10 text-white" />
              <span className="text-4xl font-bold">Attendance Marked Successfully!</span>
            </div>
          </Card>
        </div>

        <div className="flex-2 px-7">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-rcc-panel/95 border-rcc-border shadow-panel">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="h-9 w-9 text-rcc-gold" />
                      <h2 className="text-2xl font-bold text-rcc-panel-foreground">Current Time</h2>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-rcc-gold mb-2">
                        {formattedDate} {formattedTime}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="bg-rcc-panel/95 border-rcc-border shadow-panel">
                <div className="p-6">
                  <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gradient-to-b from-rcc-gold/20 to-rcc-panel">
                    <img src={studentPhoto} alt="Student Photo" className="w-full h-full object-cover" />
                  </div>
                </div>
              </Card>

              <Card className="bg-rcc-panel/95 border-rcc-border shadow-panel">
                <div className="p-10">
                  <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold text-rcc-panel-foreground">Personal Information</h2>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-rcc-gold" />
                      <div>
                        <div className="text-mid text-rcc-gold font-medium">Student Name:</div>
                        <div className="text-3xl font-mono text-rcc-panel-foreground">Joshua S. Pamintuan</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-rcc-gold" />
                      <div>
                        <div className="text-mid text-rcc-gold font-medium">Barcode ID:</div>
                        <div className="text-3xl font-mono text-rcc-panel-foreground">C9-14-30821</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-rcc-gold" />
                      <div>
                        <div className="text-mid text-rcc-gold font-medium">Year/Course:</div>
                        <div className="text-3xl text-rcc-panel-foreground">IV-BSIT</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-rcc-gold" />
                      <div>
                        <div className="text-mid text-rcc-gold font-medium">Department:</div>
                        <div className="text-3xl text-rcc-panel-foreground">College of Computer Studies</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Card className="bg-rcc-panel/95 border-rcc-border shadow-panel">
            <div className="p-4 text-center">
          
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
