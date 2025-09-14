import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Student {
  barcode_id: string;
  student_name: string;
  year_level: string;
  department: string;
  parent_email: string;
  grade?: string;
  strand?: string;
  section?: string;
  status: "Present" | "Late" | "Absent";
}

interface CourseDetailProps {
  courseCode: string;
  courseTitle: string;
  department: string;
  grade?: string;
  onExit: () => void;
}

const CourseDetail = ({
  courseCode,
  courseTitle,
  department,
  grade,
  onExit,
}: CourseDetailProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch students filtered by Department + Grade only
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://192.168.100.26/capstone/mainsystem/backend/student_api.php",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          const filtered = data.data.filter((s: any) => {
            return (
              s.department === department &&
              (!grade || s.year_level === grade)
            );
          });

          const withStatus = filtered.map((s: any) => ({
            ...s,
            status: "Absent" as "Present" | "Late" | "Absent",
          }));

          setStudents(withStatus);
        } else {
          console.error("❌ API returned error:", data.message);
        }
      } catch (err) {
        console.error("⚠️ Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [department, grade]);

  // ✅ Barcode scan/input
  const handleBarcodeSubmit = () => {
    if (!barcodeInput.trim()) return;

    const found = students.find((s) => s.barcode_id === barcodeInput.trim());

    if (found) {
      setStudents((prev) =>
        prev.map((s) =>
          s.barcode_id === found.barcode_id ? { ...s, status: "Present" } : s
        )
      );
    } else {
      alert("❌ Student not found in this subject!");
    }

    setBarcodeInput("");
  };

  // ✅ Manual status change
  const handleStatusChange = (
    barcode_id: string,
    newStatus: "Present" | "Late" | "Absent"
  ) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.barcode_id === barcode_id ? { ...s, status: newStatus } : s
      )
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">{courseCode}</h2>
          <p className="text-lg text-black">{courseTitle}</p>
          <p className="text-sm text-gray-600">1:00–3:00 PM</p>
        </div>
        <Button onClick={onExit} variant="destructive">
          Exit
        </Button>
      </div>

      {/* Barcode Input */}
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Scan or enter student barcode"
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBarcodeSubmit()}
        />
        <Button onClick={handleBarcodeSubmit}>Add</Button>
      </div>

      {/* Class List */}
      <Card>
        <CardHeader>
          <CardTitle>Class List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-center py-6">Loading students...</p>
          ) : students.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No students found for this subject.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Barcode ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Year Level</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.barcode_id}>
                    <TableCell className="font-medium">
                      {student.barcode_id}
                    </TableCell>
                    <TableCell>{student.student_name}</TableCell>
                    <TableCell>{student.year_level}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>
                      <Select
                        value={student.status}
                        onValueChange={(value) =>
                          handleStatusChange(
                            student.barcode_id,
                            value as "Present" | "Late" | "Absent"
                          )
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder={student.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Late">Late</SelectItem>
                          <SelectItem value="Absent">Absent</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetail;
