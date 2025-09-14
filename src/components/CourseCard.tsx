import { Card, CardContent } from "@/components/ui/card";

interface CourseCardProps {
  subjectCode: string;   // Subject Code
  subjectName: string;   // Subject Name
  subjectTime?: string;  // Subject Time (optional)
  onClick?: () => void;
}

const CourseCard = ({ subjectCode, subjectName, subjectTime, onClick }: CourseCardProps) => {
  return (
    <Card
      className="bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] flex flex-col justify-center rounded-2xl"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center flex-1 flex flex-col items-center justify-center">
        <div className="space-y-3">
          {/* Subject Code */}
          <h3 className="text-2xl font-bold text-primary tracking-wide">
            {subjectCode}
          </h3>

          {/* Subject Name */}
          <p className="text-lg font-semibold text-gray-800">
            {subjectName}
          </p>

          {/* Subject Time (optional) */}
          {subjectTime && (
            <p className="text-sm text-gray-600 italic">{subjectTime}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
