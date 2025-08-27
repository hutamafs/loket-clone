"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Info, Ticket } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface TicketInfo {
  type: string;
  price: number;
  available: boolean;
  description: string;
}
interface EventLike {
  id: string;
  tickets: TicketInfo[];
}

export default function TicketSidebar({ event }: { event: EventLike }) {
  const [selectedTicket, setSelectedTicket] = useState(0);
  const tickets = event.tickets;
  return (
    <div className="sticky top-24 space-y-4">
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            Select Tickets
          </CardTitle>
          <CardDescription>Choose your ticket type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tickets.map((ticket, index) => (
            <div
              key={index}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                selectedTicket === index
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
              onClick={() => setSelectedTicket(index)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{ticket.type}</h3>
                <div className="text-right">
                  <span className="font-bold text-xl text-primary">
                    ${ticket.price}
                  </span>
                  <p className="text-xs text-muted-foreground">per ticket</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {ticket.description}
              </p>
              <div className="flex items-center justify-between">
                {ticket.available ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 border-green-200"
                  >
                    Available
                  </Badge>
                ) : (
                  <Badge variant="destructive">Sold Out</Badge>
                )}
                {selectedTicket === index && (
                  <Badge className="bg-primary">Selected</Badge>
                )}
              </div>
            </div>
          ))}

          <Separator className="my-6" />

          <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span>Ticket price</span>
              <span className="font-medium">
                ${tickets[selectedTicket].price}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Service fee</span>
              <span className="font-medium">$2</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">
                ${tickets[selectedTicket].price + 2}
              </span>
            </div>
          </div>

          <Link
            href={`/checkout/${event.id}?ticket=${selectedTicket}`}
            className="block"
          >
            <Button className="w-full h-12 text-lg font-semibold" size="lg">
              Get Tickets
            </Button>
          </Link>

          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 mb-1">Flexible booking</p>
              <p>Free cancellation up to 24 hours before the event starts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
