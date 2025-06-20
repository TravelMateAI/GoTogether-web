"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function SubscriptionModal() {
  const [open, setOpen] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "$0/mo",
      features: [
        "Access to basic features",
        "Limited support",
        "Community access",
      ],
      cta: "Subscribe",
      popular: false,
    },
    {
      name: "Pro",
      price: "$10/mo",
      features: [
        "Access to Pro features",
        "Priority email support",
        "Advanced analytics",
      ],
      cta: "Get Pro",
      popular: true,
    },
    {
      name: "Plus",
      price: "$25/mo",
      features: [
        "Access to all features",
        "24/7 phone support",
        "Dedicated account manager",
      ],
      cta: "Get Plus",
      popular: false,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Subscription Plans</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Choose Your Plan
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-stretch justify-center gap-6 md:flex-row">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "flex w-full flex-col shadow-lg transition-shadow duration-300 hover:shadow-xl md:max-w-sm",
                plan.popular
                  ? "transform border-2 border-primary md:scale-105"
                  : "border",
              )}
            >
              <CardHeader
                className={cn("p-6 text-center", plan.popular && "relative")}
              >
                {plan.popular && (
                  <Badge className="absolute right-0 top-0 -mr-3 -mt-3">
                    Popular
                  </Badge>
                )}
                <CardTitle className="text-2xl font-semibold">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-xl font-medium">
                  {plan.price}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <ul className="list-inside list-disc space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-6">
                <Button
                  className={cn(
                    "w-full font-semibold",
                    plan.popular ? "bg-primary hover:bg-primary/90" : "",
                  )}
                  onClick={() => {
                    setOpen(false);
                    // handleSubscribe(plan.name); // Add logic if needed
                  }}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
