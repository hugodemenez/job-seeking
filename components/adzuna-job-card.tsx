import { CalendarIcon, MapPinIcon, BriefcaseIcon, DollarSignIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface AdzunaJob {
  __CLASS__: string;
  id: string;
  title: string;
  description: string;
  created: string;
  salary_min: number;
  salary_max: number;
  salary_is_predicted: number;
  company: {
    __CLASS__: string;
    display_name: string;
  };
  category: {
    __CLASS__: string;
    label: string;
    tag: string;
  };
  location: {
    __CLASS__: string;
    area: string[];
    display_name: string;
  };
  latitude: number;
  longitude: number;
  redirect_url: string;
  contract_type: string;
}

export default function Component({ job }: { job: AdzunaJob }) {
  const formatSalary = (min: number, max: number) => {
    const formatNumber = (num: number) => 
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
    
    if (min === max) return formatNumber(min);
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  }

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength) + '...';
  }

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <BriefcaseIcon className="h-4 w-4" />
          <span>{job.company.display_name}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 text-sm">
          <MapPinIcon className="h-4 w-4 text-gray-500" />
          <span>{job.location.display_name}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <DollarSignIcon className="h-4 w-4 text-gray-500" />
          <span>{formatSalary(job.salary_min, job.salary_max)}</span>
          {job.salary_is_predicted === 1 && <Badge variant="secondary">Estimated</Badge>}
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <CalendarIcon className="h-4 w-4 text-gray-500" />
          <span>{new Date(job.created).toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-gray-600">{truncateDescription(job.description, 150)}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{job.category.label}</Badge>
          <Badge variant="outline">{job.contract_type}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <a href={job.redirect_url} target="_blank" rel="noopener noreferrer">
            View Job
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}