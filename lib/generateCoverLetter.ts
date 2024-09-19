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

export async function generateCoverLetter(offer: JobOffer): Promise<string> {
  // Generate a simple cover letter template
  const generatedCoverLetter = `
Dear Hiring Manager,

I am writing to express my strong interest in the ${offer.position} position at your company, as advertised. With my background and skills, I believe I would be a great fit for this role.

${offer.description.split('.')[0]}. This aligns perfectly with my experience and passion for the field.

Throughout my career, I have developed a strong skill set in ${offer.position.toLowerCase()}, and I am excited about the opportunity to bring my expertise to your team. I am particularly drawn to the challenges and opportunities that this role presents.

I would welcome the chance to discuss how my background and skills would be an asset to your company. Thank you for your time and consideration.

Sincerely,
[Your Name]

Interview Information:
Recruiter: ${offer.recruiter.name} (${offer.recruiter.email})
Hiring Manager: ${offer.hiringManager.name} (${offer.hiringManager.email})
  `

  return generatedCoverLetter.trim()
}