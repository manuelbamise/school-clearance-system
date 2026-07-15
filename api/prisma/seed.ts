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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
