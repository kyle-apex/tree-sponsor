import { Product, Role, Sponsorship, Subscription, Tree, User } from '@prisma/client';
import { Stripe } from 'stripe';

export type PartialSubscription = Partial<Subscription & { product?: Partial<Product> } & { user?: Partial<User> }>;
export type StripeSubscription = Stripe.Subscription & { plan?: { product?: string; amount: number } };
export type PartialUser = Partial<User & { roles?: Partial<Role>[] }>;
export type PartialSponsorship = Partial<Sponsorship & { tree?: Partial<Tree> } & { user?: Partial<User> }>;

export type FileWithContent = { type?: string; content?: string };
