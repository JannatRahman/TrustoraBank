import BankLoading from "@/components/ui/BankLoading";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center bg-[#F9F7F7] px-4">
      <BankLoading
        label="Loading Trustora Bank..."
        subtext="Preparing your secure banking interface"
        size="md"
      />
    </div>
  );
}
