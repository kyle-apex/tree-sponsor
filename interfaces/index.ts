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
  TreeChangeLog,
  SpeciesQuizResponse,
} from '@prisma/client';
import { ViewportProps } from 'react-map-gl';
import { Stripe } from 'stripe';
import { OverridableStringUnion } from '@mui/types';

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

export type QuizCoordinate = Coordinate & { isQuizCorrect?: boolean };

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
export type PartialSpeciesQuizResponse = Partial<SpeciesQuizResponse>;

export type PartialTree = Partial<Tree> & {
  images?: PartialTreeImage[];
  species?: PartialSpecies;
  location?: PartialLocation;
  speciesQuizResponses?: PartialSpeciesQuizResponse[];
};
export type PartialTreeChangeLog = Partial<TreeChangeLog> & { tree: PartialTree };

export type PartialEvent = Partial<Event> & { categories?: PartialCategory[]; trees?: PartialTree[]; location?: PartialLocation };
export type PartialCategory = Partial<Category> & { events?: PartialEvent[]; trees?: PartialTree[] };
export type PartialEventCheckIn = Partial<EventCheckIn> & { user?: PartialUser; event?: PartialEvent };
export type PartialProfile = Partial<Profile>;
export type PartialSpeciesSuggestion = {
  id: number;
  name: string;
  genus: string;
  species: string;
  speciesId: number;
  probability: number;
  similarImages: string[];
};

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
    eventCheckIns?: PartialEventCheckIn[];
  }
>;

export type MapStyle = 'SATELLITE' | 'STREET' | 'SIMPLE';

export type Viewport = Omit<ViewportProps, 'width' | 'height'> & { height: string | number; width: string | number };

export type Session = Partial<NextSession> & { user?: PartialUser };

export type TitleSection = { title: string; description: string };

export type MuiColor = OverridableStringUnion<
  'inherit' | 'action' | 'disabled' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
>;
