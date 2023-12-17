import { prisma, Prisma } from 'utils/prisma/init';

export default async function initDemoData() {
    const userCount = await prisma.user.count();

    if (userCount > 1) return;

    const user = await prisma.user.create({
        data: {
            name: 'Demo User',
            email: 'demo@user.com',
        },
    });
    const user2 = await prisma.user.create({
        data: {
            name: 'Other User',
            email: 'other@user.com',
        },
    });

    const product = await prisma.product.create({
        data: {
            name: 'Membership',
            amount: 60,
            stripeId: 'DEMOPRODUCT'
        }
    })

    const sub = await prisma.subscription.create({
        data: {
            productId: product.id,
            stripeId: 'DEMOPRODUCT',
            userId: 1,
            createdDate: new Date(),
            lastPaymentDate: new Date()
        }
    })

    const subscription = await prisma.subscription.create({
        data: {
            productId: product.id,
            stripeId: 'DEMOPRODUCT',
            userId: user.id,
            createdDate: new Date(),
            lastPaymentDate: new Date()
        }
    })

    const subscription2 = await prisma.subscription.create({
        data: {
            productId: product.id,
            stripeId: 'DEMOPRODUCT',
            userId: user2.id,
            createdDate: new Date(),
            lastPaymentDate: new Date()
        }
    })

}
