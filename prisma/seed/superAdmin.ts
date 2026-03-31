
import {Role, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";

import { prisma } from "@/bootstrap/prisma";



export const seedSuperAdmin = async () => {
    const email = "admin@system.com";

    // 1. Check যদি already থাকে
    const existing = await prisma.user.findUnique({
        where: {
            tenantId_email: {
                tenantId: "",
                email,
            },
        },
    });

    if (existing) {
        console.log("✅ Super Admin already exists");
        return;
    }

    // 2. Password hash
    const hashedPassword = await bcrypt.hash( "123456", 10);

    // 3. Create Super Admin
    const superAdmin = await prisma.user.create({
        data: {
            name: "Super Admin",
            email,
            password: hashedPassword,

            role: Role.SUPER_ADMIN,
            status: UserStatus.ACTIVE,

            tenantId: null, // 🔥 important

            emailVerified: true,

            createdBy: "system",
        },
    });

    console.log("🚀 Super Admin created:", superAdmin.email);
};