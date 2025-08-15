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
    min?: number | null;
    max?: number | null;
    display: string;
    currency: string;
  };
  category: string;
  canEdit: boolean;
  canRegister: boolean;
  url?: string;
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

  promoter?: {
    name: string;
  };
  promoters?: {
    name: string;
  }[];
}

export interface TicketmasterGenre {
  id: string;
  name: string;
}

export interface ITicketMasterVenue {
  ada?: {
    adaPhones?: string;
    adaCustomCopy?: string;
    adaHours?: string;
  };
  address?: {
    line1?: string;
  };
  city?: {
    name?: string;
  };
  country?: {
    name?: string;
    countryCode?: string;
  };
  distance?: number;
  id?: string;
  locale?: string;
  location?: {
    longitude?: string;
    latitude?: string;
  };
  name?: string;
  postalCode?: string;
  state?: {
    name?: string;
    stateCode?: string;
  };
  test?: boolean;
  timezone?: string;
  type?: string;
  units?: string;
  upcomingEvents?: {
    moshtix?: number;
    _total?: number;
    _filtered?: number;
  };
  url?: string;
}

export interface IMappedTicketMasterClassification {
  id: string;
  name: string;
  genres: TicketmasterGenre[];
}

export interface TicketmasterClassification {
  id: string;
  name: string;
  _embedded: {
    genres: TicketmasterGenre[];
  };
  segment: {
    name: string;
  };
}
