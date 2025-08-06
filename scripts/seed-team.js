const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const teamMembers = [
  {
    name: "Dr. Michael Evans",
    title: "Geriatric Specialist",
    img: "/team/doctor1.jpg",
  },
  {
    name: "Dr. Anna Lee",
    title: "Senior Care Physician",
    img: "/team/doctor2.jpg",
  },
  {
    name: "Dr. John Smith",
    title: "Rehabilitation Expert",
    img: "/team/doctor3.jpg",
  },
  {
    name: "Dr. Emily Tran",
    title: "Wellness Coordinator",
    img: "/team/doctor4.jpg",
  },
];

async function seedTeamMembers() {
  try {
    console.log('🌱 Seeding team members...');

    // Clear existing team members
    await prisma.teamMember.deleteMany();
    console.log('✅ Cleared existing team members');

    // Create new team members
    for (const member of teamMembers) {
      await prisma.teamMember.create({
        data: member
      });
      console.log(`✅ Created team member: ${member.name}`);
    }

    console.log('🎉 Team members seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding team members:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTeamMembers(); 