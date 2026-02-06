import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <div className="w-full max-w-md space-y-8 text-center">
         <div className="flex flex-col items-center justify-center space-y-4">
             <Skeleton className="h-12 w-12 rounded-full" />
             <Skeleton className="h-6 w-[200px]" />
         </div>
         <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
         </div>
      </div>
    </div>
  );
}
