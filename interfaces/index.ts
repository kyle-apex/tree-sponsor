import { Product, Role, Sponsorship, Subscription, Tree, User } from '@prisma/client';
import { ViewportProps } from 'react-map-gl';
import { Stripe } from 'stripe';

export interface DefaultSession extends Record<string, unknown> {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires?: string;
}

export interface NextSession extends Record<string, unknown>, DefaultSession {}

export type PartialSubscription = Partial<Subscription & { product?: Partial<Product> } & { user?: Partial<User> }>;
export type StripeSubscription = Stripe.Subscription & { plan?: { product?: string; amount: number } };
export type PartialSponsorship = Partial<Sponsorship & { tree?: Partial<Tree> } & { user?: Partial<User> }>;
export type PartialUser = Partial<User & { roles?: Partial<Role>[]; sponsorships?: PartialSponsorship[] }>;

export type Viewport = Omit<ViewportProps, 'width' | 'height'> & { height: string | number; width: string | number };

export type Session = Partial<NextSession> & { user?: User };

export type TitleSection = { title: string; description: string };
