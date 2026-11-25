import { Landmark } from "lucide-react";

interface BankLoadingProps {
  label?: string;
  subtext?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export default function BankLoading({
  label = "Loading Trustora Bank...",
  subtext = "Securing your banking session",
  size = "md",
  fullScreen = false,
}: BankLoadingProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-lg",
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="relative flex items-center justify-center mb-4">
        {/* Outer glowing pulsing halo */}
        <div className="absolute h-20 w-20 rounded-full bg-[#3F72AF]/15 animate-ping" style={{ animationDuration: "2s" }} />
        
        {/* Outer rotating ring */}
        <div className="h-16 w-16 rounded-full border-3 border-[#DBE2EF] border-t-[#3F72AF] animate-spin" />
        
        {/* Inner Trustora Bank landmark icon */}
        <div className="absolute inset-0 flex items-center justify-center text-[#112D4E]">
          <Landmark className="h-7 w-7 text-[#112D4E]" />
        </div>
      </div>

      {label && (
        <h3 className="font-semibold text-[#112D4E] tracking-tight">
          {label}
        </h3>
      )}

      {subtext && (
        <p className="mt-1 text-xs text-[#4F647E]">
          {subtext}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F9F7F7]/90 backdrop-blur-xs">
        <div className="rounded-2xl border border-[#DBE2EF] bg-white/90 p-8 shadow-xl">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      {content}
    </div>
  );
}
