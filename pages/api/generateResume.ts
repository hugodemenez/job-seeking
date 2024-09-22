import type { NextApiRequest, NextApiResponse } from 'next'

interface JobOffer {
  id: string
  company: string
  position: string
  description: string
  postedDate: string
  recruiters: {
    name: string
    email: string
  }[]
  hiringManagers: {
    name: string
    email: string
  }[]
}

export function generateResume(offer: JobOffer): string {
  // Here you would typically call an AI service or use some logic to generate the resume
  // For this example, we'll just create a simple template
  const generatedResume = `
Resume for ${offer.position} at ${offer.company}

Objective:
Seeking a position as ${offer.position} to contribute my skills and experience to a dynamic team at ${offer.company}.

Summary of Qualifications:
- Extensive experience in ${offer.position.toLowerCase()} roles
- Strong understanding of ${offer.description.split('.')[0].toLowerCase()}
- Proven track record of success in similar positions

Work Experience:
- Previous role related to ${offer.position}
- Accomplishments aligned with ${offer.description}

Education:
- Relevant degree in a field related to ${offer.position}

Skills:
- Skills extracted from job description: ${offer.description}

Interview Information:
Recruiter: ${offer.recruiters[0]?.name} (${offer.recruiters[0]?.email})
Hiring Manager: ${offer.hiringManagers[0]?.name} (${offer.hiringManagers[0]?.email})
  `

  return generatedResume.trim()
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
    const resume = generateResume(offer)
    res.status(200).json({ resume })
  } catch (error) {
    console.error('Error generating resume:', error)
    res.status(500).json({ error: 'Failed to generate resume' })
  }
}