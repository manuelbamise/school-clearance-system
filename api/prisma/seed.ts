import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const departments = [
  { name: 'Computer Science' },
  { name: 'Mathematics' },
  { name: 'Physics' },
  { name: 'Business Administration' },
  { name: 'Engineering' },
];

const users = [
  {
    email: 'super@portal.test',
    password: 'password123',
    name: 'Super Admin',
    role: 'superAdmin' as const,
    staffId: 'ADM001',
  },
  {
    email: 'student@portal.test',
    password: 'password123',
    name: 'John Student',
    role: 'student' as const,
    studentId: 'STU001',
    departmentIndex: 0,
  },
  {
    email: 'academic@portal.test',
    password: 'password123',
    name: 'Dr. Academic',
    role: 'academic' as const,
    staffId: 'ACA001',
    departmentIndex: 0,
  },
  {
    email: 'bursary@portal.test',
    password: 'password123',
    name: 'Bursar Officer',
    role: 'bursary' as const,
    staffId: 'BUR001',
  },
  {
    email: 'department@portal.test',
    password: 'password123',
    name: 'Department Head',
    role: 'department' as const,
    staffId: 'DEP001',
    departmentIndex: 1,
  },
];

const sampleReports = [
  {
    userEmail: 'student@portal.test',
    title: 'Missing Fee Receipt',
    content:
      'I submitted my fee receipt last week but it is still showing as unpaid in my clearance portal. I have checked with the bursary and they say they have not received it.',
    status: 'pending' as const,
  },
  {
    userEmail: 'student@portal.test',
    title: 'Portal Login Issue',
    content:
      'I have been unable to log into the student portal for three days. It keeps saying "invalid credentials" even after resetting my password multiple times.',
    status: 'resolved' as const,
  },
  {
    userEmail: 'academic@portal.test',
    title: 'Lab Equipment Request Denied',
    content:
      'My request for new laboratory equipment was denied without explanation. The current equipment is outdated and affecting practical sessions.',
    status: 'pending' as const,
  },
  {
    userEmail: 'department@portal.test',
    title: 'Course Allocation Issue',
    content:
      'I was assigned to teach three courses this semester but only two appear in the timetable system. The third course has no schedule.',
    status: 'pending' as const,
  },
  {
    userEmail: 'bursary@portal.test',
    title: 'Student Fee Discrepancy Report',
    content:
      'Several students have fee amounts that do not match their payment records. At least 12 cases identified where payments were recorded but not reflected.',
    status: 'resolved' as const,
  },
];

async function main() {
  const createdDepartments = await Promise.all(
    departments.map((dept) =>
      prisma.department.upsert({
        where: { name: dept.name },
        update: {},
        create: dept,
      }),
    ),
  );
  console.log(`Created ${createdDepartments.length} departments`);

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const { departmentIndex, ...rest } = userData;

    await prisma.user.upsert({
      where: { email: rest.email },
      update: {},
      create: {
        ...rest,
        password: hashedPassword,
        departmentId:
          departmentIndex !== undefined
            ? createdDepartments[departmentIndex].id
            : null,
      },
    });
  }
  console.log(`Created ${users.length} users`);

  for (const reportData of sampleReports) {
    const user = await prisma.user.findUnique({
      where: { email: reportData.userEmail },
    });
    if (user) {
      await prisma.report.upsert({
        where: { id: `${reportData.title.replace(/\s+/g, '-').toLowerCase()}` },
        update: {},
        create: {
          id: `${reportData.title.replace(/\s+/g, '-').toLowerCase()}`,
          userId: user.id,
          title: reportData.title,
          content: reportData.content,
          status: reportData.status,
        },
      });
    }
  }
  console.log(`Created ${sampleReports.length} sample reports`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
