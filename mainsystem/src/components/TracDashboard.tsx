import { useState, useEffect } from "react";
import TracSidebar from "./TracSidebar";
import TracHeader from "./TracHeader";
import CourseCard from "./CourseCard";
import CourseDetail from "./CourseDetail";
import { Card, CardContent } from "@/components/ui/card";

interface Teacher {
  name: string; // Full name
  email: string;
}

interface Subject {
  subject_code: string;
  subject_name: string;
  subject_time: string;
}

interface TracDashboardProps {
  teacherEmail?: string; // optional
}

const TracDashboard = ({ teacherEmail }: TracDashboardProps) => {
  // ✅ Pull saved auth info if no prop passed
  const storedEmail =
    typeof window !== "undefined" ? localStorage.getItem("authEmail") : "";
  const storedName =
    typeof window !== "undefined" ? localStorage.getItem("authName") : "";

  const effectiveEmail = teacherEmail || storedEmail || "";

  const [selectedCourse, setSelectedCourse] = useState<{
    courseCode: string;
    courseTitle: string;
  } | null>(null);

  const [teacher, setTeacher] = useState<Teacher | null>(
    effectiveEmail
      ? { name: storedName || "Unknown", email: effectiveEmail }
      : null
  );
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch teacher + subjects
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!effectiveEmail) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://192.168.1.13/capstone/mainsystem/backend/get_teacher_subjects.php?email=${encodeURIComponent(
            effectiveEmail
          )}`
        );
        const data = await res.json();

        if (data.success) {
          setTeacher({
            name: data.teacher?.name || storedName || "Unknown",
            email: data.teacher?.email || effectiveEmail,
          });
          setSubjects(data.subjects || []);
        } else {
          console.error(data.message);
          setTeacher(null);
          setSubjects([]);
        }
      } catch (error) {
        console.error("Failed to fetch teacher data:", error);
        setTeacher(null);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [effectiveEmail, storedName]);

  const goToDashboard = () => setSelectedCourse(null);

  // ✅ If course selected → show detail view
  if (selectedCourse) {
    return (
      <div className="flex min-h-screen bg-white">
        <TracSidebar teacher={teacher} onDashboardClick={goToDashboard} />
        <div className="flex-1 ml-0">
          <TracHeader teacher={teacher} />
          <CourseDetail
            courseCode={selectedCourse.courseCode}
            courseTitle={selectedCourse.courseTitle}
          />
        </div>
      </div>
    );
  }

  // ✅ Default Dashboard
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <TracSidebar teacher={teacher} onDashboardClick={goToDashboard} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0">
        {/* Header */}
        <TracHeader teacher={teacher} />

        {/* Dashboard */}
        <main className="px-2 py-4 flex-1">
          {loading ? (
            <p>Loading courses...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                {subjects.map((subject, index) => (
                  <CourseCard
                    key={index}
                    subjectCode={subject.subject_code}
                    subjectName={subject.subject_name}
                    subjectTime={subject.subject_time}
                    onClick={() =>
                      setSelectedCourse({
                        courseCode: subject.subject_code,
                        courseTitle: subject.subject_name,
                      })
                    }
                  />
                ))}

                {/* Placeholder cards if less than 9 subjects */}
                {[...Array(Math.max(0, 9 - subjects.length))].map((_, idx) => (
                  <Card
                    key={`placeholder-${idx}`}
                    className="bg-card border border-border flex flex-col justify-center opacity-50"
                  >
                    <CardContent className="p-8 text-center flex-1 flex items-center justify-center">
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-muted-foreground">
                          Course {subjects.length + idx + 1}
                        </h3>
                        <p className="text-lg text-muted-foreground">
                          Available Soon
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default TracDashboard;
