import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const FormHelp: React.FC<Props> = ({ children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle size={16} className="text-muted-foreground"></HelpCircle>
        </TooltipTrigger>
        <TooltipContent className="max-w-64 sm:max-w-sm">{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FormHelp;
