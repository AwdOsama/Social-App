import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] w-full items-center justify-center bg-transparent py-10"
    >
      <AiOutlineLoading3Quarters
        className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400"
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}