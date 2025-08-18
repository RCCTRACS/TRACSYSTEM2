interface StatsCardProps {
  title: string;
  value: number;
  type: "present" | "late" | "absent";
}

const StatsCard = ({ title, value, type }: StatsCardProps) => {
  const getColorClass = () => {
    switch (type) {
      case "present":
        return "text-stats-present";
      case "late":
        return "text-stats-late";
      case "absent":
        return "text-stats-absent";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="bg-gray-100 rounded-xl p-6 border border-border shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <p className={`text-4xl font-bold ${getColorClass()}`}>{value}</p>
    </div>
  );
};

export default StatsCard;
