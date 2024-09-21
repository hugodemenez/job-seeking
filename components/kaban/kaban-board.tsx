'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

                  <CardTitle>{person.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {person.linkedinUrl && (
                    <Button
                      variant="outline"
                      asChild
                      className="bg-white text-black px-4 py-2 h-auto flex items-center gap-8"
                    >
                      <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Avatar>
                          <AvatarImage src={person.avatar} />
                          <AvatarFallback>
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <Image src={'/LI-Logo.png'} alt="LinkedIn" width={60} height={20} />
                        </div>
                      </a>
                    </Button>
                  )}

                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">{person.email}</p>
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
                      {offer.description}
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