interface ChartData {
  grade: string;
  percentage: number;
}

const AttendanceChart = () => {
  const data: ChartData[] = [
    { grade: "G7", percentage: 100 },
    { grade: "G8", percentage: 84 },
    { grade: "G9", percentage: 93 },
    { grade: "G10", percentage: 76 },
    { grade: "G11", percentage: 35 },
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Total Attendance: June 16, 2025
      </h3>
      
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.grade} className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground w-8">
              {item.grade}
            </span>
            <div className="flex-1 bg-chart-background rounded-full h-6 relative overflow-hidden">
              <div
                className="bg-chart-bar h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground w-8">
              {item.percentage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceChart;