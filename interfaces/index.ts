import {
  Product,
  Role,
  Sponsorship,
  Subscription,
  Tree,
  User,
  Comment,
  Reaction,
  Notification,
  Profile,
  Location,
  Species,
  ReviewStatus as ReviewStatusPrisma,
  TreeImage,
  Category,
  Event,
  Donation,
  EventCheckIn,
} from '@prisma/client';
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

export type StreetViewLocation = {
  heading?: string;
  pitch?: string;
} & Coordinate;

export type Coordinate = {
  latitude?: number;
  longitude?: number;
};

export type Attendee = {
  name?: string;
  email?: string;
  userId?: number;
  isMember: boolean;
  eventName?: string;
  eventId?: string;
  createdDate?: Date;
  checkinId?: number;
  discoveredFrom?: string;
  emailOptIn?: string;
};
export type PartialAttendee = Partial<Attendee>;

export type FieldSize = 'small' | 'medium';

export interface NextSession extends Record<string, unknown>, DefaultSession {}
export type ReviewStatus = ReviewStatusPrisma | '';
export type PartialSpecies = Partial<Species>;
export type PartialTreeImage = Partial<TreeImage>;
export type PartialTree = Partial<Tree> & { images?: PartialTreeImage[]; species?: PartialSpecies; location?: PartialLocation };

export type PartialEvent = Partial<Event> & { categories?: PartialCategory[]; trees?: PartialTree[]; location?: PartialLocation };
export type PartialCategory = Partial<Category> & { events?: PartialEvent[]; trees?: PartialTree[] };
export type PartialEventCheckIn = Partial<EventCheckIn> & { user?: PartialUser; event?: PartialEvent };
export type PartialProfile = Partial<Profile>;

export type PartialDonation = Partial<Donation>;

export type PartialComment = Partial<Comment & { user?: Partial<User> } & { reactions?: Partial<Reaction>[] }>;
export type PartialReaction = Partial<Reaction & { user?: Partial<User> }>;
export type PartialNotification = Partial<Notification & { user?: Partial<User>; sourceUser?: Partial<User> }>;
export type PartialLocation = Partial<Location>;
export type PartialSubscription = Partial<Subscription & { product?: Partial<Product> } & { user?: Partial<User> }>;
export type StripeSubscription = Stripe.Subscription & { plan?: { product?: string; amount: number } };
export type PartialSponsorship = Partial<
  Sponsorship & { tree?: Partial<Tree> } & { user?: Partial<User> } & { comments?: Partial<Comment>[] } & {
    reactions?: Partial<Reaction>[];
  }
>;
export type PartialUser = Partial<
  User & {
    roles?: Partial<Role>[];
    sponsorships?: PartialSponsorship[];
    subscriptions?: Partial<Subscription>[];
    profile?: Partial<Profile>;
  }
>;

export type MapStyle = 'SATELLITE' | 'STREET' | 'SIMPLE';

export type Viewport = Omit<ViewportProps, 'width' | 'height'> & { height: string | number; width: string | number };

export type Session = Partial<NextSession> & { user?: PartialUser };

export type TitleSection = { title: string; description: string };
