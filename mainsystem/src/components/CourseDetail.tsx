import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Student {
  barcodeId: string;
  name: string;
  yearLevel: string;
  department: string;
  status: "Present" | "Late" | "Absent";
}

interface CourseDetailProps {
  courseCode: string;
  courseTitle: string;
}

const CourseDetail = ({ courseCode, courseTitle }: CourseDetailProps) => {
  const [students, setStudents] = useState<Student[]>([
    {
      barcodeId: "CA-01-12344",
      name: "Gerwin Cando",
      yearLevel: "2nd Year",
      department: "BSIT",
      status: "Present",
    },
    {
      barcodeId: "CT-42-43523",
      name: "Eunice Serrano",
      yearLevel: "2nd Year",
      department: "BSIT",
      status: "Present",
    },
    {
      barcodeId: "C2-14-86343",
      name: "Price Palad",
      yearLevel: "2nd Year",
      department: "BSIT",
      status: "Late",
    },
    {
      barcodeId: "C3-54-79535",
      name: "Joshua Pamintuan",
      yearLevel: "2nd Year",
      department: "BSIT",
      status: "Absent",
    },
  ]);

  const handleStatusChange = (
    barcodeId: string,
    newStatus: "Present" | "Late" | "Absent"
  ) => {
    setStudents(
      students.map((student) =>
        student.barcodeId === barcodeId
          ? { ...student, status: newStatus }
          : student
      )
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">TRAC System</h1>
        <h2 className="text-xl font-semibold text-black">{courseCode}</h2>
        <p className="text-lg text-black font-normal">{courseTitle}</p>
        <p className="text-md text-black">1:00–3:00 PM</p>
      </div>

      {/* Class List */}
      <Card>
        <CardHeader>
          <CardTitle>Class List</CardTitle>
        </CardHeader>
        <CardContent>
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
                <TableRow key={student.barcodeId}>
                  <TableCell className="font-medium">
                    {student.barcodeId}
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.yearLevel}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>
                    <Select
                      value={student.status}
                      onValueChange={(value) =>
                        handleStatusChange(
                          student.barcodeId,
                          value as "Present" | "Late" | "Absent"
                        )
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder={student.status} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border">
                        <SelectItem
                          value="Present"
                          className="text-green-600 font-medium"
                        >
                          Present
                        </SelectItem>
                        <SelectItem
                          value="Late"
                          className="text-yellow-600 font-medium"
                        >
                          Late
                        </SelectItem>
                        <SelectItem
                          value="Absent"
                          className="text-red-600 font-medium"
                        >
                          Absent
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetail;
