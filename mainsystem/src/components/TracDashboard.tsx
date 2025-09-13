import { useState } from "react";
import TracSidebar from "./TracSidebar";
import TracHeader from "./TracHeader";
import CourseCard from "./CourseCard";
import CourseDetail from "./CourseDetail";
import { Card, CardContent } from "@/components/ui/card";

const TracDashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState<{
    courseCode: string;
    courseTitle: string;
  } | null>(null);

  const courses = [
    {
      courseCode: "IT214-SPI",
      courseTitle: "Social and Professional Issues",
      description: "Professional Issues"
    },
    {
      courseCode: "IT314-OS",
      courseTitle: "Operating Systems",
      description: "Operating Systems"
    },
    {
      courseCode: "IT324-SAM",
      courseTitle: "Systems Administration and Maintenance",
      description: "Systems Administration and Maintenance"
    }
  ];

  // 🔹 function to return to dashboard
  const goToDashboard = () => setSelectedCourse(null);

  if (selectedCourse) {
    return (
      <div className="flex min-h-screen bg-white">
        <TracSidebar onDashboardClick={goToDashboard} />
        <div className="flex-1">
          <TracHeader />
          <CourseDetail
            courseCode={selectedCourse.courseCode}
            courseTitle={selectedCourse.courseTitle}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <TracSidebar onDashboardClick={goToDashboard} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <TracHeader />

        {/* Dashboard Content */}
        <main className="p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
            {courses.map((course, index) => (
              <CourseCard
                key={index}
                courseCode={course.courseCode}
                courseTitle={course.courseTitle}
                description={course.description}
                onClick={() =>
                  setSelectedCourse({
                    courseCode: course.courseCode,
                    courseTitle: course.courseTitle
                  })
                }
              />
            ))}

            {/* Additional course cards to make 9 total */}
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Card
                key={`placeholder-${index}`}
                className="bg-card border border-border flex flex-col justify-center opacity-50"
              >
                <CardContent className="p-8 text-center flex-1 flex items-center justify-center">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-muted-foreground">
                      Course {index + 3}
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      Available Soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TracDashboard;
