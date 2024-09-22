'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon } from 'lucide-react'

interface JobOffer {
  id: string
  originalOfferId?: string
  company: string
  companyLogo: string
  position: string
  description: string
  postedDate: string
  recruiters: {
    name: string
    email: string
    linkedinUrl?: string
    avatar?: string
  }[]
  hiringManagers: {
    name: string
    email: string
    linkedinUrl?: string
    avatar?: string
  }[]
  companyInfo?: CompanyInfo
}

interface CompanyInfo {
  sector: string
  founded: string
  ceo: {
    name: string
    avatar: string
    linkedinUrl: string
  }
  openPositions: string[]
}

interface SalaryData {
  year: number
  Minimum: number
  Average: number
  Maximum: number
}

const formatCurrency = (value: number) => `$${value.toLocaleString()}`

const TrendIndicator = ({ value }: { value: number }) => {
  if (value > 0) return <ArrowUpIcon className="inline text-primary w-4 h-4" />
  if (value < 0) return <ArrowDownIcon className="inline text-destructive w-4 h-4" />
  return <ArrowRightIcon className="inline text-muted-foreground w-4 h-4" />
}

export default function Component({ offer }: { offer: JobOffer }) {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [salaryData, setSalaryData] = useState<SalaryData[]>([])

  useEffect(() => {
    const offerParam = searchParams?.get('offer')

    try {
      const currentYear = new Date().getFullYear()
      const fakeData = Array.from({ length: 5 }, (_, index) => {
        const year = currentYear - 4 + index
        const minimum = Math.floor(Math.random() * (100000 - 40000) + 40000)
        const maximum = Math.floor(Math.random() * (300000 - minimum) + minimum)
        const average = Math.floor(Math.random() * (maximum - minimum) + minimum)
        return { year, Minimum: minimum, Average: average, Maximum: maximum }
      })
      setSalaryData(fakeData)
    } catch (error) {
      console.error('Error generating salary data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchParams])

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>
  }

  if (!offer) {
    return <div className="text-center p-4 text-destructive">Error: Missing or invalid offer data</div>
  }

  const currentYearData = salaryData[salaryData.length - 1]
  const previousYearData = salaryData[salaryData.length - 2]
  const calculateTrend = (current: number, previous: number) => 
    ((current - previous) / previous * 100).toFixed(1)

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Salary Trends for {offer.position}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {['Minimum', 'Average', 'Maximum'].map((type) => (
            <div key={type} className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-1">{type}</p>
              <p className="text-lg font-semibold">
                {formatCurrency(currentYearData[type as keyof SalaryData])}
              </p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center">
                <TrendIndicator value={parseFloat(calculateTrend(
                  currentYearData[type as keyof SalaryData],
                  previousYearData[type as keyof SalaryData]
                ))} />
                <span className="ml-1">
                  {calculateTrend(
                    currentYearData[type as keyof SalaryData],
                    previousYearData[type as keyof SalaryData]
                  )}%
                </span>
              </p>
            </div>
          ))}
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), 'Salary']}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              />
              <Legend />
              <Line type="monotone" dataKey="Minimum" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Average" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Maximum" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}