import { BookCategory, Author, Publisher, Book, BookCopy, BookIssue, BookReturn, Fine } from '../types';

export const mockBookCategories: BookCategory[] = [
  { category_id: 1, category_name: "Computer Science & AI", description: "Algorithms, Software Engineering, ML & Databases" },
  { category_id: 2, category_name: "Electronics & Microprocessors", description: "VLSI, Signals, Embedded Systems" },
  { category_id: 3, category_name: "Mechanical Engineering", description: "Thermodynamics, Robotics & Manufacturing" },
  { category_id: 4, category_name: "Business & Management", description: "Economics, Marketing, Strategic Management" }
];

export const mockAuthors: Author[] = [
  { author_id: 1, author_name: "Thomas H. Cormen", email: "cormen@dartmouth.edu", nationality: "American" },
  { author_id: 2, author_name: "Abraham Silberschatz", email: "avi@yale.edu", nationality: "American" },
  { author_id: 3, author_name: "Andrew S. Tanenbaum", email: "ast@cs.vu.nl", nationality: "Dutch" },
  { author_id: 4, author_name: "Stuart Russell", email: "russell@berkeley.edu", nationality: "British" }
];

export const mockPublishers: Publisher[] = [
  { publisher_id: 1, publisher_name: "MIT Press", email: "mitpress-orders@mit.edu" },
  { publisher_id: 2, publisher_name: "McGraw Hill Education", email: "support@mheducation.com" },
  { publisher_id: 3, publisher_name: "Pearson Education", email: "custserv@pearson.com" }
];

export const mockBooks: Book[] = [
  {
    isbn: "978-0262033848",
    title: "Introduction to Algorithms (CLRS)",
    edition: "3rd Edition",
    publication_year: 2009,
    language: "English",
    no_of_pages: 1312,
    shelf_no: "S-14",
    rack_no: "R-02",
    shelf_location: "Main Library - Stack 2",
    total_copies: 15,
    available_copies: 9,
    category_id: 1,
    publisher_id: 1,
    category_name: "Computer Science & AI",
    publisher_name: "MIT Press",
    author_names: "Thomas H. Cormen, Charles E. Leiserson"
  },
  {
    isbn: "978-0078022159",
    title: "Database System Concepts",
    edition: "7th Edition",
    publication_year: 2019,
    language: "English",
    no_of_pages: 1376,
    shelf_no: "S-15",
    rack_no: "R-04",
    shelf_location: "Main Library - Stack 2",
    total_copies: 12,
    available_copies: 8,
    category_id: 1,
    publisher_id: 2,
    category_name: "Computer Science & AI",
    publisher_name: "McGraw Hill Education",
    author_names: "Abraham Silberschatz, Henry F. Korth"
  },
  {
    isbn: "978-0133591620",
    title: "Modern Operating Systems",
    edition: "4th Edition",
    publication_year: 2014,
    language: "English",
    no_of_pages: 1136,
    shelf_no: "S-16",
    rack_no: "R-01",
    shelf_location: "Main Library - Stack 2",
    total_copies: 10,
    available_copies: 6,
    category_id: 1,
    publisher_id: 3,
    category_name: "Computer Science & AI",
    publisher_name: "Pearson Education",
    author_names: "Andrew S. Tanenbaum, Herbert Bos"
  },
  {
    isbn: "978-0134610993",
    title: "Artificial Intelligence: A Modern Approach",
    edition: "4th Edition",
    publication_year: 2020,
    language: "English",
    no_of_pages: 1152,
    shelf_no: "S-18",
    rack_no: "R-03",
    shelf_location: "Main Library - Stack 3",
    total_copies: 8,
    available_copies: 5,
    category_id: 1,
    publisher_id: 3,
    category_name: "Computer Science & AI",
    publisher_name: "Pearson Education",
    author_names: "Stuart Russell, Peter Norvig"
  }
];

export const mockBookCopies: BookCopy[] = [
  { copy_id: 1, isbn: "978-0262033848", accession_no: "LIB-CLRS-001", purchase_date: "2023-01-10", status: "Available", condition: "Good" },
  { copy_id: 2, isbn: "978-0262033848", accession_no: "LIB-CLRS-002", purchase_date: "2023-01-10", status: "Issued", condition: "Good" },
  { copy_id: 3, isbn: "978-0078022159", accession_no: "LIB-DBMS-001", purchase_date: "2023-02-15", status: "Available", condition: "New" },
  { copy_id: 4, isbn: "978-0078022159", accession_no: "LIB-DBMS-002", purchase_date: "2023-02-15", status: "Issued", condition: "Good" }
];

export const mockBookIssues: BookIssue[] = [
  {
    issue_id: 1,
    isbn: "978-0262033848",
    copy_id: 2,
    student_id: 1,
    librarian_id: 1,
    issue_date: "2026-09-28",
    due_date: "2026-10-12",
    issue_status: "Issued",
    remarks: "Issued for algorithms lab",
    book_title: "Introduction to Algorithms (CLRS)",
    student_name: "Aarav Sharma",
    accession_no: "LIB-CLRS-002"
  },
  {
    issue_id: 2,
    isbn: "978-0078022159",
    copy_id: 4,
    student_id: 2,
    librarian_id: 1,
    issue_date: "2026-09-20",
    due_date: "2026-10-04",
    issue_status: "Overdue",
    remarks: "Late notice sent",
    book_title: "Database System Concepts",
    student_name: "Ananya Patel",
    accession_no: "LIB-DBMS-002"
  }
];

export const mockBookReturns: BookReturn[] = [
  {
    return_id: 1,
    issue_id: 2,
    return_date: "2026-10-09",
    condition_on_return: "Good",
    days_late: 5,
    remarks: "Returned 5 days overdue"
  }
];

export const mockFines: Fine[] = [
  {
    fine_id: 1,
    student_id: 2,
    return_id: 1,
    fine_type: "Late Return",
    fine_amount: 25.00,
    fine_date: "2026-10-09",
    paid_date: "2026-10-09",
    payment_status: "Paid",
    student_name: "Ananya Patel"
  }
];
