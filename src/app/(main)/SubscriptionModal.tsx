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
import { CheckCircle2, Zap, ShieldCheck, UserCheck } from "lucide-react";

export default function SubscriptionModal() {
  const [open, setOpen] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "$0/mo",
      features: [
        { label: "Access to basic features", icon: CheckCircle2 },
        { label: "Limited support", icon: UserCheck },
        { label: "Community access", icon: ShieldCheck },
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$10/mo",
      features: [
        { label: "Access to Pro features", icon: Zap },
        { label: "Priority email support", icon: ShieldCheck },
        { label: "Advanced analytics", icon: CheckCircle2 },
      ],
      cta: "Get Pro",
      popular: true,
    },
    {
      name: "Plus",
      price: "$25/mo",
      features: [
        { label: "All features unlocked", icon: Zap },
        { label: "24/7 phone support", icon: ShieldCheck },
        { label: "Dedicated account manager", icon: UserCheck },
      ],
      cta: "Go Plus",
      popular: false,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="font-semibold"
          aria-label="Open subscription plans"
        >
          Plans
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-extrabold text-primary">
            Choose the Right Plan for You
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:justify-center">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative flex w-full flex-col justify-between border shadow-lg transition-transform hover:scale-[1.03] sm:w-72",
                plan.popular && "border-primary ring-2 ring-primary",
              )}
            >
              <CardHeader className="p-6 text-center">
                {plan.popular && (
                  <Badge
                    className="absolute right-4 top-4 animate-pulse"
                    variant="outline"
                  >
                    ⭐ Best Value
                  </Badge>
                )}
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <CardDescription className="mt-1 text-lg text-muted-foreground">
                  {plan.price}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-4 text-left text-sm">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <feature.icon className="h-5 w-5 text-green-600" />
                      <span>{feature.label}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-6">
                <Button
                  className={cn(
                    "w-full",
                    plan.popular
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "",
                  )}
                  onClick={() => {
                    setOpen(false);
                    // handleSubscribe(plan.name);
                  }}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-xl text-center text-sm text-muted-foreground">
          You can switch or cancel your plan anytime from your account settings.
        </p>
      </DialogContent>
    </Dialog>
  );
}
