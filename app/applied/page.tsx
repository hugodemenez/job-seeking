'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface JobOffer {
  id: string
  title: string
  position: string
  description: string
  postedDate: string
}

export default function AppliedPage() {
  const searchParams = useSearchParams()
  const offerParam = searchParams.get('offer')
  const resumeParam = searchParams.get('resume')

  const offer: JobOffer | null = offerParam ? JSON.parse(decodeURIComponent(offerParam)) : null
  const resume: string | null = resumeParam ? decodeURIComponent(resumeParam) : null

  if (!offer || !resume) {
    return <div>No application data found.</div>
  }

  return (
    <main className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Application Submitted</h1>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Job Offer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold">{offer.title}</h2>
            <p className="text-sm text-muted-foreground mb-2">{offer.position}</p>
            <p className="text-sm mb-4">{offer.description}</p>
            <p className="text-xs text-muted-foreground">
              Posted on: {new Date(offer.postedDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Generated Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded">{resume}</pre>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}