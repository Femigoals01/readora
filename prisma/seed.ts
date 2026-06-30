
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = [
    { name: "Leadership", slug: "leadership", icon: "🏆" },
    { name: "Prayer", slug: "prayer", icon: "🔥" },
    { name: "Business", slug: "business", icon: "💼" },
    { name: "Finance", slug: "finance", icon: "💰" },
    { name: "Marriage", slug: "marriage", icon: "❤️" },
    { name: "Personal Growth", slug: "personal-growth", icon: "🌱" },
    { name: "AI & Tech", slug: "ai-tech", icon: "🤖" },
    { name: "Education", slug: "education", icon: "🎓" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const badges = [
    {
      name: "Beginner Reader",
      icon: "📘",
      description: "Completed your first book.",
      requiredXP: 0,
    },
    {
      name: "Bronze Reader",
      icon: "🥉",
      description: "Completed 5 books.",
      requiredXP: 500,
    },
    {
      name: "Silver Reader",
      icon: "🥈",
      description: "Completed 20 books.",
      requiredXP: 2000,
    },
    {
      name: "Gold Reader",
      icon: "🥇",
      description: "Completed 50 books.",
      requiredXP: 5000,
    },
    {
      name: "Kingdom Scholar",
      icon: "👑",
      description: "Completed 100 books.",
      requiredXP: 10000,
    },

    {
  name: "First Book Completed",
  icon: "📘",
  description: "Complete your first book on Readora.",
  requiredXP: null,
},
{
  name: "5 Books Completed",
  icon: "🏅",
  description: "Complete 5 books.",
  requiredXP: null,
},
{
  name: "10 Books Completed",
  icon: "🏆",
  description: "Complete 10 books.",
  requiredXP: null,
},
{
  name: "100 Pages Read",
  icon: "📖",
  description: "Read 100 pages.",
  requiredXP: null,
},
{
  name: "500 Pages Read",
  icon: "🔥",
  description: "Read 500 pages.",
  requiredXP: null,
},
{
  name: "7-Day Streak",
  icon: "🔥",
  description: "Read consistently for 7 days.",
  requiredXP: null,
},
{
  name: "30-Day Streak",
  icon: "👑",
  description: "Maintain a 30-day reading streak.",
  requiredXP: null,
},
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: badge,
      create: badge,
    });
  }

  const challenges = [
  {
    title: "Monthly Growth Challenge",
    description: "Read 2 books this month and write one reflection.",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    rewardXP: 500,
    badgeName: "Faith Builder Badge",
  },
  {
    title: "21-Day Spiritual Growth Challenge",
    description: "Complete Prayer, Holy Spirit, and Leadership books.",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 21)),
    rewardXP: 800,
    badgeName: "Gold Badge",
  },
];

for (const challenge of challenges) {
  await prisma.challenge.upsert({
    where: { title: challenge.title },
    update: challenge,
    create: challenge,
  });
}
  console.log("Readora seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });