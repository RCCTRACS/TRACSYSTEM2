import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface ManualAttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (barcode: string, time: string) => void;
}

const CustomTimePicker = ({
  onTimeChange,
  initialTime = "06:30",
}: {
  onTimeChange: (time: string) => void;
  initialTime?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState(initialTime.split(":")[0]);
  const [minute, setMinute] = useState(initialTime.split(":")[1]);
  const [period, setPeriod] = useState("AM");

  const handleHourChange = (value: string) => {
    if (value.length <= 2 && /^\d*$/.test(value)) {
      let numValue = parseInt(value) || 0;
      if (numValue >= 1 && numValue <= 12) {
        setHour(value.padStart(2, "0"));
      } else if (value === "" || value === "0") {
        setHour("01");
      }
    }
  };

  const handleMinuteChange = (value: string) => {
    if (value.length <= 2 && /^\d*$/.test(value)) {
      let numValue = parseInt(value) || 0;
      if (numValue >= 0 && numValue <= 59) {
        setMinute(value.padStart(2, "0"));
      }
    }
  };

  const handleOk = () => {
    let hour24 = parseInt(hour);
    if (period === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (period === "AM" && hour24 === 12) {
      hour24 = 0;
    }
    const timeString = `${hour24.toString().padStart(2, "0")}:${minute}`;
    onTimeChange(timeString);
    setIsOpen(false);
  };

  const displayTime = `${hour}:${minute} ${period}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full px-3 py-2 text-left border border-time-picker-input-border rounded-lg bg-time-picker-background hover:border-time-picker-border focus:outline-none focus:ring-2 focus:ring-time-picker-primary focus:border-time-picker-border transition-colors"
      >
        <span className="text-foreground">{displayTime}</span>
      </button>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md bg-time-picker-background rounded-2xl shadow-xl p-6 border-2 border-time-picker-border">
            {/* Header */}
            <DialogHeader className="text-center">
              <DialogTitle className="text-lg font-semibold text-foreground">
                Time Picker
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Enter time</p>
            </DialogHeader>

            {/* Time Input Section */}
            <div className="flex items-center justify-center gap-4 my-6">
              {/* Hour Input */}
              <div className="flex flex-col items-center">
                <div className="bg-time-picker-input border border-time-picker-input-border rounded-xl p-4 w-20 h-16 flex items-center justify-center shadow-sm">
                  <input
                    type="text"
                    value={hour}
                    onChange={(e) => handleHourChange(e.target.value)}
                    className="text-2xl font-bold text-center bg-transparent border-none outline-none w-full text-foreground"
                    maxLength={2}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-2 font-medium">Hour</span>
              </div>

              {/* Colon Separator */}
              <div className="text-2xl font-bold text-foreground self-center pb-6">:</div>

              {/* Minute Input */}
              <div className="flex flex-col items-center">
                <div className="bg-time-picker-input border border-time-picker-input-border rounded-xl p-4 w-20 h-16 flex items-center justify-center shadow-sm">
                  <input
                    type="text"
                    value={minute}
                    onChange={(e) => handleMinuteChange(e.target.value)}
                    className="text-2xl font-bold text-center bg-transparent border-none outline-none w-full text-foreground"
                    maxLength={2}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-2 font-medium">Minute</span>
              </div>

              {/* AM/PM Toggle */}
              <div className="flex flex-col gap-1 ml-2 pb-6">
                <button
                  type="button"
                  onClick={() => setPeriod("AM")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    period === "AM"
                      ? "bg-time-picker-primary text-time-picker-primary-foreground"
                      : "bg-time-picker-input text-foreground hover:bg-time-picker-button-hover"
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod("PM")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    period === "PM"
                      ? "bg-time-picker-primary text-time-picker-primary-foreground"
                      : "bg-time-picker-input text-foreground hover:bg-time-picker-button-hover"
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleOk}
                  className="bg-time-picker-primary hover:bg-time-picker-button-hover text-time-picker-primary-foreground font-medium"
                >
                  OK
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export function ManualAttendanceDialog({
  open,
  onClose,
  onAdd,
}: ManualAttendanceDialogProps) {
  const [barcode, setBarcode] = useState("");
  const [time, setTime] = useState("06:30");

  const handleAdd = () => {
    if (barcode && time) {
      onAdd(barcode, time);
      setBarcode("");
      setTime("06:30");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card rounded-2xl shadow-xl p-6">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-card-foreground">
            Manual Attendance Input
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="flex gap-4 items-center mt-2">
          {/* Barcode Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Barcode ID
            </label>
            <Input
              placeholder="Enter Barcode ID"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="border-input text-card-foreground rounded-lg"
            />
          </div>

          {/* Time Picker */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Time In
            </label>
            <CustomTimePicker
              onTimeChange={setTime}
              initialTime={time}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-border text-foreground font-semibold rounded-lg px-6 hover:bg-accent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-primary text-primary-foreground font-semibold rounded-lg px-6 hover:bg-primary/90"
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}