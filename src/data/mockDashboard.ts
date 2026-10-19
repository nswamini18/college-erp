export const mockDashboardData = {
  stats: [
    {
      title: "Total Students",
      value: "2,845",
      change: "+12% this year",
      trend: "up",
      color: "emerald",
      icon: "GraduationCap"
    },
    {
      title: "Active Faculty & Staff",
      value: "186",
      change: "4 on leave",
      trend: "neutral",
      color: "teal",
      icon: "Users"
    },
    {
      title: "Average Attendance",
      value: "86.4%",
      change: "+2.1% from last month",
      trend: "up",
      color: "green",
      icon: "CheckCircle2"
    },
    {
      title: "Placement Rate",
      value: "91.2%",
      change: "38 Drives completed",
      trend: "up",
      color: "lime",
      icon: "Briefcase"
    },
    {
      title: "Library Books Circulating",
      value: "1,248",
      change: "42 due this week",
      trend: "neutral",
      color: "amber",
      icon: "BookOpen"
    },
    {
      title: "Fee Collection",
      value: "₹1.42 Cr",
      change: "88% collected of Q3",
      trend: "up",
      color: "emerald",
      icon: "CreditCard"
    }
  ],
  attendanceTrends: [
    { month: "Jan", rate: 84 },
    { month: "Feb", rate: 87 },
    { month: "Mar", rate: 89 },
    { month: "Apr", rate: 82 },
    { month: "May", rate: 88 },
    { month: "Jun", rate: 86 }
  ],
  departmentStats: [
    { name: "Computer Science & Engg", students: 780, faculty: 36, placement: 96 },
    { name: "Electronics & Comm. Engg", students: 560, faculty: 28, placement: 89 },
    { name: "Mechanical Engineering", students: 490, faculty: 24, placement: 82 },
    { name: "Civil Engineering", students: 420, faculty: 20, placement: 78 },
    { name: "Business Administration", students: 595, faculty: 26, placement: 93 }
  ],
  recentActivities: [
    {
      id: 1,
      user: "Dr. Arvind Sharma",
      action: "Published End-Term Exam timetable for Semester 6",
      time: "15 minutes ago",
      type: "exam"
    },
    {
      id: 2,
      user: "Placement Cell",
      action: "Scheduled Campus Recruitment Drive for Microsoft (CTC 18 LPA)",
      time: "1 hour ago",
      type: "placement"
    },
    {
      id: 3,
      user: "Accounts Desk",
      action: "Generated Semester 4 Tuition Fee invoices for 420 students",
      time: "3 hours ago",
      type: "finance"
    },
    {
      id: 4,
      user: "Central Library",
      action: "Cataloged 45 new textbooks in Artificial Intelligence & Cloud",
      time: "5 hours ago",
      type: "library"
    },
    {
      id: 5,
      user: "Prof. Sunita Rao",
      action: "Marked attendance for CS301 (Data Structures - Section A)",
      time: "Yesterday at 4:30 PM",
      type: "academic"
    }
  ],
  upcomingEvents: [
    {
      title: "Mid-Term Examination Commences",
      date: "Oct 18, 2026",
      category: "Academic",
      urgency: "High"
    },
    {
      title: "Google Technical Placement Assessment",
      date: "Oct 22, 2026",
      category: "Placement",
      urgency: "Medium"
    },
    {
      title: "Library Book Return Deadline",
      date: "Oct 25, 2026",
      category: "Library",
      urgency: "Normal"
    },
    {
      title: "Faculty Board of Studies Meeting",
      date: "Oct 30, 2026",
      category: "Administration",
      urgency: "Normal"
    }
  ]
};
