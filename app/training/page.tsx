'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from 'react'
import SalaryComparison from '@/components/salary-comparison'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

interface JobOffer {
  // ... same interface as in generated-documents/page.tsx
}

export default function TrainingPage() {
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

  const handleRedirect = (path: string) => {
    const currentUrl = new URL(window.location.href)
    router.push(`${path}${currentUrl.search}`)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!offer || !resume || !coverLetter) {
    return <div>Error: Missing or invalid offer or generated documents data</div>
  }

  return (
    <main className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Interview Training</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recruiter Interview Training</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Prepare for your interview with the recruiter using interviewing.io.</p>
          <ul className="list-disc pl-5 mb-4">
            <li>Practice with senior engineers from top companies like Amazon, Google, and Facebook</li>
            <li>Get detailed, actionable feedback on your performance</li>
            <li>Participate in fully anonymous sessions with audio and chat</li>
            <li>Choose from various interview types, including algorithms, data structures, and behavioral</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => handleRedirect('/training/interview-recruiter')}>
              Start Recruiter Interview Training
            </Button>
            <Link href="https://interviewing.io" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">Visit interviewing.io</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Hiring Manager Interview Training</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Get ready for your interview with the hiring manager.</p>
          <Button onClick={() => handleRedirect('/training/interview-hiring-manager')}>
            Start Hiring Manager Interview Training
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Salary Negotiation Training</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Learn strategies for effective salary negotiation.</p>
          <Button onClick={() => handleRedirect('/training/salary-negotiation')} className="mb-4">
            Start Salary Negotiation Training
          </Button>
          <SalaryComparison />
        </CardContent>
      </Card>
    </main>
  )
}