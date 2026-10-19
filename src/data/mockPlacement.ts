import { Company, JobDrive, Eligibility, Application, Interview, Placement, Training, TrainingEnrollment, Announcement } from '../types';

export const mockCompanies: Company[] = [
  {
    company_id: 1,
    company_name: "Microsoft Corporation",
    industry_type: "Technology & Cloud",
    location: "Hyderabad / Bangalore",
    website: "https://careers.microsoft.com",
    contact_phone: "+91 40 6699 0000",
    contact_email: "india-campus@microsoft.com"
  },
  {
    company_id: 2,
    company_name: "Google India",
    industry_type: "Internet & AI",
    location: "Bangalore / Pune",
    website: "https://careers.google.com",
    contact_phone: "+91 80 6721 8000",
    contact_email: "university-in@google.com"
  },
  {
    company_id: 3,
    company_name: "Tata Consultancy Services (TCS)",
    industry_type: "IT Services & Consulting",
    location: "Pan-India",
    website: "https://www.tcs.com/careers",
    contact_phone: "+91 22 6778 9999",
    contact_email: "campus.talent@tcs.com"
  },
  {
    company_id: 4,
    company_name: "Larsen & Toubro (L&T)",
    industry_type: "Core Engineering & Heavy Industries",
    location: "Mumbai / Chennai",
    website: "https://www.larsentoubro.com",
    contact_phone: "+91 22 6752 5656",
    contact_email: "hr-campus@larsentoubro.com"
  }
];

export const mockJobDrives: JobDrive[] = [
  {
    drive_id: 1,
    company_id: 1,
    job_role: "Software Development Engineer (SDE-1)",
    job_type: "Full-time",
    package: "18.5 LPA",
    drive_date: "2026-10-24",
    description: "Full-stack development, Azure cloud microservices, distributed systems.",
    company_name: "Microsoft Corporation"
  },
  {
    drive_id: 2,
    company_id: 2,
    job_role: "Associate Cloud Solutions Architect",
    job_type: "Internship + PPO",
    package: "22.0 LPA",
    drive_date: "2026-10-28",
    description: "Designing scalable GCP architectures, Kubernetes orchestration, ML deployment.",
    company_name: "Google India"
  },
  {
    drive_id: 3,
    company_id: 3,
    job_role: "Systems Engineer (Digital)",
    job_type: "Full-time",
    package: "7.5 LPA",
    drive_date: "2026-11-05",
    description: "Enterprise software solutions, banking architecture, automation testing.",
    company_name: "Tata Consultancy Services (TCS)"
  }
];

export const mockEligibilities: Eligibility[] = [
  {
    eligibility_id: 1,
    drive_id: 1,
    minimum_cgpa: 8.0,
    backlog_allowed: 0,
    allowed_branch: "CSE, ECE, IT",
    other_criteria: "Strong algorithmic problem solving & system design basics"
  },
  {
    eligibility_id: 2,
    drive_id: 2,
    minimum_cgpa: 8.5,
    backlog_allowed: 0,
    allowed_branch: "CSE, ECE",
    other_criteria: "Proficiency in Python/Go, cloud basics, and data structures"
  }
];

export const mockApplications: Application[] = [
  {
    application_id: 1,
    student_id: 1,
    drive_id: 1,
    application_date: "2026-10-02 10:15:00",
    status: "Shortlisted",
    student_name: "Aarav Sharma",
    roll_no: "CS2023001",
    company_name: "Microsoft Corporation",
    job_role: "Software Development Engineer (SDE-1)"
  },
  {
    application_id: 2,
    student_id: 2,
    drive_id: 1,
    application_date: "2026-10-02 11:30:00",
    status: "Shortlisted",
    student_name: "Ananya Patel",
    roll_no: "CS2023002",
    company_name: "Microsoft Corporation",
    job_role: "Software Development Engineer (SDE-1)"
  },
  {
    application_id: 3,
    student_id: 3,
    drive_id: 1,
    application_date: "2026-10-03 09:20:00",
    status: "Applied",
    student_name: "Rohan Verma",
    roll_no: "CS2023003",
    company_name: "Microsoft Corporation",
    job_role: "Software Development Engineer (SDE-1)"
  }
];

export const mockInterviews: Interview[] = [
  {
    interview_id: 1,
    application_id: 1,
    round_no: 1,
    interview_date: "2026-10-24 10:00:00",
    round_type: "Technical Round 1",
    feedback: "Excellent algorithmic skills, optimal binary tree solutions.",
    status: "Scheduled",
    student_name: "Aarav Sharma",
    company_name: "Microsoft Corporation"
  },
  {
    interview_id: 2,
    application_id: 2,
    round_no: 1,
    interview_date: "2026-10-24 11:30:00",
    round_type: "Technical Round 1",
    feedback: "Outstanding system design knowledge and OOP understanding.",
    status: "Scheduled",
    student_name: "Ananya Patel",
    company_name: "Microsoft Corporation"
  }
];

export const mockPlacements: Placement[] = [
  {
    placement_id: 1,
    application_id: 1,
    job_role: "Software Development Engineer (SDE-1)",
    package: "18.5 LPA",
    joining_date: "2027-07-01",
    status: "Offered",
    student_name: "Aarav Sharma",
    company_name: "Microsoft Corporation"
  }
];

export const mockTrainings: Training[] = [
  {
    training_id: 1,
    training_name: "Full-Stack Cloud & DevOps Bootcamp",
    provider: "AWS Academy & College T&P Cell",
    description: "Hands-on training in Docker, Kubernetes, CI/CD pipelines, and cloud computing.",
    start_date: "2026-09-01",
    end_date: "2026-10-30",
    enrolled_count: 75
  },
  {
    training_id: 2,
    training_name: "Advanced Data Structures & Competitive Coding",
    provider: "Internal Faculty & Alumni Mentors",
    description: "Graph algorithms, dynamic programming, and mock coding contests.",
    start_date: "2026-08-15",
    end_date: "2026-11-15",
    enrolled_count: 120
  }
];

export const mockTrainingEnrollments: TrainingEnrollment[] = [
  {
    enrollment_id: 1,
    student_id: 1,
    training_id: 1,
    enrollment_date: "2026-08-25",
    status: "Enrolled",
    student_name: "Aarav Sharma",
    training_name: "Full-Stack Cloud & DevOps Bootcamp"
  },
  {
    enrollment_id: 2,
    student_id: 2,
    training_id: 1,
    enrollment_date: "2026-08-25",
    status: "Enrolled",
    student_name: "Ananya Patel",
    training_name: "Full-Stack Cloud & DevOps Bootcamp"
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    announcement_id: 1,
    posted_by: "Dr. Arvind Sharma (Dean Academics)",
    title: "Mid-Semester Examination Schedule Autumn 2026 Released",
    description: "All students are requested to verify their seating arrangement and roll numbers on the portal. No electronic gadgets permitted.",
    announcement_date: "2026-10-08 09:30:00",
    category: "Academic"
  },
  {
    announcement_id: 2,
    posted_by: "Training & Placement Officer",
    title: "Campus Recruitment Drive: Microsoft SDE-1 Registration Open",
    description: "Eligible B.Tech CSE & ECE students with CGPA >= 8.0 must complete their portal registration before Oct 15.",
    announcement_date: "2026-10-07 14:15:00",
    category: "Placement"
  },
  {
    announcement_id: 3,
    posted_by: "Central Library Desk",
    title: "Library Timings Extended for Examination Preparation",
    description: "The Central Reading Hall will remain open until 11:00 PM starting Oct 12 through the examination period.",
    announcement_date: "2026-10-06 11:00:00",
    category: "General"
  }
];
