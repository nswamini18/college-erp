/**
 * Student Analytics Data & Aggregation Service
 * Connects directly to existing academic models and records.
 */

export interface AcademicKPIs {
  currentSgpa: {
    value: number;
    semester: string;
    previousSgpa: number;
    change: number;
    changePct: number;
    cgpa: number;
  };
  overallAttendance: {
    percentage: number;
    attendedClasses: number;
    totalClasses: number;
    missedClasses: number;
    requiredThreshold: number;
    isMeetingRequirement: boolean;
  };
  upcomingExams: {
    nextExamName: string;
    nextExamDate: string;
    nextExamTime: string;
    nextExamRoom: string;
    totalUpcoming: number;
  };
  pendingApplications: {
    pendingCount: number;
    approvedCount: number;
    underVerificationCount: number;
    totalCount: number;
    statusSummary: string;
  };
}

export interface AttendanceDistributionItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SemesterTrendPoint {
  semester: string;
  sgpa: number | null;
  cgpa: number | null;
  credits: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  academicYear: string;
}

export interface ExamComparisonItem {
  subjectCode: string;
  subjectName: string;
  internalMarks: number;
  internalMax: number;
  internalPct: number;
  midtermMarks: number;
  midtermMax: number;
  midtermPct: number;
  practicalMarks: number;
  practicalMax: number;
  practicalPct: number;
}

export interface WeeklyAttendancePoint {
  week: string;
  dateRange: string;
  attended: number;
  total: number;
  percentage: number;
}

export interface SubjectAttendanceAlert {
  code: string;
  name: string;
  attended: number;
  total: number;
  percentage: number;
  threshold: number;
  severity: 'green' | 'amber' | 'red';
  classesNeededToRecover: number;
  warningMessage?: string;
  faculty: string;
}

// Institutional minimum attendance requirement
export const INSTITUTION_ATTENDANCE_THRESHOLD = 75;

/**
 * Compute student academic KPIs for the overview summary cards
 */
export const getStudentAcademicKPIs = (): AcademicKPIs => {
  // Existing data: Sem 1 SGPA = 9.05, Sem 2 SGPA = 9.25, CGPA = 9.15
  const sem1Sgpa = 9.05;
  const sem2Sgpa = 9.25;
  const currentSgpa = sem2Sgpa;
  const change = Number((currentSgpa - sem1Sgpa).toFixed(2));
  const changePct = Number(((change / sem1Sgpa) * 100).toFixed(1));

  // Subject attendance records
  const totalClasses = 132;
  const attendedClasses = 113;
  const missedClasses = totalClasses - attendedClasses;
  const overallPct = Number(((attendedClasses / totalClasses) * 100).toFixed(1));

  return {
    currentSgpa: {
      value: currentSgpa,
      semester: "Semester 2 (Official)",
      previousSgpa: sem1Sgpa,
      change,
      changePct,
      cgpa: 9.15
    },
    overallAttendance: {
      percentage: overallPct,
      attendedClasses,
      totalClasses,
      missedClasses,
      requiredThreshold: INSTITUTION_ATTENDANCE_THRESHOLD,
      isMeetingRequirement: overallPct >= INSTITUTION_ATTENDANCE_THRESHOLD
    },
    upcomingExams: {
      nextExamName: "Data Structures & Algorithms (CS301)",
      nextExamDate: "Oct 18, 2026",
      nextExamTime: "10:00 AM - 12:00 PM",
      nextExamRoom: "Exam Hall A-101",
      totalUpcoming: 3
    },
    pendingApplications: {
      pendingCount: 1,
      approvedCount: 2,
      underVerificationCount: 1,
      totalCount: 3,
      statusSummary: "1 Under Verification • 2 Approved"
    }
  };
};

/**
 * Attendance distribution breakdown for Donut/Pie Chart
 */
export const getAttendanceDistribution = (): {
  items: AttendanceDistributionItem[];
  overallPct: number;
  totalClasses: number;
  attendedClasses: number;
  missedClasses: number;
} => {
  const totalClasses = 132;
  const attendedClasses = 113;
  const missedClasses = totalClasses - attendedClasses;
  const attendedPct = Number(((attendedClasses / totalClasses) * 100).toFixed(1));
  const missedPct = Number(((missedClasses / totalClasses) * 100).toFixed(1));

  const items: AttendanceDistributionItem[] = [
    {
      name: "Classes Attended",
      count: attendedClasses,
      percentage: attendedPct,
      color: "#2ECC71" // Emerald Green
    },
    {
      name: "Classes Missed",
      count: missedClasses,
      percentage: missedPct,
      color: "#FF6B4A" // Soft Orange
    }
  ];

  return {
    items,
    overallPct: attendedPct,
    totalClasses,
    attendedClasses,
    missedClasses
  };
};

/**
 * Semester SGPA Performance Trend across chronological semesters
 */
export const getSemesterPerformanceTrend = (): SemesterTrendPoint[] => {
  return [
    {
      semester: "Sem 1",
      sgpa: 9.05,
      cgpa: 9.05,
      credits: 22,
      status: "Completed",
      academicYear: "2025-2026 (Autumn)"
    },
    {
      semester: "Sem 2",
      sgpa: 9.25,
      cgpa: 9.15,
      credits: 24,
      status: "Completed",
      academicYear: "2025-2026 (Spring)"
    },
    {
      semester: "Sem 3",
      sgpa: null, // Clearly unfinalised, exams in progress
      cgpa: null,
      credits: 24,
      status: "In Progress",
      academicYear: "2026-2027 (Autumn)"
    }
  ];
};

/**
 * Examination Comparison Data across Internal, Midterm, and Practical evaluations
 * Normalized to percentages with raw marks accessible
 */
export const getExaminationComparisonData = (): ExamComparisonItem[] => {
  return [
    {
      subjectCode: "CS301",
      subjectName: "Data Structures",
      internalMarks: 37,
      internalMax: 40,
      internalPct: 92.5,
      midtermMarks: 46.5,
      midtermMax: 50,
      midtermPct: 93.0,
      practicalMarks: 28,
      practicalMax: 30,
      practicalPct: 93.3
    },
    {
      subjectCode: "CS302",
      subjectName: "Database Systems",
      internalMarks: 36,
      internalMax: 40,
      internalPct: 90.0,
      midtermMarks: 44.0,
      midtermMax: 50,
      midtermPct: 88.0,
      practicalMarks: 47,
      practicalMax: 50,
      practicalPct: 94.0
    },
    {
      subjectCode: "CS303",
      subjectName: "Operating Systems",
      internalMarks: 32,
      internalMax: 40,
      internalPct: 80.0,
      midtermMarks: 39.0,
      midtermMax: 50,
      midtermPct: 78.0,
      practicalMarks: 23,
      practicalMax: 30,
      practicalPct: 76.7
    },
    {
      subjectCode: "CS304",
      subjectName: "Computer Networks",
      internalMarks: 35,
      internalMax: 40,
      internalPct: 87.5,
      midtermMarks: 43.0,
      midtermMax: 50,
      midtermPct: 86.0,
      practicalMarks: 26,
      practicalMax: 30,
      practicalPct: 86.7
    },
    {
      subjectCode: "CS302P",
      subjectName: "DBMS Laboratory",
      internalMarks: 38,
      internalMax: 40,
      internalPct: 95.0,
      midtermMarks: 47.0,
      midtermMax: 50,
      midtermPct: 94.0,
      practicalMarks: 48,
      practicalMax: 50,
      practicalPct: 96.0
    }
  ];
};

/**
 * Weekly Attendance Trend week-by-week
 */
export const getWeeklyAttendanceTrend = (): WeeklyAttendancePoint[] => {
  return [
    { week: "W1", dateRange: "Aug 18 - 24", attended: 12, total: 12, percentage: 100.0 },
    { week: "W2", dateRange: "Aug 25 - 31", attended: 12, total: 13, percentage: 92.3 },
    { week: "W3", dateRange: "Sep 01 - 07", attended: 14, total: 16, percentage: 87.5 },
    { week: "W4", dateRange: "Sep 08 - 14", attended: 12, total: 16, percentage: 75.0 },
    { week: "W5", dateRange: "Sep 15 - 21", attended: 13, total: 16, percentage: 81.3 },
    { week: "W6", dateRange: "Sep 22 - 28", attended: 14, total: 16, percentage: 87.5 },
    { week: "W7", dateRange: "Sep 29 - Oct 05", attended: 13, total: 16, percentage: 81.2 },
    { week: "W8", dateRange: "Oct 06 - 10", attended: 15, total: 17, percentage: 88.2 }
  ];
};

/**
 * Subject-Wise Attendance Alerts with Severity Assessment
 */
export const getSubjectAttendanceAlerts = (): SubjectAttendanceAlert[] => {
  const subjects = [
    { code: "CS301", name: "Data Structures & Algorithms", attended: 33, total: 36, faculty: "Prof. Sunita Rao" },
    { code: "CS302", name: "Database Management Systems", attended: 30, total: 34, faculty: "Dr. Arvind Sharma" },
    { code: "CS303", name: "Operating Systems", attended: 23, total: 32, faculty: "Prof. Kunal Joshi" },
    { code: "CS304", name: "Computer Networks", attended: 27, total: 30, faculty: "Dr. Arvind Sharma" }
  ];

  return subjects.map(sub => {
    const percentage = Number(((sub.attended / sub.total) * 100).toFixed(1));
    const threshold = INSTITUTION_ATTENDANCE_THRESHOLD;

    let severity: 'green' | 'amber' | 'red';
    let classesNeededToRecover = 0;
    let warningMessage: string | undefined;

    if (percentage < threshold) {
      severity = 'red';
      // Formula to find how many consecutive classes attended are needed:
      // (attended + x) / (total + x) >= 0.75 => attended + x >= 0.75*total + 0.75*x => 0.25*x >= 0.75*total - attended
      // x >= (0.75 * total - attended) / 0.25 = 3 * total - 4 * attended
      const x = Math.ceil((threshold / 100 * sub.total - sub.attended) / (1 - threshold / 100));
      classesNeededToRecover = Math.max(1, x);
      warningMessage = `Below required ${threshold}%. Must attend next ${classesNeededToRecover} consecutive classes to avoid exam debarment.`;
    } else if (percentage < threshold + 5) {
      severity = 'amber';
      warningMessage = `Borderline attendance (${percentage}%). Within 5% of detention threshold.`;
    } else {
      severity = 'green';
    }

    return {
      ...sub,
      percentage,
      threshold,
      severity,
      classesNeededToRecover,
      warningMessage
    };
  });
};
