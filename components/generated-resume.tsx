'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import JobOfferProfiles from "@/components/profile-card"

interface JobOffer {
  id: string
  title: string
  position: string
  description: string
  postedDate: string
  recruiter?: {
    name: string
    email: string
  }
  hiringManager?: {
    name: string
    email: string
  }
}

export default function GeneratedResume() {
  const searchParams = useSearchParams()
  const offerParam = searchParams?.get('offer')
  const resumeParam = searchParams?.get('resume')

  let offer: JobOffer | null = null
  try {
    offer = offerParam ? JSON.parse(decodeURIComponent(offerParam)) : null
  } catch (error) {
    console.error('Error parsing offer data:', error)
  }

  const resume = resumeParam ? decodeURIComponent(resumeParam) : null

  if (!offer || !resume) {
    return <div>Error: Missing or invalid offer or resume data</div>
  }

  return (
    <main className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Generated Resume for Job Offer</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{offer.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">{offer.position}</p>
          <p className="text-sm mb-4">{offer.description}</p>
          <p className="text-xs text-muted-foreground mb-2">
            Posted on: {new Date(offer.postedDate).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
      
      {(offer.recruiter || offer.hiringManager) && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <JobOfferProfiles jobOffer={offer} />
        </>
      )}
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Generated Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm whitespace-pre-wrap">{resume}</pre>
        </CardContent>
      </Card>
    </main>
  )
}