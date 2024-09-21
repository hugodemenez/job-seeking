import type { NextApiRequest, NextApiResponse } from 'next'
import { generateResume } from '@/lib/generateResume'
import { generateCoverLetter } from '@/lib/generateCoverLetter'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

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

async function createPDF(content: string, title: string): Promise<string> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  page.drawText(title, {
    x: 50,
    y: height - 50,
    size: 20,
    font,
    color: rgb(0, 0, 0),
  })

  const lines = content.split('\n')
  lines.forEach((line, index) => {
    page.drawText(line, {
      x: 50,
      y: height - 100 - index * 20,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    })
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes).toString('base64')
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

    const resumeText = await generateResume(offer)
    const coverLetterText = await generateCoverLetter(offer)

    const resumePDF = await createPDF(resumeText, 'Resume')
    const coverLetterPDF = await createPDF(coverLetterText, 'Cover Letter')

    res.status(200).json({ 
      resume: resumeText,
      coverLetter: coverLetterText,
      resumePDF,
      coverLetterPDF
    })
  } catch (error) {
    console.error('Error generating documents:', error)
    res.status(500).json({ error: 'Failed to generate documents' })
  }
}