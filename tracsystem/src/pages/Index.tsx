import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import StatsCard from "@/components/stats-card";
import AttendanceChart from "@/components/attendance-chart";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Dashboard Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title="Total Present" value={146} type="present" />
            <StatsCard title="Total Late" value={50} type="late" />
            <StatsCard title="Total Absent" value={160} type="absent" />
          </div>
          
          {/* Attendance Chart */}
          <AttendanceChart />
        </div>
      </div>
    </div>
  );
};

export default Index;
