import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils"; // Import cn utility

export default function SubscriptionPage() {
  const plans = [
    { name: "Free", price: "$0/mo", features: ["Access to basic features", "Limited support", "Community access"], cta: "Subscribe", popular: false },
    { name: "Pro", price: "$10/mo", features: ["Access to Pro features", "Priority email support", "Advanced analytics"], cta: "Get Pro", popular: true },
    { name: "Plus", price: "$25/mo", features: ["Access to all features", "24/7 phone support", "Dedicated account manager"], cta: "Get Plus", popular: false },
  ];

  return (
    <div className="container mx-auto px-4 py-12"> {/* Adjusted page padding */}
      <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1> {/* Increased title margin and size */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "flex flex-col w-full md:max-w-sm shadow-lg hover:shadow-xl transition-shadow duration-300",
              plan.popular ? "border-2 border-primary transform md:scale-105" : "border" // Highlight popular plan
            )}
          >
            <CardHeader className={cn("text-center p-6", plan.popular ? "relative" : "")}> {/* Added padding */}
              {plan.popular && (
                <Badge className="absolute top-0 right-0 -mt-3 -mr-3">Popular</Badge> // Badge for popular plan
              )}
              <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
              <CardDescription className="text-xl font-medium">{plan.price}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-6"> {/* Added padding */}
              <ul className="list-disc list-inside space-y-3 text-sm"> {/* Adjusted feature list spacing */}
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-6"> {/* Added padding */}
              <Button className={cn("w-full font-semibold", plan.popular ? "bg-primary hover:bg-primary/90" : "")}> {/* Highlight popular plan button */}
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
