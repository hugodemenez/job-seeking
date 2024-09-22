import type { JobOffer } from './types'

export function generateCoverLetter(offer: JobOffer): string {
  // Here you would typically call an AI service or use some logic to generate the cover letter
  // For this example, we'll just create a simple template
  const generatedCoverLetter = `
Dear Hiring Manager,

I am writing to express my strong interest in the ${offer.position} position at ${offer.company}, as advertised. With my background and skills, I believe I would be a great fit for this role.

${offer.description.split('.')[0]}. This aligns perfectly with my experience and passion for the field.

Throughout my career, I have developed a strong skill set in ${offer.position.toLowerCase()}, and I am excited about the opportunity to bring my expertise to your team. I am particularly drawn to the challenges and opportunities that this role presents.

I would welcome the chance to discuss how my background and skills would be an asset to ${offer.company}. Thank you for your time and consideration.

Sincerely,
[Your Name]

Interview Information:
Recruiter: ${offer.recruiters[0]?.name} (${offer.recruiters[0]?.email})
Hiring Manager: ${offer.hiringManagers[0]?.name} (${offer.hiringManagers[0]?.email})
  `

  return generatedCoverLetter.trim()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { offer } = req.body as { offer: JobOffer }
    const coverLetter = generateCoverLetter(offer)
    res.status(200).json({ coverLetter })
  } catch (error) {
    console.error('Error generating cover letter:', error)
    res.status(500).json({ error: 'Failed to generate cover letter' })
  }
}