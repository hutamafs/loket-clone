"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { searchEvents } from "@/app/actions/search";

const HeroSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/10">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
          Discover Amazing Events Near You
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-pretty">
          Find and book tickets for concerts, workshops, conferences, and more.
          Create unforgettable experiences with Loket.
        </p>

        {/* Search Bar */}
        <form
          action={searchEvents}
          className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              name="keyword"
              placeholder="Search events, artists, venues..."
              className="pl-10 h-12"
            />
          </div>
          {/* <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Location" className="pl-10 h-12 md:w-48" />
          </div> */}
          <Button type="submit" size="lg" className="h-12 px-8">
            Search Events
          </Button>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;
