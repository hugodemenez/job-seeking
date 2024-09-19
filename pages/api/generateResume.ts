import type { NextApiRequest, NextApiResponse } from 'next'

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

    // Here you would typically call an AI service or use some logic to generate the resume
    // For this example, we'll just create a simple template
    const generatedResume = `
Resume for ${offer.title}

Objective:
Seeking a position as ${offer.position} to contribute my skills and experience to a dynamic team.

Summary of Qualifications:
- Extensive experience in ${offer.position.toLowerCase()} roles
- Strong understanding of ${offer.description.split('.')[0].toLowerCase()}
- Proven track record of success in similar positions

Work Experience:
- Previous role related to ${offer.title}
- Accomplishments aligned with ${offer.description}

Education:
- Relevant degree in a field related to ${offer.position}

Skills:
- Skills extracted from job description: ${offer.description}

Interview Information:
Recruiter: ${offer.recruiter.name} (${offer.recruiter.email})
Hiring Manager: ${offer.hiringManager.name} (${offer.hiringManager.email})
    `

    res.status(200).json({ resume: generatedResume.trim() })
  } catch (error) {
    console.error('Error generating resume:', error)
    res.status(500).json({ error: 'Failed to generate resume' })
  }
}