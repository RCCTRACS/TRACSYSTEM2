import { Card, CardContent } from "@/components/ui/card";

interface CourseCardProps {
  courseCode: string;
  courseTitle: string;
  description: string;
  onClick?: () => void;
}

const CourseCard = ({ courseCode, courseTitle, description, onClick }: CourseCardProps) => {
  return (
    <Card 
  className="bg-gray-100 border border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] flex flex-col justify-center"
  onClick={onClick}
>
      <CardContent className="p-8 text-center flex-1 flex items-center justify-center">
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-black">
            {courseCode}
          </h3>
          <p className="text-lg font-normal text-black">
            {courseTitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
