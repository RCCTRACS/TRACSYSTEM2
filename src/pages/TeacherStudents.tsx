"use client";

import React, { useEffect, useState } from "react";

interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
}

const TeacherStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // Fetch students data from backend
    fetch("http://192.168.100.26/capstone/mainsystem/backend/students_api.php")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Grade</th>
            <th className="border px-4 py-2">Section</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td className="border px-4 py-2">{s.name}</td>
              <td className="border px-4 py-2">{s.grade}</td>
              <td className="border px-4 py-2">{s.section}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherStudents;
