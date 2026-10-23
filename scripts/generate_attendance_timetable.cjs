const fs = require('fs');
const path = require('path');

// 1. Definition of Departments, Sections, Subjects, Faculty
const DEPARTMENTS = [
  { id: 1, name: 'Computer Science & Engineering', code: 'CS' },
  { id: 2, name: 'Electronics & Telecommunication', code: 'ENTC' },
  { id: 3, name: 'Information Technology', code: 'IT' },
  { id: 4, name: 'Artificial Intelligence & Data Science', code: 'AIDS' },
  { id: 5, name: 'Electronics & Computer Engineering', code: 'ENCE' }
];

const SECTIONS = [
  { id: 1, name: 'CS-1', deptId: 1, room: 'CS-101', lab: 'CS-Lab-A' },
  { id: 2, name: 'CS-2', deptId: 1, room: 'CS-102', lab: 'CS-Lab-B' },
  { id: 3, name: 'CS-3', deptId: 1, room: 'CS-103', lab: 'CS-Lab-A' },
  { id: 4, name: 'CS-4', deptId: 1, room: 'CS-104', lab: 'CS-Lab-B' },
  { id: 5, name: 'ENTC-1', deptId: 2, room: 'ET-201', lab: 'ET-Lab-A' },
  { id: 6, name: 'ENTC-2', deptId: 2, room: 'ET-202', lab: 'ET-Lab-B' },
  { id: 7, name: 'ENTC-3', deptId: 2, room: 'ET-203', lab: 'ET-Lab-A' },
  { id: 8, name: 'ENTC-4', deptId: 2, room: 'ET-204', lab: 'ET-Lab-B' },
  { id: 9, name: 'IT-1', deptId: 3, room: 'IT-301', lab: 'IT-Lab-A' },
  { id: 10, name: 'IT-2', deptId: 3, room: 'IT-302', lab: 'IT-Lab-B' },
  { id: 11, name: 'IT-3', deptId: 3, room: 'IT-303', lab: 'IT-Lab-A' },
  { id: 12, name: 'IT-4', deptId: 3, room: 'IT-304', lab: 'IT-Lab-B' },
  { id: 13, name: 'AIDS-1', deptId: 4, room: 'AI-401', lab: 'AI-Lab-A' },
  { id: 14, name: 'AIDS-2', deptId: 4, room: 'AI-402', lab: 'AI-Lab-B' },
  { id: 15, name: 'AIDS-3', deptId: 4, room: 'AI-403', lab: 'AI-Lab-A' },
  { id: 16, name: 'AIDS-4', deptId: 4, room: 'AI-404', lab: 'AI-Lab-B' },
  { id: 17, name: 'ENCE-1', deptId: 5, room: 'EC-501', lab: 'EC-Lab-A' },
  { id: 18, name: 'ENCE-2', deptId: 5, room: 'EC-502', lab: 'EC-Lab-B' },
  { id: 19, name: 'ENCE-3', deptId: 5, room: 'EC-503', lab: 'EC-Lab-A' },
  { id: 20, name: 'ENCE-4', deptId: 5, room: 'EC-504', lab: 'EC-Lab-B' }
];

const SUBJECTS_BY_DEPT = {
  1: [
    { id: 1, code: 'CS001', name: 'Data Structures' },
    { id: 2, code: 'CS002', name: 'Database Management Systems' },
    { id: 3, code: 'CS003', name: 'Operating Systems' },
    { id: 4, code: 'CS004', name: 'Computer Networks' },
    { id: 5, code: 'CS005', name: 'Software Engineering' },
    { id: 6, code: 'CS006', name: 'Artificial Intelligence' },
    { id: 7, code: 'CS007', name: 'Web Technology' },
    { id: 8, code: 'CS008', name: 'Theory of Computation' }
  ],
  2: [
    { id: 9, code: 'ENTC001', name: 'Signals and Systems' },
    { id: 10, code: 'ENTC002', name: 'Analog Circuits' },
    { id: 11, code: 'ENTC003', name: 'Digital Communication' },
    { id: 12, code: 'ENTC004', name: 'Microcontrollers' },
    { id: 13, code: 'ENTC005', name: 'VLSI Design' },
    { id: 14, code: 'ENTC006', name: 'Embedded Systems' },
    { id: 15, code: 'ENTC007', name: 'Control Systems' },
    { id: 16, code: 'ENTC008', name: 'Computer Networks' }
  ],
  3: [
    { id: 17, code: 'IT001', name: 'Database Management Systems' },
    { id: 18, code: 'IT002', name: 'Web Technology' },
    { id: 19, code: 'IT003', name: 'Operating Systems' },
    { id: 20, code: 'IT004', name: 'Computer Networks' },
    { id: 21, code: 'IT005', name: 'Cloud Computing' },
    { id: 22, code: 'IT006', name: 'Information Security' },
    { id: 23, code: 'IT007', name: 'Data Structures' },
    { id: 24, code: 'IT008', name: 'Software Engineering' }
  ],
  4: [
    { id: 25, code: 'AIDS001', name: 'Machine Learning' },
    { id: 26, code: 'AIDS002', name: 'Statistics for Data Science' },
    { id: 27, code: 'AIDS003', name: 'Artificial Intelligence' },
    { id: 28, code: 'AIDS004', name: 'Data Mining' },
    { id: 29, code: 'AIDS005', name: 'Big Data Analytics' },
    { id: 30, code: 'AIDS006', name: 'Python Programming' },
    { id: 31, code: 'AIDS007', name: 'Database Management Systems' },
    { id: 32, code: 'AIDS008', name: 'Deep Learning' }
  ],
  5: [
    { id: 33, code: 'ENCE001', name: 'Digital Systems' },
    { id: 34, code: 'ENCE002', name: 'Computer Architecture' },
    { id: 35, code: 'ENCE003', name: 'Embedded Systems' },
    { id: 36, code: 'ENCE004', name: 'Data Structures' },
    { id: 37, code: 'ENCE005', name: 'Database Management Systems' },
    { id: 38, code: 'ENCE006', name: 'VLSI Design' },
    { id: 39, code: 'ENCE007', name: 'Operating Systems' },
    { id: 40, code: 'ENCE008', name: 'Computer Networks' }
  ]
};

const FACULTY_BY_DEPT = {
  1: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56],
  2: [2, 7, 12, 17, 22, 27, 32, 37, 42, 47, 52, 57],
  3: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58],
  4: [4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59],
  5: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
};

// Realistic topics mapped per subject
const TOPICS = {
  'Data Structures': [
    'Abstract Data Types & Array Representation',
    'Singly & Doubly Linked Lists Implementation',
    'Stack Applications and Expression Evaluation',
    'Queue Implementations and Priority Queues',
    'Binary Search Trees and Tree Traversal',
    'Balanced Search Trees and AVL Rotations',
    'Graph Representation Adjacency Matrix & List',
    'Graph Traversals Breadth & Depth First Search',
    'Minimum Spanning Trees Prim & Kruskal',
    'Shortest Path Dijkstra Algorithm',
    'Hash Tables and Collision Handling Techniques',
    'Sorting Techniques Quicksort & Mergesort',
    'Heap Sort & Advanced Heap Operations',
    'Dynamic Programming on Data Structures'
  ],
  'Database Management Systems': [
    'Database Architecture and 3-Tier Schema',
    'Entity-Relationship Modeling and Constraints',
    'Relational Model and Integrity Constraints',
    'Relational Algebra Queries and Operations',
    'SQL DDL, DML and Subquery Formulations',
    'Complex Joins and Aggregate Functions in SQL',
    'Functional Dependencies and Normalization 1NF to 3NF',
    'Boyce-Codd Normal Form BCNF Decomposition',
    'Transaction Concepts and ACID Properties',
    'Concurrency Control Schedules and Serializability',
    'Two-Phase Locking Protocol and Deadlock Avoidance',
    'Database Indexing B-Trees and B+ Trees',
    'Query Processing and Cost Optimization',
    'Crash Recovery Algorithms and Write-Ahead Logging'
  ],
  'Operating Systems': [
    'Operating System Services and System Calls',
    'Process Control Blocks and Context Switching',
    'Inter-process Communication Shared Memory and Pipes',
    'CPU Scheduling FCFS, SJF, and Round Robin',
    'Multi-level Queue & Feedback Scheduling',
    'Process Synchronization and Critical Section Problem',
    'Peterson Algorithm and Hardware Mutex Locks',
    'Semaphores and Classical Synchronization Problems',
    'Deadlock Characterization and Banker Algorithm',
    'Main Memory Management and Swapping',
    'Paging Architecture and Translation Lookaside Buffer',
    'Virtual Memory and Demand Paging',
    'Page Replacement Algorithms FIFO, LRU, Optimal',
    'File System Structure and Directory Management',
    'Disk Storage Scheduling SCAN and C-SCAN'
  ],
  'Computer Networks': [
    'OSI Reference Model and TCP/IP Architecture',
    'Transmission Media and Physical Layer Standards',
    'Data Link Layer Framing and Flow Control',
    'Error Detection CRC and Hamming Codes',
    'Sliding Window Protocols Go-Back-N and Selective Repeat',
    'Medium Access Control CSMA/CD and CSMA/CA',
    'Ethernet Standards and Switching Technologies',
    'IPv4 Addressing, Subnetting and CIDR Notation',
    'Routing Protocols Distance Vector & Link State',
    'Interior Gateway Routing OSPF and Border Gateway BGP',
    'Transport Layer Protocols UDP and TCP Architecture',
    'TCP Connection Management Three-Way Handshake',
    'TCP Congestion Control AIMD and Slow Start',
    'Application Protocols DNS, HTTP, SMTP and DHCP',
    'Network Security Basics Firewalls and TLS/SSL'
  ],
  'Software Engineering': [
    'Software Engineering Principles and SDLC Lifecycles',
    'Agile Methodology Scrum and Kanban Frameworks',
    'Requirements Engineering and SRS Specifications',
    'Architectural Design and Modularization Patterns',
    'Unified Modeling Language UML Class and Sequence Diagrams',
    'Component-level Design and Interface Design',
    'Clean Code Guidelines and SOLID Principles',
    'Software Refactoring and Code Smell Identification',
    'Software Testing Strategies Unit and Integration',
    'Black-box and White-box Testing Techniques',
    'Automated Testing and Continuous Integration CI/CD',
    'Software Configuration and Version Control Workflows',
    'Software Project Estimation and Function Points',
    'Risk Analysis, Mitigation and Quality Assurance'
  ],
  'Artificial Intelligence': [
    'AI Foundations and Intelligent Agent Architectures',
    'Uninformed Search BFS, DFS and Uniform Cost Search',
    'Informed Heuristic Search A* and Greedy Best-First',
    'Adversarial Search Minimax and Alpha-Beta Pruning',
    'Constraint Satisfaction Problems CSP Formulation',
    'Propositional Logic and Inference Rules',
    'First-Order Predicate Logic Knowledge Representation',
    'Uncertainty and Probabilistic Reasoning Bayesian Networks',
    'Markov Decision Processes and Bellman Equations',
    'Supervised Learning Regression and Classification',
    'Unsupervised Clustering K-Means and Hierarchical',
    'Neural Network Perceptrons and Multi-Layer Architectures',
    'Reinforcement Learning Q-Learning Concepts',
    'Ethics in AI and Explainable Systems'
  ],
  'Web Technology': [
    'Web Architecture Client-Server Model and HTTP/HTTPS',
    'Modern HTML5 Elements and Accessibility ARIA',
    'CSS3 Flexbox and Responsive Grid Layouts',
    'CSS Preprocessors and Utility-First Tailwind CSS',
    'JavaScript ES6+ Syntax, Scope, and Closures',
    'Asynchronous JavaScript Promises and Async/Await',
    'DOM Manipulation, Event Bubbling and Delegation',
    'Frontend Framework Concepts Component Architecture',
    'React Component Lifecycle, Props and State Hooks',
    'React Router and Single Page Application Routing',
    'State Management in Modern Web Applications',
    'Node.js Runtime and Express.js REST API Development',
    'Authentication Mechanisms JWT and Cookie Sessions',
    'Web Security OWASP Top 10 XSS, CSRF, and SQL Injection',
    'Web Performance Optimization and Asset Bundling'
  ],
  'Theory of Computation': [
    'Alphabets, Strings, Formal Languages and Automata',
    'Deterministic Finite Automata DFA Design and Minimization',
    'Non-deterministic Finite Automata NFA to DFA Conversion',
    'Regular Expressions and Kleene Theorem',
    'Pumping Lemma for Regular Languages and Non-regularity',
    'Context-Free Grammars CFG and Derivation Trees',
    'Chomsky Normal Form and Ambiguity in Grammars',
    'Pushdown Automata PDA Acceptance by Empty Stack/Final State',
    'Pumping Lemma for Context-Free Languages',
    'Turing Machines Formal Definition and Instantaneous Descriptions',
    'Turing Machine as Language Accepters and Transducers',
    'Decidability and Undecidable Problems Halting Problem',
    'Post Correspondence Problem and Reducibility',
    'Computational Complexity Classes P, NP and NP-Complete'
  ],
  'Machine Learning': [
    'Machine Learning Paradigms and Workflow Pipeline',
    'Data Preprocessing Feature Scaling and Imputation',
    'Linear Regression and Ordinary Least Squares',
    'Logistic Regression and Binary Classification Metrics',
    'Decision Trees and Information Gain Criterion',
    'Ensemble Methods Random Forests and Bagging',
    'Gradient Boosting Machines XGBoost and LightGBM',
    'Support Vector Machines Kernel Trick and Hyperplanes',
    'K-Nearest Neighbors and Distance Metrics',
    'Dimensionality Reduction Principal Component Analysis PCA',
    'K-Means Clustering and Silhouette Analysis',
    'Model Evaluation Cross-Validation and ROC-AUC',
    'Hyperparameter Tuning Grid Search and Bayesian Optimization',
    'Bias-Variance Tradeoff and Regularization L1/L2'
  ],
  'Deep Learning': [
    'Deep Learning Foundations and Biological Inspiration',
    'Feedforward Neural Networks and Activation Functions',
    'Backpropagation Algorithm and Chain Rule Derivations',
    'Optimization Algorithms SGD, Momentum, and Adam',
    'Regularization Techniques Dropout, Batch Normalization',
    'Convolutional Neural Networks CNN Architecture',
    'Convolution and Pooling Layers for Feature Extraction',
    'Pretrained Models and Transfer Learning VGG, ResNet',
    'Recurrent Neural Networks RNN and Sequential Data',
    'Long Short-Term Memory LSTM and Gated Recurrent Units GRU',
    'Attention Mechanisms and Self-Attention Formulation',
    'Transformer Architecture and Vision Transformers',
    'Generative Adversarial Networks GANs Principles',
    'Deep Learning Model Deployment and Quantization'
  ]
};

function getTopicsForSubject(subjectName) {
  for (const key of Object.keys(TOPICS)) {
    if (subjectName.toLowerCase().includes(key.toLowerCase())) {
      return TOPICS[key];
    }
  }
  return [
    'Foundations and Fundamental Theoretical Principles',
    'Core Concepts and Mathematical Formulations',
    'Algorithmic Structures and Analysis',
    'System Architecture and Hardware/Software Interface',
    'Design Methodologies and Standard Approaches',
    'Practical Implementations and Case Studies',
    'Performance Evaluation and Optimization Techniques',
    'Industry Standards and Modern Advancements'
  ];
}

// Pseudo-random generator using mathematical sine hash
function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 2. Generate Timetable CSV (Mon-Fri, 5 periods/day for each section)
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function generateTimetableData() {
  const timetableRows = [];
  let ttId = 1;

  for (const sec of SECTIONS) {
    const deptSubjects = SUBJECTS_BY_DEPT[sec.deptId];
    const deptFaculty = FACULTY_BY_DEPT[sec.deptId];

    // Distribute all 8 subjects across the 5 days (5 periods/day = 25 periods/week)
    // Shift pattern based on section.id so different sections have different daily layouts
    const secOffset = (sec.id - 1) * 2;

    for (let dayIdx = 0; dayIdx < DAYS.length; dayIdx++) {
      const day = DAYS[dayIdx];

      // 5 periods for this day
      for (let p = 0; p < 5; p++) {
        const slotGlobalIdx = dayIdx * 5 + p;
        const subIndex = (slotGlobalIdx + secOffset) % deptSubjects.length;
        const facIndex = (slotGlobalIdx + (sec.id - 1) * 3) % deptFaculty.length;

        const subject = deptSubjects[subIndex];
        const facultyId = deptFaculty[facIndex];

        let startTime, endTime, type, room;

        if (p === 0) {
          startTime = '09:00:00';
          endTime = '10:00:00';
          type = 'Lecture';
          room = sec.room;
        } else if (p === 1) {
          startTime = '10:15:00';
          endTime = '11:15:00';
          type = 'Lecture';
          room = sec.room;
        } else if (p === 2) {
          startTime = '11:30:00';
          endTime = '12:30:00';
          type = 'Lecture';
          room = sec.room;
        } else if (p === 3) {
          startTime = '13:30:00';
          endTime = '14:30:00';
          type = 'Lecture';
          room = sec.room;
        } else {
          // Period 5: Lab on Tue & Thu (2 hours), Lecture on Mon, Wed, Fri
          if (day === 'Tuesday' || day === 'Thursday') {
            startTime = '14:45:00';
            endTime = '16:45:00';
            type = 'Lab';
            room = sec.lab;
          } else {
            startTime = '14:45:00';
            endTime = '15:45:00';
            type = 'Lecture';
            room = sec.room;
          }
        }

        timetableRows.push({
          timetable_id: ttId++,
          section_id: sec.id,
          subject_id: subject.id,
          faculty_id: facultyId,
          day_of_week: day,
          start_time: startTime,
          end_time: endTime,
          room_no: room,
          semester_id: 5,
          timetable_type: type
        });
      }
    }
  }

  return timetableRows;
}

// 3. Generate Academic Calendar Dates
function generateAcademicCalendar() {
  const dates = [];
  const start = new Date(2026, 7, 17); // Aug 17, 2026
  const end = new Date(2026, 9, 16);   // Oct 16, 2026

  let curr = new Date(start);
  while (curr <= end) {
    const day = curr.getDay(); // 0 is Sun, 6 is Sat
    if (day >= 1 && day <= 5) {
      const year = curr.getFullYear();
      const month = String(curr.getMonth() + 1).padStart(2, '0');
      const d = String(curr.getDate()).padStart(2, '0');
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      dates.push({
        dateStr: `${year}-${month}-${d}`,
        dayName: dayNames[day]
      });
    }
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

// 4. Generate Sessions and Student Attendance Records
async function generateAttendanceData(db, timetables) {
  const calendar = generateAcademicCalendar();
  console.log(`Generated ${calendar.length} instructional calendar dates.`);

  // Load students by section from database
  const [students] = await db.query('SELECT student_id, section_id FROM student ORDER BY section_id, student_id');
  const studentsBySec = {};
  for (const s of students) {
    if (!studentsBySec[s.section_id]) studentsBySec[s.section_id] = [];
    studentsBySec[s.section_id].push(s.student_id);
  }

  // Pre-assign student attendance bias (e.g. attendance rate between 70% and 96%)
  const studentRate = {};
  for (const s of students) {
    const mod = s.student_id % 12;
    if (mod === 0) {
      // ~8% students have under 75% attendance (68-73%) to test statutory warnings
      studentRate[s.student_id] = 0.68 + ((s.student_id % 5) * 0.012);
    } else if (mod === 11) {
      // ~8% students have top attendance (94-98%)
      studentRate[s.student_id] = 0.94 + ((s.student_id % 4) * 0.01);
    } else {
      // 84% students have solid 80-92% attendance
      studentRate[s.student_id] = 0.82 + ((s.student_id % 10) * 0.011);
    }
  }

  // Map timetables by section and day
  const ttBySecDay = {};
  for (const tt of timetables) {
    const key = `${tt.section_id}_${tt.day_of_week}`;
    if (!ttBySecDay[key]) ttBySecDay[key] = [];
    ttBySecDay[key].push(tt);
  }

  // Subject lookup
  const [subRows] = await db.query('SELECT subject_id, subject_name FROM subject');
  const subMap = {};
  subRows.forEach(s => { subMap[s.subject_id] = s.subject_name; });

  const sessions = [];
  const records = [];
  let sessionId = 1;
  let recordId = 1;

  // Track topic index per section and subject
  const topicCounter = {};

  for (const cal of calendar) {
    for (const sec of SECTIONS) {
      const daySlots = ttBySecDay[`${sec.id}_${cal.dayName}`] || [];
      const secStudents = studentsBySec[sec.id] || [];
      if (!secStudents.length) continue;

      // Select 3 to 4 slots each day to simulate realistic conducted sessions
      for (let slotIdx = 0; slotIdx < Math.min(daySlots.length, 3); slotIdx++) {
        const slot = daySlots[slotIdx];
        const subName = subMap[slot.subject_id] || 'Core Course';
        const topicList = getTopicsForSubject(subName);
        const tKey = `${sec.id}_${slot.subject_id}`;
        topicCounter[tKey] = (topicCounter[tKey] || 0);
        const topic = topicList[topicCounter[tKey] % topicList.length];
        topicCounter[tKey]++;

        const periodLabel = `Period ${slotIdx + 1} (${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)})`;

        const curSessionId = sessionId++;
        sessions.push({
          session_id: curSessionId,
          section_id: sec.id,
          subject_id: slot.subject_id,
          faculty_id: slot.faculty_id,
          session_date: cal.dateStr,
          period: periodLabel,
          topic_covered: topic
        });

        // Generate attendance records for each student in the section
        for (let stuIdx = 0; stuIdx < secStudents.length; stuIdx++) {
          const stuId = secStudents[stuIdx];
          const baseRate = studentRate[stuId] || 0.85;

          // Pseudo-random value using sine hash based on session and student ID
          const seed = curSessionId * 1000 + stuId * 17 + slot.subject_id * 31;
          const randomVal = pseudoRandom(seed);
          const isPresent = randomVal < baseRate;

          records.push({
            record_id: recordId++,
            session_id: curSessionId,
            student_id: stuId,
            status: isPresent ? 'Present' : 'Absent',
            remarks: isPresent ? null : (randomVal > 0.95 ? 'Medical Leave' : (randomVal > 0.92 ? 'On Duty' : null))
          });
        }
      }
    }
  }

  return { sessions, records };
}

// 5. Main generator runner
async function main() {
  console.log('Generating Timetable, Attendance Sessions, and Attendance Records...');
  const db = require('../server/config/db');

  // Step 1: Timetable
  const timetableRows = generateTimetableData();
  console.log(`Generated ${timetableRows.length} timetable schedule rows across 20 sections.`);

  const ttCsvHeader = 'timetable_id,section_id,subject_id,faculty_id,day_of_week,start_time,end_time,room_no,semester_id,timetable_type\n';
  const ttCsvBody = timetableRows.map(r => 
    `${r.timetable_id},${r.section_id},${r.subject_id},${r.faculty_id},${r.day_of_week},${r.start_time},${r.end_time},"${r.room_no}",${r.semester_id},${r.timetable_type}`
  ).join('\n');
  const ttPath = path.resolve(__dirname, '../data_import/08_academics_course_management/timetable.csv');
  fs.writeFileSync(ttPath, ttCsvHeader + ttCsvBody, 'utf8');
  console.log(`Saved timetable to ${ttPath}`);

  // Step 2: Sessions & Records
  const { sessions, records } = await generateAttendanceData(db, timetableRows);
  console.log(`Generated ${sessions.length} attendance sessions.`);
  console.log(`Generated ${records.length} individual student attendance records.`);

  const sesCsvHeader = 'session_id,section_id,subject_id,faculty_id,session_date,period,topic_covered\n';
  const sesCsvBody = sessions.map(s => 
    `${s.session_id},${s.section_id},${s.subject_id},${s.faculty_id},${s.session_date},"${s.period}","${s.topic_covered}"`
  ).join('\n');
  const sesPath = path.resolve(__dirname, '../data_import/06_attendance/attendance_session.csv');
  fs.writeFileSync(sesPath, sesCsvHeader + sesCsvBody, 'utf8');
  console.log(`Saved attendance sessions to ${sesPath}`);

  const recCsvHeader = 'record_id,session_id,student_id,status,remarks\n';
  const recCsvBody = records.map(r => 
    `${r.record_id},${r.session_id},${r.student_id},${r.status},${r.remarks ? `"${r.remarks}"` : ''}`
  ).join('\n');
  const recPath = path.resolve(__dirname, '../data_import/06_attendance/attendance_record.csv');
  fs.writeFileSync(recPath, recCsvHeader + recCsvBody, 'utf8');
  console.log(`Saved attendance records to ${recPath}`);

  console.log('\n--- DATA GENERATION COMPLETE ---');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
