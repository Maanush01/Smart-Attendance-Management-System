require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");
const connectDB = require("../src/config/db");

const Department = require("../src/models/Department");
const Program = require("../src/models/Program");
const Section = require("../src/models/Section");
const Subject = require("../src/models/Subject");
const User = require("../src/models/User");
const Student = require("../src/models/Student");
const FacultyAssignment = require("../src/models/FacultyAssignment");
const ClassSession = require("../src/models/ClassSession");
const AttendanceRecord = require("../src/models/AttendanceRecord");
const CorrectionRequest = require("../src/models/CorrectionRequest");
const AuditLog = require("../src/models/AuditLog");

const CONFIG = {
  studentCount: 150,
  facultyCount: 50,
  historyDays: 75,
  bcryptRounds: 10,
  academicYear: `${new Date().getUTCFullYear()}-${String(
    new Date().getUTCFullYear() + 1,
  ).slice(-2)}`,
  passwords: {
    admin: "Admin@123",
    hod: "Hod@123",
    faculty: "Faculty@123",
    student: "Student@123",
  },
};

const args = new Set(process.argv.slice(2));
const getNumericArg = (name, fallback) => {
  const value = process.argv.find((argument) =>
    argument.startsWith(`${name}=`),
  );
  const parsed = value ? Number(value.split("=")[1]) : fallback;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

CONFIG.studentCount = getNumericArg("--students", CONFIG.studentCount);
CONFIG.historyDays = getNumericArg("--days", CONFIG.historyDays);
const force = args.has("--force");

const departmentSeeds = [
  { name: "Computer Science and Engineering", code: "CSE" },
  { name: "Electronics and Communication Engineering", code: "ECE" },
  { name: "Mechanical Engineering", code: "ME" },
  { name: "Civil Engineering", code: "CE" },
  { name: "Information Technology", code: "IT" },
];

const programNames = [
  { name: "B.Tech Computer Science", code: "BTCS", durationYears: 4 },
  {
    name: "B.Tech Electronics and Communication",
    code: "BTEC",
    durationYears: 4,
  },
  { name: "B.Tech Mechanical Engineering", code: "BTME", durationYears: 4 },
  { name: "B.Tech Civil Engineering", code: "BTCE", durationYears: 4 },
  { name: "B.Tech Information Technology", code: "BTIT", durationYears: 4 },
];

const subjectNames = [
  ["Data Structures", "Database Management Systems", "Operating Systems"],
  ["Digital Signal Processing", "Embedded Systems", "Communication Systems"],
  ["Thermodynamics", "Fluid Mechanics", "Manufacturing Technology"],
  [
    "Structural Analysis",
    "Surveying and Geomatics",
    "Environmental Engineering",
  ],
  ["Web Engineering", "Computer Networks", "Software Testing"],
];

const clearCollections = async () => {
  const collections = [
    AuditLog,
    CorrectionRequest,
    AttendanceRecord,
    ClassSession,
    FacultyAssignment,
    Student,
    User,
    Section,
    Subject,
    Program,
    Department,
  ];

  await Promise.all(collections.map((model) => model.deleteMany({})));
  console.log("Cleared existing seed collections.");
};

const hasExistingData = async () => {
  const counts = await Promise.all(
    [
      Department,
      Program,
      Section,
      Subject,
      User,
      Student,
      FacultyAssignment,
      ClassSession,
      AttendanceRecord,
      CorrectionRequest,
      AuditLog,
    ].map(async (model) => model.countDocuments()),
  );

  return counts.some((count) => count > 0);
};

const createDateAtNoon = (daysAgo) => {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
};

const getWeekdays = (days) =>
  Array.from({ length: days }, (_, index) => createDateAtNoon(index)).filter(
    (date) => date.getUTCDay() !== 0 && date.getUTCDay() !== 6,
  );

const randomAttendanceStatus = () => {
  const value = Math.random();
  if (value < 0.85) return "PRESENT";
  if (value < 0.95) return "ABSENT";
  return "LATE";
};

const createUsers = async (departments) => {
  const passwordHashes = await Promise.all(
    Object.values(CONFIG.passwords).map((password) =>
      bcrypt.hash(password, CONFIG.bcryptRounds),
    ),
  );
  const [adminHash, hodHash, facultyHash, studentHash] = passwordHashes;

  const admin = await User.create({
    name: "System Admin",
    email: "admin@attendance.com",
    passwordHash: adminHash,
    role: "ADMIN",
  });

  const hods = await User.insertMany(
    departments.map((department, index) => ({
      name: `${department.name} Head`,
      email: `hod.${department.code.toLowerCase()}@college.edu`,
      passwordHash: hodHash,
      role: "HOD",
      departmentId: department._id,
    })),
  );

  const faculty = await User.insertMany(
    Array.from({ length: CONFIG.facultyCount }, (_, index) => {
      const department = departments[index % departments.length];
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      return {
        name: `${firstName} ${lastName}`,
        email: `faculty.${index + 1}.${department.code.toLowerCase()}@college.edu`,
        passwordHash: facultyHash,
        role: "FACULTY",
        departmentId: department._id,
      };
    }),
  );

  const students = await User.insertMany(
    Array.from({ length: CONFIG.studentCount }, (_, index) => {
      const department = departments[index % departments.length];
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      return {
        name: `${firstName} ${lastName}`,
        email: `student.${index + 1}.${department.code.toLowerCase()}@college.edu`,
        passwordHash: studentHash,
        role: "STUDENT",
        departmentId: department._id,
      };
    }),
  );

  await Department.bulkWrite(
    departments.map((department, index) => ({
      updateOne: {
        filter: { _id: department._id },
        update: { $set: { hodId: hods[index]._id } },
      },
    })),
  );

  console.log(
    `Seeded 1 admin, ${hods.length} HODs, ${faculty.length} faculty, and ${students.length} student users.`,
  );
  return { admin, faculty, students };
};

const createAcademicData = async (departments) => {
  const programs = await Program.insertMany(
    programNames.map((program, index) => ({
      ...program,
      departmentId: departments[index]._id,
    })),
  );

  const subjects = await Subject.insertMany(
    programs.flatMap((program, programIndex) =>
      subjectNames[programIndex].map((name, subjectIndex) => ({
        name,
        code: `${departments[programIndex].code}${subjectIndex + 1}0${programIndex + 1}`,
        programId: program._id,
        semester: [1, 3, 5][subjectIndex],
        credits: subjectIndex === 1 ? 4 : 3,
      })),
    ),
  );

  const sections = await Section.insertMany(
    programs.flatMap((program, programIndex) =>
      [1, 3, 5].map((semester, semesterIndex) => ({
        name: `${departments[programIndex].code}-${String.fromCharCode(65 + semesterIndex)}`,
        programId: program._id,
        batchYear: new Date().getUTCFullYear(),
        semester,
        academicYear: CONFIG.academicYear,
      })),
    ),
  );

  console.log(
    `Seeded ${departments.length} departments, ${programs.length} programs, ${subjects.length} subjects, and ${sections.length} sections.`,
  );
  return { programs, subjects, sections };
};

const createStudentProfiles = async (
  students,
  programs,
  sections,
  departments,
) => {
  const profiles = await Student.insertMany(
    students.map((user, index) => {
      const programIndex = index % programs.length;
      const semesterIndex = Math.floor(index / programs.length) % 3;
      const sectionIndex = programIndex * 3 + semesterIndex;
      const department = departments[programIndex];
      return {
        userId: user._id,
        rollNumber: `${department.code}${new Date().getUTCFullYear()}${String(index + 1).padStart(4, "0")}`,
        registerNumber: `REG${new Date().getUTCFullYear()}${String(index + 1).padStart(5, "0")}`,
        programId: programs[programIndex]._id,
        sectionId: sections[sectionIndex]._id,
        admissionYear: new Date().getUTCFullYear(),
      };
    }),
  );

  console.log(`Seeded ${profiles.length} student profiles.`);
  return profiles;
};

const createAssignments = async (faculty, subjects, sections, programs) => {
  const combos = sections.flatMap((section, sectionIndex) => {
    const programIndex = Math.floor(sectionIndex / 3);
    return subjects
      .filter(
        (subject) =>
          subject.programId.toString() ===
            programs[programIndex]._id.toString() &&
          subject.semester === section.semester,
      )
      .map((subject) => ({ section, subject, programIndex }));
  });

  const assignments = combos.map((combo, index) => ({
    facultyId: faculty[combo.programIndex * 10 + (index % 9)]._id,
    subjectId: combo.subject._id,
    sectionId: combo.section._id,
    academicYear: CONFIG.academicYear,
    semester: combo.section.semester,
  }));

  for (
    let departmentIndex = 0;
    departmentIndex < programs.length;
    departmentIndex += 1
  ) {
    const combo = combos.find((item) => item.programIndex === departmentIndex);
    assignments.push({
      facultyId: faculty[departmentIndex * 10 + 9]._id,
      subjectId: combo.subject._id,
      sectionId: combo.section._id,
      academicYear: CONFIG.academicYear,
      semester: combo.section.semester,
    });
  }

  const created = await FacultyAssignment.insertMany(assignments);
  console.log(`Seeded ${created.length} faculty assignments.`);
  return combos.map((combo, index) => ({
    ...combo,
    facultyId: assignments[index].facultyId,
  }));
};

const createSessionsAndAttendance = async (assignments, profiles) => {
  const weekdays = getWeekdays(CONFIG.historyDays);
  const studentsBySection = new Map();

  profiles.forEach((student) => {
    const sectionId = student.sectionId.toString();
    const current = studentsBySection.get(sectionId) || [];
    current.push(student);
    studentsBySection.set(sectionId, current);
  });

  const sessions = [];
  const sessionStudents = [];

  assignments.forEach((assignment) => {
    const sectionStudents =
      studentsBySection.get(assignment.section._id.toString()) || [];
    weekdays.forEach((date) => {
      sessions.push({
        sectionId: assignment.section._id,
        subjectId: assignment.subject._id,
        facultyId: assignment.facultyId,
        date,
        startTime: "09:00",
        endTime: "10:00",
        status: "COMPLETED",
      });
      sessionStudents.push(sectionStudents);
    });
  });

  const createdSessions = await ClassSession.insertMany(sessions, {
    ordered: true,
  });
  const attendance = [];

  createdSessions.forEach((session, index) => {
    sessionStudents[index].forEach((student) => {
      attendance.push({
        sessionId: session._id,
        studentId: student._id,
        status: randomAttendanceStatus(),
        markedBy: sessions[index].facultyId,
        markedAt: sessions[index].date,
      });
    });
  });

  const createdAttendance = await AttendanceRecord.insertMany(attendance, {
    ordered: true,
  });

  console.log(`Seeded ${createdSessions.length} class sessions.`);
  console.log(`Seeded ${createdAttendance.length} attendance records.`);
};

const printCredentials = () => {
  console.log("\nSample login credentials:");
  console.log("Admin:   admin@attendance.com / Admin@123");
  console.log("HOD:     hod.cse@college.edu / Hod@123");
  console.log("Faculty: faculty.1.cse@college.edu / Faculty@123");
  console.log("Student: student.1.cse@college.edu / Student@123");
};

const seed = async () => {
  try {
    await connectDB();

    if (await hasExistingData()) {
      if (!force) {
        console.error(
          "Database already contains attendance-system data. Re-run with --force to clear seed collections before seeding.",
        );
        process.exitCode = 1;
        return;
      }

      console.warn("--force supplied: clearing attendance-system collections.");
      await clearCollections();
    }

    faker.seed(20260925);
    const departments = await Department.insertMany(departmentSeeds);
    const users = await createUsers(departments);
    const academic = await createAcademicData(departments);
    const profiles = await createStudentProfiles(
      users.students,
      academic.programs,
      academic.sections,
      departments,
    );
    const assignments = await createAssignments(
      users.faculty,
      academic.subjects,
      academic.sections,
      academic.programs,
    );
    await createSessionsAndAttendance(assignments, profiles);
    printCredentials();
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
