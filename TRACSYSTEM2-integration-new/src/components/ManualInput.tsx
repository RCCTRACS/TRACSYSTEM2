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
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface ManualAttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (barcode: string, time: string) => void;
}

export function ManualAttendanceDialog({
  open,
  onClose,
  onAdd,
}: ManualAttendanceDialogProps) {
  const [barcode, setBarcode] = useState("");
  const [time, setTime] = useState<Dayjs | null>(dayjs());

  const handleAdd = () => {
    if (barcode && time) {
      onAdd(barcode, time.format("HH:mm"));
      setBarcode("");
      setTime(dayjs());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-xl p-6">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-black">
            Manual Attendance Input
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="flex gap-4 items-center mt-2">
          {/* Barcode Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-black mb-1">
              Barcode ID
            </label>
            <Input
              placeholder="Enter Barcode ID"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="border border-gray-400 text-black rounded-lg"
            />
          </div>

          {/* Time Picker (Modal Style) */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-black mb-1">
              Time In
            </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                value={time}
                onChange={(newValue) => setTime(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    placeholder: "Pick a time",
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0.5rem",
                        "& fieldset": { borderColor: "brown" },
                        "&:hover fieldset": { borderColor: "#5c2e1e" },
                        "&.Mui-focused fieldset": { borderColor: "brown" },
                      },
                      input: { color: "black" },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white border-2 border-[#8B4513] text-[#8B4513] font-semibold rounded-lg px-6 hover:bg-[#f9f4f1]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-[#8B4513] text-white font-semibold rounded-lg px-6 hover:bg-[#5c2e1e]"
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
