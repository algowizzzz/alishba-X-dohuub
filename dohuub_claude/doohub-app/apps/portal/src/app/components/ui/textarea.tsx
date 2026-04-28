import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // DoHuub: blue border + light blue bg, blue focus ring
        "resize-none border-[rgba(46,122,217,0.25)] placeholder:text-muted-foreground focus-visible:border-[#2E7AD9] focus-visible:ring-[#2E7AD9]/30 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-md border bg-[#F8FAFF] text-[#1A1A2E] px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
