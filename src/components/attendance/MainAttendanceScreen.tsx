// src/components/attendance/MainAttendanceScreen.tsx
import { useNavigate } from "react-router-dom";
import rccSeal from "@/assets/rcc.seal.png";
import collegeBg from "@/assets/Our-Lady-of-Lourdes-Building.jpg";
import { Card } from "@/components/ui/card";

export const MainAttendanceScreen = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${collegeBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/50" />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-5xl font-oldenglish font-bold text-rcc-panel-foreground mb-2">
  Republic Central Colleges
</h1>
          <p className="text-lg md:text-xl text-rcc-gold font-medium tracking-wider">
            FAITH • SCIENCE • VIRTUE
          </p>
        </div>

        <div className="mb-16">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-b from-rcc-gold/20 to-rcc-panel/30 backdrop-blur-sm border-4 border-rcc-gold/30 flex items-center justify-center shadow-2xl">
            <img
              src={rccSeal}
              alt="Republic Central Colleges Seal"
              className="w-48 h-48 md:w-60 md:h-60 object-contain animate-spin-slow"
            />
          </div>
        </div>

        <Card className="bg-rcc-panel/90 border-rcc-border shadow-panel backdrop-blur-sm">
          <div className="p-6 text-center flex flex-col items-center gap-4">
            <p className="text-lg text-rcc-panel-foreground font-medium">
              Use the scanner or manual entry to get started
            </p>
            <button
              onClick={() => navigate("/confirmed")}
              className="mt-4 rounded bg-rcc-gold px-6 py-3 font-semibold text-black shadow-md hover:bg-yellow-400 transition"
            >
              Go to Confirmation
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
