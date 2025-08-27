"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  Download,
  Mail,
  Calendar,
  MapPin,
  Ticket,
} from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const search = useSearchParams();
  const id = search.get("id");
  interface Order {
    id: string;
    quantity: number;
    total_amount: number;
    attendee_name: string;
    attendee_email: string;
    attendee_phone?: string;
    status?: string;
  }
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch order initially & poll briefly if still pending; use session_id fallback
  useEffect(() => {
    if (!id) return;
    let attempts = 0;
    let timer: NodeJS.Timeout;
    const load = () => {
      setLoading(true);
      fetch(`/api/orders?id=${id}`)
        .then((r) => r.json())
        .then((json) => {
          if (!json.success)
            throw new Error(json.message || "Failed fetching order");
          setOrder(json.data);
          const paid = json.data.status === "paid";
          if (!paid && attempts < 5) {
            attempts++;
            timer = setTimeout(load, 1500);
          }
        })
        .catch((e) => {
          setError(e.message);
        })
        .finally(() => setLoading(false));
    };
    load();
    return () => clearTimeout(timer);
  }, [id]);

  // If order still missing or pending but session_id present, fetch Stripe session directly
  useEffect(() => {
    const sessionId = search.get("session_id");
    if (!sessionId) return;
    if (order && order.status === "paid") return;
    const cancelled = false;
    fetch(`/api/checkout/session-status?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.success || cancelled) return;
        if (json.order) setOrder(json.order);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, order?.id, order?.status]);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Loket
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">
            {order
              ? order.status === "paid"
                ? "Payment Successful!"
                : "Payment Processing"
              : "Order Processing"}
          </h1>
          {loading && (
            <p className="text-muted-foreground mb-4">Loading order…</p>
          )}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <p className="text-muted-foreground mb-8">
            Your tickets have been confirmed. Check your email for the
            confirmation and ticket details.
          </p>

          {/* Order Details */}
          <Card className="text-left mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Order Confirmation
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                {order ? `Order #${order.id}` : id ? `Order #${id}` : "Order"}
                {order && (
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium border ${
                      order.status === "paid"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-amber-100 text-amber-700 border-amber-200"
                    }`}
                  >
                    {order.status === "paid" ? "Paid" : "Pending"}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/concert-event-1.png?height=80&width=80&query=summer music festival"
                  alt="Summer Music Festival 2024"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium">Summer Music Festival 2024</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    Dec 25, 2024 • 6:00 PM - 11:00 PM
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    Jakarta Convention Center
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>
                    {order ? `Tickets x${order.quantity}` : "Tickets"}
                  </span>
                  <span>
                    {order ? `$${(order.total_amount / 100).toFixed(2)}` : "--"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Service fee</span>
                  <span>$2</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-bold">
                  <span>Total Paid</span>
                  <span>
                    {order ? `$${(order.total_amount / 100).toFixed(2)}` : "--"}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Attendee Information</h4>
                <div className="text-sm text-muted-foreground">
                  {order ? (
                    <>
                      <p>{order.attendee_name}</p>
                      <p>{order.attendee_email}</p>
                      {order.attendee_phone && <p>{order.attendee_phone}</p>}
                    </>
                  ) : (
                    <p>—</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Tickets
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Mail className="h-4 w-4" />
              Email Tickets
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Need help? Contact our support team at support@loket.com
            </p>
            <Link href="/events">
              <Button variant="outline">Browse More Events</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
