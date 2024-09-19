import type { NextApiRequest, NextApiResponse } from 'next'
import { generateResume } from '@/lib/generateResume'
import { generateCoverLetter } from '@/lib/generateCoverLetter'

interface JobOffer {
  id: string
  title: string
  position: string
  description: string
  postedDate: string
  recruiter: {
    name: string
    email: string
  }
  hiringManager: {
    name: string
    email: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { offer } = req.body as { offer: JobOffer }

    const resume = await generateResume(offer)
    const coverLetter = await generateCoverLetter(offer)

    res.status(200).json({ resume, coverLetter })
  } catch (error) {
    console.error('Error generating documents:', error)
    res.status(500).json({ error: 'Failed to generate documents' })
  }
}