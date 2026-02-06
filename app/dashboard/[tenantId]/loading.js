import { Skeleton } from "@/components/ui/Skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"

export default function Loading() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center justify-between">
         <Skeleton className="h-9 w-[200px]" />
         <div className="flex gap-2">
            <Skeleton className="h-9 w-[100px]" />
            <Skeleton className="h-9 w-[100px]" />
         </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mb-2" />
               <Skeleton className="h-3 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-[140px]" />
          </CardHeader>
          <CardContent className="space-y-4">
             {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                   <Skeleton className="h-10 w-10 rounded-full" />
                   <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                   </div>
                </div>
             ))}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
             <Skeleton className="h-6 w-[120px]" />
          </CardHeader>
           <CardContent className="space-y-4">
             <Skeleton className="h-20 w-full" />
             <Skeleton className="h-20 w-full" />
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
