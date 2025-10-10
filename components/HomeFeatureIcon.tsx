import { cn } from "@/lib/utils";
import { DynamicIcon, IconName } from "lucide-react/dynamic";

const HomeFeatureIcon = ({
  color,
  icon,
}: {
  color: string;
  icon: IconName;
}) => {
  return (
    <div
      className={cn(`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900`)}
    >
      <DynamicIcon
        name={icon}
        className={cn(`h-6 w-6 text-${color}-600 dark:text-${color}-400`)}
      />
    </div>
  );
};

export default HomeFeatureIcon;
