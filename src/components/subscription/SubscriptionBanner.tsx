import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Crown, ChevronRight } from "lucide-react";

interface SubscriptionBannerProps {
  status?: "free" | "premium";
  onUpgrade?: () => void;
}

const SubscriptionBanner = ({
  status = "free",
  onUpgrade = () => console.log("Upgrade clicked"),
}: SubscriptionBannerProps) => {
  const isFree = status === "free";

  return (
    <div className="w-full bg-slate-100 border-b border-slate-200 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Badge
          variant={isFree ? "secondary" : "default"}
          className={`${isFree ? "bg-slate-200" : "bg-amber-500"} flex items-center gap-1`}
        >
          {isFree ? "Тегін жоспар" : "Премиум жоспар"}
          {!isFree && <Crown className="h-3 w-3" />}
        </Badge>
        <span className="text-sm text-slate-600">
          {isFree
            ? "Тарихи тұлғалар мен мүмкіндіктерге шектеулі қол жеткізу"
            : "Барлық кейіпкерлер мен мүмкіндіктерге толық қол жеткізу"}
        </span>
      </div>

      {isFree && (
        <Button
          variant="outline"
          size="sm"
          onClick={onUpgrade}
          className="text-xs bg-white hover:bg-amber-50 border-amber-200 text-amber-700 flex items-center gap-1"
        >
          Премиумға жаңарту
          <ChevronRight className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default SubscriptionBanner;
