import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const hashPassword = async (password) => bcrypt.hash(password, 10)

async function main() {
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@velmora.com'
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123'

    const managerEmail = process.env.SEED_MANAGER_EMAIL || 'manager@velmora.com'
    const managerPassword = process.env.SEED_MANAGER_PASSWORD || 'Manager@123'

    const storeOwnerEmail = process.env.SEED_STORE_OWNER_EMAIL || 'owner@velmora.com'
    const storeOwnerPassword = process.env.SEED_STORE_OWNER_PASSWORD || 'Owner@123'

    const [adminPasswordHash, managerPasswordHash, ownerPasswordHash] = await Promise.all([
        hashPassword(adminPassword),
        hashPassword(managerPassword),
        hashPassword(storeOwnerPassword),
    ])

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            name: 'Velmora Admin',
            role: 'ADMIN',
            status: 'ACTIVE',
            passwordHash: adminPasswordHash,
        },
        create: {
            name: 'Velmora Admin',
            email: adminEmail,
            role: 'ADMIN',
            status: 'ACTIVE',
            passwordHash: adminPasswordHash,
        },
    })

    const manager = await prisma.user.upsert({
        where: { email: managerEmail },
        update: {
            name: 'Velmora Manager',
            role: 'MANAGER',
            status: 'ACTIVE',
            passwordHash: managerPasswordHash,
        },
        create: {
            name: 'Velmora Manager',
            email: managerEmail,
            role: 'MANAGER',
            status: 'ACTIVE',
            passwordHash: managerPasswordHash,
        },
    })

    const owner = await prisma.user.upsert({
        where: { email: storeOwnerEmail },
        update: {
            name: 'Velmora Store Owner',
            role: 'STAFF',
            status: 'ACTIVE',
            passwordHash: ownerPasswordHash,
        },
        create: {
            name: 'Velmora Store Owner',
            email: storeOwnerEmail,
            role: 'STAFF',
            status: 'ACTIVE',
            passwordHash: ownerPasswordHash,
        },
    })

    await prisma.store.upsert({
        where: { userId: owner.id },
        update: {
            name: 'Velmora Essentials',
            username: 'velmora-essentials',
            description: 'Seeded demo store for backend integration',
            address: 'Pune, India',
            status: 'approved',
            isActive: true,
            logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=VelmoraStore',
            email: 'store@velmora.com',
            contact: '+91-9000000000',
        },
        create: {
            userId: owner.id,
            name: 'Velmora Essentials',
            username: 'velmora-essentials',
            description: 'Seeded demo store for backend integration',
            address: 'Pune, India',
            status: 'approved',
            isActive: true,
            logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=VelmoraStore',
            email: 'store@velmora.com',
            contact: '+91-9000000000',
        },
    })

    console.log('Seed complete')
    console.log(`Admin: ${admin.email}`)
    console.log(`Manager: ${manager.email}`)
    console.log(`Store Owner: ${owner.email}`)
}

main()
    .catch((error) => {
        console.error('Seed failed', error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
