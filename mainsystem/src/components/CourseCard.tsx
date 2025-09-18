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
      className="bg-white border-4 border-[#8B4513] hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] flex flex-col justify-center rounded-2xl"
      onClick={onClick}
    >
      <CardContent className="p-8 text-center flex-1 flex flex-col items-center justify-center space-y-4">
        {/* Subject Code */}
        <h3 className="text-3xl sm:text-4xl font-extrabold text-[#5C4033] tracking-wider">
          {subjectCode}
        </h3>

        {/* Subject Name */}
        <p className="text-xl sm:text-2xl font-semibold text-gray-900">
          {subjectName}
        </p>

        {/* Subject Time (optional) */}
        {subjectTime && (
          <p className="text-base sm:text-lg text-gray-600 italic">{subjectTime}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
