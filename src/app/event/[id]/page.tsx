import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LocationMap from "@/components/event/LocationMap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Share2, Heart, Ticket, Info } from "lucide-react";

const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

type ApiEvent = {
  id: string;
  name: string;
  description: string;
  start: string;
  end: string | null;
  image: string;
  venue: {
    name: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
  };
  price: { display: string } | null;
  category: string | null;
  url: string;
  organizer?: string | null;
};

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const res = await fetch(`${base}/api/events/ticketmaster/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const json = await res.json();
  if (!json?.success || !json?.data) notFound();

  const e = json.data as ApiEvent;

  const when = new Date(e.start).toLocaleString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const venueLine = `${e.venue.name}${
    e.venue.address ? `, ${e.venue.address}` : ""
  }`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Event Image (v0 style) */}
            <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-lg relative">
              {/* Use next/image for perf; external domains may need next.config.js remotePatterns */}
              <Image
                src={e.image || "/placeholder.svg"}
                alt={e.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Event Header (v0 style, filled with API data) */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {e.category || "Event"}
                    </Badge>
                    {/* Show verified badge only if you later add organizer verification in API */}
                    {/* <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge> */}
                  </div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-balance leading-tight mb-4">
                    {e.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {/* Rating/attendees not in API — keep placeholders hidden by default */}
                    {/* <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.8</span>
                      <span>(1,200 reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>12,000 interested</span>
                    </div> */}
                  </div>
                </div>

                {/* Non-interactive buttons to keep server-only */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0"
                    aria-label="Save"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 bg-transparent"
                    aria-label="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Date / Location cards (v0 style) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{when}</p>
                        {/* you could also compute end time if needed */}
                        {/* <p className="text-sm text-muted-foreground">to {endWhen}</p> */}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate">{e.venue.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {e.venue.address}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Organizer (if provided) */}
              {e.organizer && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={"/placeholder.svg"} />
                        <AvatarFallback>
                          {e.organizer
                            .split(" ")
                            .map((p) => p[0]?.toUpperCase())
                            .slice(0, 2)
                            .join("") || "EV"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{e.organizer}</p>
                          {/* <Shield className="h-4 w-4 text-primary" /> */}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Event Organizer
                        </p>
                      </div>
                      <Link
                        href={{
                          pathname: `/checkout/${e.id}`,
                        }}
                        target="_blank"
                        className="block"
                      >
                        <Button
                          className="w-full h-12 text-lg font-semibold"
                          size="lg"
                        >
                          See Tickets
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* About This Event (v0 style) */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {e.description ? (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {e.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    Details coming soon.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Location Map (kept from your server component) */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">{venueLine}</p>
                <div className="rounded-lg overflow-hidden border">
                  <LocationMap
                    lat={e.venue.latitude}
                    lng={e.venue.longitude}
                    name={e.venue.name}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Ticket CTA (server-only variant of v0’s ticket selector) */}
          <div className="xl:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    Tickets
                  </CardTitle>
                  <CardDescription>Checkout on provider</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span>Starts from</span>
                      <span className="font-medium">
                        ${e.id.slice(0, 2) ?? "TBA"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">
                        ${e.id.slice(0, 2) ?? "TBA"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/checkout/${e.id}`}
                    target="_blank"
                    className="block"
                  >
                    <Button
                      className="w-full h-12 text-lg font-semibold"
                      size="lg"
                    >
                      See Tickets
                    </Button>
                  </Link>

                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Heads up</p>
                      <p>
                        Purchases and refunds are handled by the event provider.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
