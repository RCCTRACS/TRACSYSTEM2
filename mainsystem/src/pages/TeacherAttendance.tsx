"use client";

import React, { useEffect, useState } from "react";

interface Attendance {
  id: string;
  student_name: string;
  date: string;
  status: string;
}

const TeacherAttendance: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    // Fetch attendance data from your backend
    fetch("http://192.168.1.13/capstone/mainsystem/backend/attendance_api.php")
      .then((res) => res.json())
      .then((data) => setAttendance(data))
      .catch((err) => console.error("Error fetching attendance:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Student</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((a) => (
            <tr key={a.id}>
              <td className="border px-4 py-2">{a.student_name}</td>
              <td className="border px-4 py-2">{a.date}</td>
              <td className="border px-4 py-2">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherAttendance;
