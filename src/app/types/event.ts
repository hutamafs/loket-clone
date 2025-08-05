export interface Event {
  id: string;
  source: string;
  name: string;
  description: string;
  start: string;
  image: string;
  venue: {
    name: string;
    address: string;
  };
  price: {
    display: string;
    currency: string;
  };
  category: string;
  canEdit: boolean;
  canRegister: boolean;
}

export interface EventCardProps {
  event: Event;
  onRegister?: (eventId: string) => void;
}

export interface ImageProps {
  width: number;
}

export interface TicketmasterVenue {
  name?: string;
  address?: {
    line1?: string;
  };
  city?: {
    name?: string;
  };
  state?: {
    stateCode?: string;
  };
  location?: {
    latitude?: string;
    longitude?: string;
  };
}

export interface TicketmasterImage {
  url: string;
  width?: number;
  height?: number;
}

export interface TicketmasterPriceRange {
  min?: number;
  max?: number;
  currency?: string;
}

export interface TicketmasterClassification {
  segment?: {
    name?: string;
  };
}

export interface TicketmasterEvent {
  id: string;
  name: string;
  info?: string;
  pleaseNote?: string;
  url: string;
  images?: TicketmasterImage[];
  priceRanges?: TicketmasterPriceRange[];
  classifications?: TicketmasterClassification[];
  dates?: {
    start?: {
      dateTime?: string;
      localDate?: string;
      localTime?: string;
    };
    end?: {
      dateTime?: string;
    };
  };
  _embedded?: {
    venues?: TicketmasterVenue[];
  };
}
