"use client";
import Image from "next/image";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
} from "@/components/ui";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Lock,
  Calendar,
  MapPin,
  Ticket,
  User,
  Plus,
  Minus,
} from "lucide-react";
import Link from "next/link";

interface AttendeeInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore React experimental use()
  const { id } = React.use(params);
  const [event, setEvent] = useState<{
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    location: string;
    address: string;
    category: string;
    price: number;
    ticketOptions: {
      type: string;
      description: string;
      price: number;
    }[];
  } | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/ticketmaster/${id}`, {
          cache: "no-store",
        });
        const json = await res.json();

        if (!res.ok || !json.data)
          throw new Error(json.message || "Failed to fetch event");

        const data = json.data;

        const parsedEvent = {
          id: data.id,
          description: data.description,
          title: data.name || "Untitled Event",
          image: data.image || "/placeholder.svg",
          date: new Date(data.start).toLocaleDateString("en-US", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          location: data.venue.name || "",
          address: data.address || "",
          category: data.category || "Event",
          price: data.id.slice(0.2),
          ticketOptions: data.ticketOptions || [
            {
              type: "General Admission",
              description: "Standard entry ticket",
              price: data.price || 0,
            },
          ],
        };

        setEvent(parsedEvent);
      } catch (err) {
        console.error("Error loading event", err);
      }
    };

    fetchEvent();
  }, [id]);

  const [currentStep, setCurrentStep] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [attendees, setAttendees] = useState<AttendeeInfo[]>([
    { firstName: "", lastName: "", email: "", phone: "" },
  ]);
  const [paymentMethod] = useState("card");
  // Removed manual card details; using Stripe Checkout redirect
  const [creatingSession, setCreatingSession] = useState(false);
  const [billingAddress, setBillingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "Indonesia",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  // removed old processing state (replaced by creatingSession)
  const [error, setError] = useState<string | null>(null);
  // router no longer used after redirecting via session.url

  // Derive a stable pseudo price (placeholder until real price) using hash of id
  const unitPrice = React.useMemo(() => {
    if (!event?.id) return 0;
    // simple deterministic pseudo-price  (cents /100 later)
    const digits = event.id.replace(/[^0-9]/g, "").slice(0, 3) || "100";
    const num = parseInt(digits, 10) % 90; // 0-89
    return (num < 10 ? num + 10 : num); // ensure >=10
  }, [event?.id]);
  const subtotal = unitPrice * quantity;
  const serviceFee = 2 * quantity;
  const total = subtotal + serviceFee;

  const updateAttendee = (
    index: number,
    field: keyof AttendeeInfo,
    value: string
  ) => {
    const newAttendees = [...attendees];
    newAttendees[index] = { ...newAttendees[index], [field]: value };
    setAttendees(newAttendees);
  };

  const removeAttendee = (index: number) => {
    if (attendees.length > 1) {
      setAttendees(attendees.filter((_, i) => i !== index));
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const canProceedToStep2 = quantity > 0;
  const canProceedToStep3 = attendees.every(
    (attendee) => attendee.firstName && attendee.lastName && attendee.email
  );
  const canCompleteOrder = canProceedToStep3 && agreeTerms && paymentMethod;

  const handlePayment = async () => {
    setError(null);
    setCreatingSession(true);
    try {
      const a = attendees[0];
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: id,
          eventSource: "ticketmaster",
            quantity,
            currency: "usd",
            unitAmount: unitPrice * 100, // cents
            attendee: {
              name: `${a.firstName} ${a.lastName}`.trim(),
              email: a.email,
              phone: a.phone,
            },
            metadata: { eventName: event?.title },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to create session');
      if (json.url) window.location.href = json.url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setCreatingSession(false);
    }
  };

  const steps = [
    {
      number: 1,
      title: "Select Quantity",
      description: "Choose number of tickets",
    },
    {
      number: 2,
      title: "Attendee Info",
      description: "Enter attendee details",
    },
    { number: 3, title: "Payment", description: "Complete your purchase" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            href={`/event/${id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Event
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center gap-3 ${
                    index < steps.length - 1 ? "mr-8" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="hidden md:block">
                    <p
                      className={`font-medium ${
                        currentStep >= step.number
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-px mx-4 ${
                      currentStep > step.number ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Quantity Selection */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ticket className="h-5 w-5" />
                      Select Quantity
                    </CardTitle>
                    <CardDescription>
                      Choose the number of tickets you want to purchase
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border rounded-lg p-4 bg-accent/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-primary">
                          ${String(event?.price)?.slice(0, 2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <Label htmlFor="quantity">Quantity:</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => setCurrentStep(2)}
                        disabled={!canProceedToStep2}
                        className="flex items-center gap-2"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Attendee Information */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Attendee Information
                    </CardTitle>
                    <CardDescription>
                      Enter details for each attendee
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {attendees.map((attendee, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Attendee {index + 1}</h3>
                          {attendees.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttendee(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`firstName-${index}`}>
                              First Name *
                            </Label>
                            <Input
                              id={`firstName-${index}`}
                              value={attendee.firstName}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                updateAttendee(
                                  index,
                                  "firstName",
                                  e.target.value
                                )
                              }
                              placeholder="Enter first name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`lastName-${index}`}>
                              Last Name *
                            </Label>
                            <Input
                              id={`lastName-${index}`}
                              value={attendee.lastName}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                updateAttendee(
                                  index,
                                  "lastName",
                                  e.target.value
                                )
                              }
                              placeholder="Enter last name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`email-${index}`}>Email *</Label>
                            <Input
                              id={`email-${index}`}
                              type="email"
                              value={attendee.email}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                updateAttendee(index, "email", e.target.value)
                              }
                              placeholder="Enter email address"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`phone-${index}`}>
                              Phone Number
                            </Label>
                            <Input
                              id={`phone-${index}`}
                              value={attendee.phone}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                updateAttendee(index, "phone", e.target.value)
                              }
                              placeholder="Enter phone number"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(3)}
                        disabled={!canProceedToStep3}
                        className="flex items-center gap-2"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                    <CardDescription>
                      Complete your purchase securely
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Payment Method */}
                    <div>
                      <Label className="text-base font-medium">
                        Payment Method
                      </Label>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="p-4 border rounded-md bg-muted/30 text-sm text-muted-foreground">
                        Card details are collected on Stripe&apos;s secure Checkout page.
                      </div>
                    )}

                    {/* Billing Address */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">
                        Billing Address
                      </Label>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={billingAddress.address}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setBillingAddress({
                              ...billingAddress,
                              address: e.target.value,
                            })
                          }
                          placeholder="Enter your address"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={billingAddress.city}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setBillingAddress({
                                ...billingAddress,
                                city: e.target.value,
                              })
                            }
                            placeholder="Enter city"
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={billingAddress.postalCode}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setBillingAddress({
                                ...billingAddress,
                                postalCode: e.target.value,
                              })
                            }
                            placeholder="Enter postal code"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Select
                            value={billingAddress.country}
                            onValueChange={(value: string) =>
                              setBillingAddress({
                                ...billingAddress,
                                country: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Indonesia">
                                Indonesia
                              </SelectItem>
                              <SelectItem value="Malaysia">Malaysia</SelectItem>
                              <SelectItem value="Singapore">
                                Singapore
                              </SelectItem>
                              <SelectItem value="Thailand">Thailand</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreeTerms}
                        onCheckedChange={(checked: boolean) =>
                          setAgreeTerms(checked as boolean)
                        }
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <Button onClick={handlePayment} disabled={!canCompleteOrder || creatingSession} className="flex items-center gap-2">
                        {creatingSession ? 'Redirecting...' : (<><Lock className='h-4 w-4'/> Pay with Stripe</>)}
                      </Button>
                      {error && (
                        <p className="text-sm text-red-600 mt-2">{error}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Event Info */}
                  <div className="flex gap-3">
                    <Image
                      width={40}
                      height={40}
                      src={event?.image || "/placeholder.svg"}
                      alt={event?.title || ""}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-2">
                        {event?.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        {event?.date}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {event?.location}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Service fee</span>
                      <span>${serviceFee}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total}</span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <Lock className="h-3 w-3" />
                    <span>
                      Your payment information is secure and encrypted
                    </span>
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
