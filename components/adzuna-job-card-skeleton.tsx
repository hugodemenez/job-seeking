import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function JobOfferCardSkeleton() {
  return (
    <Card className="w-96">
      <CardHeader>
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
      </CardFooter>
    </Card>
  )
}