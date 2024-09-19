'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface JobOffer {
  title: string
  position: string
  description: string
  postedDate: string
  recruiter: {
    name: string
    email: string
    linkedinUrl?: string
  }
  hiringManager: {
    name: string
    email: string
    linkedinUrl?: string
  }
}

export default function SalaryComparison() {
  const searchParams = useSearchParams()
  const [offer, setOffer] = useState<JobOffer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [salaryData, setSalaryData] = useState<{ name: string; salary: number }[]>([])

  useEffect(() => {
    const offerParam = searchParams?.get('offer')

    try {
      if (offerParam) {
        const parsedOffer = JSON.parse(decodeURIComponent(offerParam))
        setOffer(parsedOffer)
        // Generate fake salary data
        setSalaryData([
          { name: 'Minimum', salary: Math.floor(Math.random() * (100000 - 40000) + 40000) },
          { name: 'Average', salary: Math.floor(Math.random() * (150000 - 50000) + 50000) },
          { name: 'Maximum', salary: Math.floor(Math.random() * (200000 - 100000) + 100000) },
        ])
      }
    } catch (error) {
      console.error('Error parsing offer data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchParams])

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>
  }

  if (!offer) {
    return <div className="text-center p-4 text-red-500">Error: Missing or invalid offer data</div>
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Salary Comparison for {offer.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Salary']}
                labelStyle={{ color: 'black' }}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
              />
              <Legend />
              <Bar dataKey="salary" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {salaryData.map((item) => (
            <div key={item.name} className={`p-4 rounded-lg ${
              item.name === 'Minimum' ? 'bg-red-100' :
              item.name === 'Average' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              <h3 className="text-lg font-semibold mb-2">{item.name} Salary</h3>
              <p className="text-2xl font-bold">${item.salary.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Job Details</h3>
          <p><strong>Position:</strong> {offer.position}</p>
          <p><strong>Description:</strong> {offer.description}</p>
          <p><strong>Posted Date:</strong> {offer.postedDate}</p>
          <p><strong>Recruiter:</strong> {offer.recruiter.name} ({offer.recruiter.email})</p>
          <p><strong>Hiring Manager:</strong> {offer.hiringManager.name} ({offer.hiringManager.email})</p>
        </div>
      </CardContent>
    </Card>
  )
}