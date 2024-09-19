'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import JobOfferProfiles from "@/components/profile-card"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"

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

export default function GeneratedDocuments() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [offer, setOffer] = useState<JobOffer | null>(null)
  const [resume, setResume] = useState<string | null>(null)
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const offerParam = searchParams?.get('offer')
    const resumeParam = searchParams?.get('resume')
    const coverLetterParam = searchParams?.get('coverLetter')

    try {
      if (offerParam) setOffer(JSON.parse(decodeURIComponent(offerParam)))
      if (resumeParam) setResume(decodeURIComponent(resumeParam))
      if (coverLetterParam) setCoverLetter(decodeURIComponent(coverLetterParam))
    } catch (error) {
      console.error('Error parsing data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchParams])

  const handleGoToTraining = () => {
    const currentUrl = new URL(window.location.href)
    router.push(`/training${currentUrl.search}`)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!offer || !resume || !coverLetter) {
    return <div>Error: Missing or invalid offer or generated documents data</div>
  }

  return (
    <main className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Generated Documents for Job Offer</h1>
      
      {/* Add the Go to Training button */}
      <Button onClick={handleGoToTraining} className="mb-8">
        Go to Training
      </Button>

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
          <h2 className="text-2xl font-semibold mb-4">Connect with the Recruiter</h2>
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

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Generated Cover Letter</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm whitespace-pre-wrap">{coverLetter}</pre>
        </CardContent>
      </Card>
    </main>
  )
}