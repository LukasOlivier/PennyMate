import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const mockExpenses: Prisma.ExpenseCreateInput[] = [
  {
    title: "Groceries",
    description: "Weekly supermarket shopping",
    amount: 54.99,
    paidOnBehalf: false,
    paidBackOn: null,
    createdAt: new Date("2024-06-01T10:00:00Z"),
    updatedAt: new Date("2024-06-01T10:00:00Z"),
  },
  {
    title: "Electricity Bill",
    description: "Monthly utility payment",
    amount: 120.5,
    paidOnBehalf: true,
    paidBackOn: new Date("2024-06-05T12:00:00Z"),
    createdAt: new Date("2024-06-02T09:00:00Z"),
    updatedAt: new Date("2024-06-05T12:00:00Z"),
  },
  {
    title: "Dinner Out",
    description: "Dinner with friends",
    amount: 80,
    paidOnBehalf: false,
    paidBackOn: null,
    createdAt: new Date("2024-06-03T19:30:00Z"),
    updatedAt: new Date("2024-06-03T19:30:00Z"),
  },
  {
    title: "Internet Subscription",
    description: "Monthly internet bill",
    amount: 45.25,
    paidOnBehalf: true,
    paidBackOn: null,
    createdAt: new Date("2024-06-04T08:00:00Z"),
    updatedAt: new Date("2024-06-04T08:00:00Z"),
  },
  {
    title: "Movie Tickets",
    description: "Cinema night",
    amount: 30,
    paidOnBehalf: false,
    paidBackOn: null,
    createdAt: new Date("2024-06-05T21:00:00Z"),
    updatedAt: new Date("2024-06-05T21:00:00Z"),
  },
  {
    title: "Taxi Ride",
    description: "Airport transfer",
    amount: 25.75,
    paidOnBehalf: true,
    paidBackOn: new Date("2024-06-06T23:00:00Z"),
    createdAt: new Date("2024-06-06T22:30:00Z"),
    updatedAt: new Date("2024-06-06T23:00:00Z"),
  },
  {
    title: "Coffee",
    description: "Morning coffee run",
    amount: 4.5,
    paidOnBehalf: false,
    paidBackOn: null,
    createdAt: new Date("2024-06-07T08:15:00Z"),
    updatedAt: new Date("2024-06-07T08:15:00Z"),
  },
  {
    title: "Gym Membership",
    description: "Monthly gym fee",
    amount: 60,
    paidOnBehalf: false,
    paidBackOn: null,
    createdAt: new Date("2024-06-08T07:00:00Z"),
    updatedAt: new Date("2024-06-08T07:00:00Z"),
  },
  {
    title: "Book Purchase",
    description: "Bought a programming book",
    amount: 35.99,
    paidOnBehalf: true,
    paidBackOn: null,
    createdAt: new Date("2024-06-09T14:00:00Z"),
    updatedAt: new Date("2024-06-09T14:00:00Z"),
  },
  {
    title: "Laundry",
    description: "Dry cleaning service",
    amount: 18,
    paidOnBehalf: false,
    paidBackOn: null,
    createdAt: new Date("2024-06-10T16:00:00Z"),
    updatedAt: new Date("2024-06-10T16:00:00Z"),
  },
];

async function main() {
  await prisma.expense.createMany({
    data: mockExpenses,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
