"use client";

import { useState } from "react";
import { Event } from "@/app/types/event";
import Step1 from "./Step1";
import Step2 from "./Step2";

function EventCheckout({ event }: { event: Event }) {
  const [step, setStep] = useState(1);

  return (
    <>
      {step === 1 && <Step1 event={event} setStep={setStep} />}
      {step === 2 && <Step2 />}
    </>
  );
}

export default EventCheckout;
