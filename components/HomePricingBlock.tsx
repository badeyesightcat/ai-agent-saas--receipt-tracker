import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HomePricingBlock = ({
  label,
  description,
  price,
  buttonText,
  features,
  color,
  buttonClasses,
  flagged,
}: {
  label: string;
  description: string;
  price: string;
  buttonText: string;
  features: string[];
  color?: string;
  buttonClasses?: string;
  flagged?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col p-6 border rounded-lg",
        flagged
          ? `bg-${color}-50 border-${color}-200 dark:border-${color}-900 dark:bg-${color}-900/20 relative`
          : "bg-white border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-950",
      )}
    >
      {flagged && (
        <div
          className={`absolute -top-3 right-4 bg-${color}-600 text-white px-3 py-1 rounded-full text-sm font-medium`}
        >
          Popular
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">{label}</h3>
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
      </div>

      <div className="mt-4">
        <p className="text-4xl font-bold">${price}</p>
        <p className="text-gray-500 dark:text-gray-400">/month</p>
      </div>

      <ul className="mt-6 space-y-2 flex-1">
        {features.map((item, idx) => (
          <li key={idx} className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Link href="/manage-plan">
          <Button className={buttonClasses ?? "w-full"} variant={"outline"}>
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePricingBlock;
