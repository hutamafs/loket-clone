import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";
type Cat = {
  label: string; // English label
  tmClassification: string;
  img: string;
};

export const categoryImages: Record<string, string> = {
  Music: "/images/categories/music.png",
  Sports: "/images/categories/sports.png",
  "Arts & Theatre": "/images/categories/theatre.png",
  Film: "/images/categories/film.png",
  "Festival, Fair, Bazaar": "/images/categories/festival.png",
  "Exhibition, Expo": "/images/categories/expo.png",
  Conference: "/images/categories/conference.png",
  Workshop: "/images/categories/workshop.png",
  Family: "/images/categories/family.png",
  "Theme Park": "/images/categories/themepark.png",
};

const genrePills = [
  {
    id: "basketball",
    label: "Basketball",
    icon: "🏀",
    classificationId: "KZFzniwnSyZfZ7v7nE",
    genreId: "KnvZfZ7vAde",
  },
  {
    id: "baseball",
    label: "Baseball",
    icon: "⚾",
    classificationId: "KZFzniwnSyZfZ7v7nE",
    genreId: "KnvZfZ7vAdv",
  },
  {
    id: "tennis",
    label: "Tennis",
    icon: "🎾",
    classificationId: "KZFzniwnSyZfZ7v7nE",
    genreId: "KnvZfZ7vA7E",
  },
  {
    id: "esports",
    label: "Esports",
    icon: "🎮",
    classificationId: "KZFzniwnSyZfZ7v7nE",
    genreId: "KnvZfZ7vAJF",
  },
  {
    id: "padel",
    label: "Padel",
    icon: "🎾",
    classificationId: "KZFzniwnSyZfZ7v7nE",
    genreId: "KnvZfZ7vAeP",
  }, // fallback
  {
    id: "classical",
    label: "Classical",
    icon: "🎼",
    classificationId: "KZFzniwnSyZfZ7v7nJ",
    genreId: "KnvZfZ7vAeA",
  },
  {
    id: "country",
    label: "Country",
    icon: "🎸",
    classificationId: "KZFzniwnSyZfZ7v7nJ",
    genreId: "KnvZfZ7vAe6",
  },
  {
    id: "religious",
    label: "Religious",
    icon: "⛪",
    classificationId: "KZFzniwnSyZfZ7v7nJ",
    genreId: "KnvZfZ7vAeR",
  },
  {
    id: "action",
    label: "Action",
    icon: "⚔️",
    classificationId: "KZFzniwnSyZfZ7v7na",
    genreId: "KnvZfZ7vAeX",
  },
  {
    id: "adventure",
    label: "Adventure",
    icon: "🏔️",
    classificationId: "KZFzniwnSyZfZ7v7na",
    genreId: "KnvZfZ7vAeY",
  },
  {
    id: "cultural",
    label: "Cultural",
    icon: "🌍",
    classificationId: "KZFzniwnSyZfZ7v7na",
    genreId: "KnvZfZ7vAeC",
  },
  {
    id: "children",
    label: "Children’s Theatre",
    icon: "👶",
    classificationId: "KZFzniwnSyZfZ7v7na",
    genreId: "KnvZfZ7vAeK",
  },
  {
    id: "multimedia",
    label: "Multimedia",
    icon: "🎬",
    classificationId: "KZFzniwnSyZfZ7v7na",
    genreId: "KnvZfZ7vAeM",
  },
  {
    id: "opera",
    label: "Opera",
    icon: "🎭",
    classificationId: "KZFzniwnSyZfZ7v7na",
    genreId: "KnvZfZ7vAeO",
  },
];

export const CATS: Cat[] = [
  {
    label: "Music",
    tmClassification: "KZFzniwnSyZfZ7v7nJ",
    img: "music",
  },
  {
    label: "Sport",
    tmClassification: "KZFzniwnSyZfZ7v7nE",
    img: "sport",
  },
  {
    label: "Arts & Theatre",
    tmClassification: "KZFzniwnSyZfZ7v7na",
    img: "art",
  },
  {
    label: "Film",
    tmClassification: "KZFzniwnSyZfZ7v7nn",
    img: "film",
  },
  {
    label: "Venue Based",
    tmClassification: "KZAyXgnZfZ7v7n1",
    img: "festival",
  },
  {
    label: "Group",
    tmClassification: "KZAyXgnZfZ7v7l1",
    img: "family",
  },
  {
    label: "Individual",
    tmClassification: "KZAyXgnZfZ7v7la",
    img: "workshop",
  },
  {
    label: "NonTicket",
    tmClassification: "KZAyXgnZfZ7v7l6",
    img: "theme-park",
  },
];

export default function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="rounded-2xl border bg-white shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl md:text-2xl font-semibold">
            Event Categories
          </h3>
        </div>

        {/* Top image tiles */}
        <div className="mt-5 flex gap-4 overflow-x-auto md:overflow-hidden no-scrollbar snap-x">
          {CATS.map((c) => (
            <a
              key={c.label}
              href={`/events?classificationId=${encodeURIComponent(
                c.tmClassification
              )}`}
              className="shrink-0 snap-start"
            >
              <div className="h-[112px] w-[112px] md:h-[120px] md:w-[120px] rounded-2xl overflow-hidden ring-1 ring-black/5 bg-gray-100 relative">
                <Image
                  src={`/images/categories/${c.img}.png`}
                  alt={c.label}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="mt-2 text-center text-[12px] md:text-sm font-medium line-clamp-2 w-[112px] md:w-[132px]">
                {c.label}
              </div>
            </a>
          ))}
        </div>

        {/* Pill row with icons */}
        <div className="flex flex-wrap gap-2 mt-8">
          {genrePills.map(({ id, label, icon, classificationId, genreId }) => {
            return (
              <Link
                key={id}
                href={`/events?classificationId=${classificationId}&genreId=${genreId}`}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition bg-white text-[#0e3a8a] hover:bg-gray-100"
                )}
              >
                <span>{icon}</span>
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
