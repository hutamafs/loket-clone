import Image from "next/image";
import {
  Music,
  Trophy,
  Palette,
  Briefcase,
  BookOpen,
  Mic,
  ImageIcon,
  Ticket,
} from "lucide-react"; // icons

type Cat = {
  label: string; // English label
  tmClassification: string;
  img: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
};

const CATS: Cat[] = [
  {
    label: "Festival, Fair, Bazaar",
    tmClassification: "Festival",
    img: "/categories/festival.png",
    Icon: Ticket,
  },
  {
    label: "Concert",
    tmClassification: "Music",
    img: "/categories/concert.png",
    Icon: Music,
  },
  {
    label: "Competition",
    tmClassification: "Sports",
    img: "/categories/competition.png",
    Icon: Trophy,
  },
  {
    label: "Exhibition, Expo",
    tmClassification: "Arts & Theatre",
    img: "/categories/exhibition.png",
    Icon: ImageIcon,
  },
  {
    label: "Conference",
    tmClassification: "Business",
    img: "/categories/conference.png",
    Icon: Briefcase,
  },
  {
    label: "Workshop",
    tmClassification: "Education",
    img: "/categories/workshop.png",
    Icon: BookOpen,
  },
  {
    label: "Show / Performance",
    tmClassification: "Arts & Theatre",
    img: "/categories/show.png",
    Icon: Mic,
  },
  {
    label: "Attraction / Theme Park",
    tmClassification: "Miscellaneous",
    img: "/categories/themepark.png",
    Icon: Palette,
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
        <div className="mt-5 flex gap-4 overflow-x-auto no-scrollbar snap-x">
          {CATS.map((c) => (
            <a
              key={c.label}
              href={`/events?classificationName=${encodeURIComponent(
                c.tmClassification
              )}`}
              className="shrink-0 snap-start"
            >
              <div className="h-[112px] w-[112px] md:h-[132px] md:w-[132px] rounded-2xl overflow-hidden ring-1 ring-black/5 bg-gray-100">
                <Image
                  src={c.img}
                  alt={c.label}
                  width={264}
                  height={264}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="mt-2 text-center text-[12px] md:text-sm font-medium line-clamp-2 w-[112px] md:w-[132px]">
                {c.label}
              </div>
            </a>
          ))}
        </div>

        {/* Pill row with icons */}
        <div className="mt-6 flex flex-wrap gap-2 md:gap-3">
          {CATS.map((c) => (
            <a
              key={`${c.label}-pill`}
              href={`/events?classificationName=${encodeURIComponent(
                c.tmClassification
              )}`}
              className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <c.Icon size={16} className="text-blue-500" />
              <span>{c.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
