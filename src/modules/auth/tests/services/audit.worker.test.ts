// import { Worker } from "bullmq";
// import { describe, it, expect, beforeAll, afterAll } from "vitest";

// import { prisma } from "@/bootstrap/prisma";
// import { auditQueue } from "@/shared/queues/audit.queue";
// import { connection } from "@/shared/queues/audit.queue"; // আপনার Redis connection

// describe("Audit Worker Integration Test", () => {
//     let worker: Worker;
//     let testHospitalId: string;
//     let testUserId: string;

//     beforeAll(async () => {
//         // ১. টেস্ট শুরু করার আগে ডাটাবেজ ক্লিন করুন
//         await prisma.auditLog.deleteMany();
//         await prisma.user.deleteMany();
//         await prisma.hospital.deleteMany();

//         // ২. টেস্টের জন্য একটি সাময়িক Worker চালু করুন
//         // ২. একটি ভ্যালিড হাসপাতাল তৈরি করুন
//         const hospital = await prisma.hospital.create({
//             data: {
//                 name: "Test General Hospital",
//                 slug: "test-general-hospital",
//                 address: "Dhaka, Bangladesh",
//                 // আপনার স্কিমা অনুযায়ী অন্য রিকোয়ার্ড ফিল্ডগুলো দিন
//             }
//         });
//         testHospitalId = hospital.id;

//         // ৩. একটি টেস্ট ইউজার তৈরি করুন (হাসপাতালের সাথে যুক্ত থাকলে সেটিও দিন)
//         const user = await prisma.user.create({
//             data: {
//                 name: "Shamim Reza",
//                 email: "test@example.com",
//                 password: "hashedpassword", // আপনার স্কিমা অনুযায়ী
//                 hospitalId: testHospitalId, // যদি ইউজার হাসপাতালের সাথে রিলেটেড হয়
//                 role: "ADMIN"
//             }
//         });
//         testUserId = user.id;

//         worker = new Worker(
//             "audit-log", // আপনার কিউ এর নাম (Queue Name)
//             async (job) => {
//                 // এখানে আপনার আসল প্রসেসিং লজিকটি লিখুন (অথবা ইম্পোর্ট করুন)
//                 await prisma.auditLog.create({
//                     data: job.data
//                 });

//             },
//             { connection }
//         );
//     });

//     afterAll(async () => {
//         await worker.close(); // টেস্ট শেষে ওয়ার্কার বন্ধ করুন
//         await prisma.$disconnect();
//     });

//     it("should process a job and save it to the database", async () => {
//         const testData = {
//             hospitalId: testHospitalId,
//             userId: testUserId,
//             module: "PATIENT_MANAGEMENT", // Required
//             entity: "PATIENT_RECORD",     // Required
//             entityId: "ptr-999",
//             action: "CREATE",             // Required
//             oldValues: null,
//             newValues: { name: "Shamim Reza", bloodGroup: "O+" },
//             ipAddress: "127.0.0.1",
//             userAgent: "Vitest/Node.js",
//         };

//         // কিউতে জব অ্যাড করা
//         await auditQueue.add("test-audit", testData);

//         // ৩. ওয়ার্কারকে প্রসেস করার জন্য কিছুটা সময় দিন (Retry Logic)
//         let savedLog = null;
//         for (let i = 0; i < 5; i++) {
//             savedLog = await prisma.auditLog.findFirst({
//                 where: { userId: "user-123" },
//             });
//             if (savedLog) break;
//             await new Promise((res) => setTimeout(res, 1000)); // প্রতি ১ সেকেন্ড পর চেক করবে
//         }

//         // ৪. ফাইনাল চেক
//         expect(savedLog).not.toBeNull();
//         expect(savedLog?.action).toBe("USER_LOGIN");
//     }, 15000);
// });
