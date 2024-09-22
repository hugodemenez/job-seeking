'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon, EyeIcon, LinkedinIcon, FileIcon } from 'lucide-react'
import jobOffersData from '../../data/jobOffers.json'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer'
import Image from 'next/image'

interface JobOffer {
  id: string
  company: string
  companyLogo: string
  position: string
  description: string
  postedDate: string
  recruiter: {
    name: string
    email: string
    linkedinUrl?: string
    avatar?: string
  }
  hiringManager: {
    name: string
    email: string
    linkedinUrl?: string
    avatar?: string
  }
  companyInfo?: CompanyInfo
}

interface CompanyInfo {
  sector: string
  founded: string
  ceo: string
  openPositions: string[]
}

interface KanbanColumn {
  id: string
  title: string
  items: JobOffer[]
}

interface GeneratedDocuments {
  resume: string
  coverLetter: string
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
})

const PDFDocument = ({ content, title }: { content: string, title: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{title}</Text>
        {content.split('\n').map((line, index) => (
          <Text key={index} style={styles.text}>{line}</Text>
        ))}
      </View>
    </Page>
  </Document>
)

export default function KanbanJobBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: 'offers', title: 'Offers', items: [] },
    { id: 'applied', title: 'Applied', items: [] },
    { id: 'recruiter', title: 'Recruiter', items: [] },
    { id: 'hiringManager', title: 'Hiring Manager', items: [] },
  ])
  const [generatedDocuments, setGeneratedDocuments] = useState<Record<string, GeneratedDocuments>>({})

  useEffect(() => {
    const offersWithIds = jobOffersData.map(offer => ({
      ...offer,
      id: crypto.randomUUID()
    }))

    const appliedOffers = offersWithIds.slice(0, 2) // Assuming the first 2 offers are applied
    const recruiterCards = appliedOffers.map(offer => ({ ...offer, id: crypto.randomUUID() }))
    const hiringManagerCards = appliedOffers.map(offer => ({ ...offer, id: crypto.randomUUID() }))

    setColumns(prev => prev.map(col => {
      switch (col.id) {
        case 'offers':
          return { ...col, items: offersWithIds.slice(2) } // Remaining offers
        case 'applied':
          return { ...col, items: appliedOffers }
        case 'recruiter':
          return { ...col, items: recruiterCards }
        case 'hiringManager':
          return { ...col, items: hiringManagerCards }
        default:
          return col
      }
    }))

    // Generate documents for applied offers
    appliedOffers.forEach(generateDocuments)
  }, [])

  const generateDocuments = async (offer: JobOffer) => {
    try {
      const response = await fetch('/api/generateDocuments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ offer }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate documents')
      }

      const documents = await response.json()
      setGeneratedDocuments(prev => ({
        ...prev,
        [offer.id]: documents
      }))
    } catch (error) {
      console.error('Error generating documents:', error)
      toast.error('Failed to generate documents')
    }
  }

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result

    if (!destination) return

    if (source.droppableId === 'applied' || source.droppableId === 'recruiter' || source.droppableId === 'hiringManager') return

    if (source.droppableId === destination.droppableId) return

    const sourceColIndex = columns.findIndex(col => col.id === source.droppableId)
    const destColIndex = columns.findIndex(col => col.id === destination.droppableId)

    const sourceCol = columns[sourceColIndex]
    const destCol = columns[destColIndex]

    const sourceItems = [...sourceCol.items]
    const destItems = [...destCol.items]

    const [movedItem] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index, 0, movedItem)

    const newColumns = [...columns]
    newColumns[sourceColIndex] = { ...sourceCol, items: sourceItems }
    newColumns[destColIndex] = { ...destCol, items: destItems }

    if (destination.droppableId === 'applied') {
      const recruiterCard = { ...movedItem, id: crypto.randomUUID() }
      const hiringManagerCard = { ...movedItem, id: crypto.randomUUID() }

      newColumns[2].items.push(recruiterCard)
      newColumns[3].items.push(hiringManagerCard)

      toast("Application submitted. Cards created for Recruiter and Hiring Manager.")

      // Generate documents when moved to 'applied'
      await generateDocuments(movedItem)
    }

    setColumns(newColumns)
  }

  const JobOfferCard = ({ offer, index, columnId }: { offer: JobOffer, index: number, columnId: string }) => {
    if (columnId === 'recruiter' || columnId === 'hiringManager') {
      const person = columnId === 'recruiter' ? offer.recruiter : offer.hiringManager
      return (
        <Draggable draggableId={offer.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Card className="w-full mb-4">
                <CardHeader className='flex flex-row items-center gap-2'>
                  <Avatar>
                    <AvatarImage src={person.avatar} />
                    <AvatarFallback>
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{person.name}</CardTitle>

                </CardHeader>
                <CardContent>
                  <CardDescription>{person.email}</CardDescription>
                </CardContent>
                <CardFooter className="flex flex-col justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open('https://interviewing.io', '_blank')
                    }}
                    className='w-full text-black bg-white font-mono  flex gap-x-2 text-xs'>
                    Train with
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" height="23" viewBox="0 0 66 60"><g fill="none"><circle cx="33.5" cy="30.5" r="19.5" fill="#191e2a"></circle><path fill="hsl(49, 100%, 58%)" d="M9.29361504 51.0638317C3.6112475 45.615908 0 38.1913413 0 30 0 13.4314575 14.7746033 0 33 0c18.2253967 0 33 13.4314575 33 30S51.2253967 60 33 60c-.675214 0-1.3456917-.0184354-2.0109527-.0547637L31 60H.9963151c-.55024963 0-.66757903-.3160924-.27378995-.6947357l8.5710899-8.2414326zM43.9135787 31.3513934l-6.5085816 6.4902392c-.6043165.6026134-.5148206 1.5337974.1997291 2.0088213l1.314223.8736796c.656402.4363681 1.5932336.3456817 2.1461663-.2056927l8.5002268-8.4762715c.5805928-.5789567.5784934-1.5077402 0-2.0846034l-8.5002268-8.4762715c-.554671-.5531078-1.4926435-.6401467-2.1461663-.2056927l-1.314223.8736796c-.7208472.4792104-.8095753 1.4006937-.1997291 2.0088213l6.5085816 6.4902392c.1914525.1909129 0 .7030516 0 .7030516zm-21.8271574 0c-.1923352-.1917932-.1914525-.5121387 0-.7030516l6.5085816-6.4902392c.6098462-.6081276.5211181-1.5296109-.1997291-2.0088213l-1.314223-.8736796c-.6535228-.434454-1.5914953-.3474151-2.1461663.2056927l-8.5002268 8.4762715c-.5784934.5768632-.5805928 1.5056467 0 2.0846034l8.5002268 8.4762715c.5529327.5513744 1.4897643.6420608 2.1461663.2056927l1.314223-.8736796c.7145497-.4750239.8040456-1.4062079.1997291-2.0088213l-6.5085816-6.4902392z"></path></g></svg>
                    </div>
                    interviewing.io
                    </Button>
                  {person.linkedinUrl && (
                    <Button
                      variant="outline"
                      asChild
                      className="w-full bg-white text-black px-4 py-2 h-auto flex items-center gap-8"
                    >
                      <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <div className="flex flex-col items-start">
                          <Image src={'/LI-Logo.png'} alt="LinkedIn" width={60} height={20} />
                        </div>
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          )}
        </Draggable>
      )
    }

    const DocumentPreview = ({ type }: { type: 'resume' | 'coverLetter' }) => (
      <div className="max-w-sm max-h-[800px] overflow-auto">
        <PDFViewer width="100%" height="300">
          <PDFDocument
            content={generatedDocuments[offer.id][type]}
            title={type === 'resume' ? 'Resume' : 'Cover Letter'}
          />
        </PDFViewer>
      </div>
    )

    const PersonCard = ({ person, title }: { person: { name: string, email: string, linkedinUrl?: string, avatar?: string }, title: string }) => (
      <Card className="w-full mb-4">
        <CardHeader className='flex flex-row items-center gap-2'>
          <Avatar>
            <AvatarImage src={person.avatar} />
            <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{person.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </CardHeader>
        <CardContent>
          {person.linkedinUrl && (
            <Button
              variant="outline"
              asChild
              className="bg-white text-black px-4 py-2 h-auto flex items-center gap-8"
            >
              <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="w-4 h-4 mr-2" />
                LinkedIn Profile
              </a>
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">{person.email}</p>
        </CardFooter>
      </Card>
    )

    return (
      <Draggable draggableId={offer.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Card className="w-full mb-4">
              <CardHeader className='flex flex-row items-center gap-2'>
                <Avatar>
                  <AvatarImage src={offer.companyLogo} />
                  <AvatarFallback>
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{offer.company}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{offer.position}</p>
                <p className="text-sm mb-4">{offer.description.split(" ").slice(0, 6).join(" ")}...</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Posted on: {new Date(offer.postedDate).toLocaleDateString()}
                </p>
                <Sheet>
                  <SheetTrigger>
                    <Button variant="outline" size="sm">
                      Details
                      <EyeIcon className="w-4 h-4 ml-2" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent size="large">
                    <SheetHeader>
                      <SheetTitle>{offer.company}</SheetTitle>
                    </SheetHeader>
                    <SheetDescription>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Job Description</h3>
                        <p>{offer.description}</p>

                        {offer.companyInfo && (
                          <>
                            <h3 className="text-lg font-semibold">Company Information</h3>
                            <ul className="list-disc list-inside">
                              <li>Sector: {offer.companyInfo.sector}</li>
                              <li>Founded: {offer.companyInfo.founded}</li>
                              <li>CEO: {offer.companyInfo.ceo}</li>
                            </ul>

                            <h4 className="text-md font-semibold">Open Positions</h4>
                            <ul className="list-disc list-inside">
                              {offer.companyInfo.openPositions.map((position, index) => (
                                <li key={index}>{position}</li>
                              ))}
                            </ul>
                          </>
                        )}

                        <h3 className="text-lg font-semibold">Key Contacts</h3>
                        <PersonCard person={offer.recruiter} title="Recruiter" />
                        <PersonCard person={offer.hiringManager} title="Hiring Manager" />
                      </div>
                    </SheetDescription>
                    {generatedDocuments[offer.id] && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Generated Documents</h3>
                        <div className="space-y-2 space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <FileIcon className="w-4 h-4 mr-2" />
                                  Resume
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <DocumentPreview type="resume" />
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <FileIcon className="w-4 h-4 mr-2" />
                                  Cover Letter
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <DocumentPreview type="coverLetter" />
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
              </CardFooter>
            </Card>
          </div>
        )}
      </Draggable>
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 p-4 overflow-x-auto">
        {columns.map(column => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <h2 className="text-xl font-bold mb-4">{column.title}</h2>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-50 p-4 rounded-lg min-h-[500px]"
                >
                  {column.items.map((offer, index) => (
                    <JobOfferCard key={offer.id} offer={offer} index={index} columnId={column.id} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}