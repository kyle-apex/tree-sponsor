import { Product, Role, Subscription, User } from '@prisma/client';
import { Stripe } from 'stripe';

export type PartialSubscription = Partial<Subscription & { product?: Partial<Product> } & { user?: Partial<User> }>;
export type StripeSubscription = Stripe.Subscription & { plan?: { product?: string; amount: number } };
export type PartialUser = Partial<User & { roles?: Partial<Role>[] }>;
