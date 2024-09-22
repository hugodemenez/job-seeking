'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

interface JobOffer {
  id: string
  company: string
  position: string
  // Add other properties as needed
}

export default function AppliedPage() {
  const searchParams = useSearchParams()
  const offerParam = searchParams?.get('offer')
  const resumeParam = searchParams?.get('resume')

  const offer: JobOffer | null = offerParam ? JSON.parse(decodeURIComponent(offerParam)) : null
  const resume: string | null = resumeParam ? decodeURIComponent(resumeParam) : null

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!offer) {
    return <div>No offer data available</div>
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Application Submitted</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Company:</strong> {offer.company}</p>
          <p><strong>Position:</strong> {offer.position}</p>
          {/* Add more job details as needed */}
        </CardContent>
      </Card>

      {resume && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generated Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{resume}</pre>
          </CardContent>
        </Card>
      )}

      <Button asChild>
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </main>
  )
}