'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, Brain, BrainCircuit, EyeIcon, FileIcon, GraduationCap, Info } from 'lucide-react'
import jobOffersData from '../../data/jobOffers.json'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer'
import Image from 'next/image'
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel'
import Autoplay from "embla-carousel-autoplay"
import { bouncy } from 'ldrs'
import { CompanyLogo } from '../companies-logo'
import SalaryComparison from '../salary-comparison'

bouncy.register()

interface JobOffer {
  id: string
  originalOfferId?: string
  company: string
  companyLogo: string
  position: string
  description: string
  postedDate: string
  recruiters: {
    name: string
    email: string
    linkedinUrl?: string
    avatar?: string
  }[]
  hiringManagers: {
    name: string
    email: string
    linkedinUrl?: string
    avatar?: string
  }[]
  companyInfo?: CompanyInfo
}

interface CompanyInfo {
  sector: string
  founded: string
  ceo: {
    name: string
    avatar: string
    linkedinUrl: string
  }
  openPositions: string[]
}


interface KanbanColumn {
  id: string
  title: string
  items: (JobOffer)[]
}

interface GeneratedDocuments {
  resume: string
  coverLetter: string
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
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

const customColors = [
  'custom-mint',
  'custom-yellow',
  'custom-lavender',
  'custom-periwinkle',
  'custom-light-blue',
  'custom-peach',
];

export default function KanbanJobBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: 'offers', title: 'Offers', items: [] },
    { id: 'applied', title: 'Applied', items: [] },
    { id: 'recruiter', title: 'Recruiter', items: [] },
    { id: 'hiringManager', title: 'Hiring Manager', items: [] },
  ])
  const [generatedDocuments, setGeneratedDocuments] = useState<Record<string, GeneratedDocuments>>({})
  const [colorMap, setColorMap] = useState<Record<string, string>>({})
  const [loadingDocuments, setLoadingDocuments] = useState<Record<string, boolean>>({})


  useEffect(() => {
    const offersWithIds = jobOffersData.map(offer => ({
      ...offer,
      id: crypto.randomUUID()
    }))

    const newColorMap: Record<string, string> = {}
    offersWithIds.forEach((offer) => {
      newColorMap[offer.id] = getColorFromCompanyName(offer.company)
    })
    setColorMap(newColorMap)

    const appliedOffers = offersWithIds.slice(0, 1)

    const recruiterCards = appliedOffers.flatMap(offer =>
      offer.recruiters.map(recruiter => ({
        ...offer,
        ...recruiter,
        id: crypto.randomUUID(),
        type: 'recruiter' as const,
        originalOfferId: offer.id
      }))
    )
    const hiringManagerCards = appliedOffers.flatMap(offer =>
      offer.hiringManagers.map(manager => ({
        ...offer,
        ...manager,
        id: crypto.randomUUID(),
        type: 'hiringManager' as const,
        originalOfferId: offer.id
      }))
    )

    setColumns(prev => prev.map(col => {
      switch (col.id) {
        case 'offers':
          return { ...col, items: offersWithIds.slice(1) }
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
    setLoadingDocuments(prev => ({ ...prev, [offer.id]: true }))
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000))
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
      toast.error('Failed to generate documents. Please try again later.')
    } finally {
      setLoadingDocuments(prev => ({ ...prev, [offer.id]: false }))
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

    setColumns(newColumns)
    if (destination.droppableId === 'applied') {
      const newColor = customColors[Object.keys(colorMap).length % customColors.length]
      setColorMap(prev => ({ ...prev, [movedItem.id]: getColorFromCompanyName(movedItem.company) }))

      const recruiterCards = movedItem.recruiters.map(recruiter => ({
        ...movedItem,
        ...recruiter,
        id: crypto.randomUUID(),
        type: 'recruiter' as const,
        originalOfferId: movedItem.id
      }))
      const hiringManagerCards = movedItem.hiringManagers.map(manager => ({
        ...movedItem,
        ...manager,
        id: crypto.randomUUID(),
        type: 'hiringManager' as const,
        originalOfferId: movedItem.id
      }))

      newColumns[2].items.push(...recruiterCards)
      newColumns[3].items.push(...hiringManagerCards)

      toast("Application submitted. Cards created for Recruiter and Hiring Manager.")

      // Generate documents when moved to 'applied'
      await generateDocuments(movedItem)
    }

  }
  const getColorFromCompanyName = (companyName: string): string => {
    if (companyName === 'Google') return 'custom-peach'
    if (companyName === 'GitHub') return 'custom-yellow'
    if (companyName === 'LinkedIn') return 'custom-lavender'
    if (companyName === 'Amazon') return 'custom-periwinkle'
    if (companyName === 'Microsoft') return 'custom-light-blue'
    if (companyName === 'Tesla') return 'custom-mint'
    return 'gray-200'
  };

  
  const getBorderColorClass = (offer: JobOffer) => {
    return `border-${getColorFromCompanyName(offer.company)}`
  }

  const JobOfferCard = ({ offer, index, columnId }: { offer: JobOffer, index: number, columnId: string }) => {

    const borderColorClass = getBorderColorClass(offer)

    if (columnId === 'recruiter' || columnId === 'hiringManager') {
      const person = offer as JobOffer & {
        type: 'recruiter' | 'hiringManager';
        name: string;
        email: string;
        avatar?: string;
        linkedinUrl?: string;
      };
      const isCharlieBrown = person.name === 'Charlie Brown'

      return (
        <Draggable draggableId={offer.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Card className={`w-full mb-4 border-2 ${offer.company === 'Google' ? 'border-custom-peach' : offer.company === 'GitHub' ? 'border-custom-yellow' : offer.company === 'LinkedIn' ? 'border-custom-lavender' : offer.company === 'Amazon' ? 'border-custom-periwinkle' : offer.company === 'Microsoft' ? 'border-custom-light-blue' : offer.company === 'Tesla' ? 'border-custom-mint' : borderColorClass}`}>
                <CardHeader className='flex justify-between items-center gap-2'>
                  <div className='justify-start flex w-full'>
                    <div className='flex w-full justify-start items-center gap-2'>
                      <Avatar>
                        <AvatarImage src={person.avatar} />
                        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{person.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{columnId === 'recruiter' ? 'Recruiter' : 'Hiring Manager'}</p>
                      </div>
                    </div>
                    {isCharlieBrown && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className='flex items-center gap-2 text-sm self-start'><Info className='w-4 h-4 '></Info></TooltipTrigger>
                          <TooltipContent>
                            <div className="flex items-center gap-2 text-sm">
                              <Brain className="w-4 h-4" />
                              <span>Common Interest in Baseball</span>
                            </div>
                            <div className='flex items-center gap-2 text-sm'>
                              {/* Both studied at Stanford */}
                              <GraduationCap className="w-4 h-4" />
                              <span>Both studied at Stanford</span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <CardDescription className='w-full justify-start'>
                    {person.email}</CardDescription>
                </CardHeader>
                <CardFooter className="grid grid-cols-2 justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open('https://interviewing.io', '_blank')
                    }}
                    className='w-full text-black bg-white font-mono  flex gap-x-2 text-xs'>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" height="23" viewBox="0 0 66 60"><g fill="none"><circle cx="33.5" cy="30.5" r="19.5" fill="#191e2a"></circle><path fill="hsl(49, 100%, 58%)" d="M9.29361504 51.0638317C3.6112475 45.615908 0 38.1913413 0 30 0 13.4314575 14.7746033 0 33 0c18.2253967 0 33 13.4314575 33 30S51.2253967 60 33 60c-.675214 0-1.3456917-.0184354-2.0109527-.0547637L31 60H.9963151c-.55024963 0-.66757903-.3160924-.27378995-.6947357l8.5710899-8.2414326zM43.9135787 31.3513934l-6.5085816 6.4902392c-.6043165.6026134-.5148206 1.5337974.1997291 2.0088213l1.314223.8736796c.656402.4363681 1.5932336.3456817 2.1461663-.2056927l8.5002268-8.4762715c.5805928-.5789567.5784934-1.5077402 0-2.0846034l-8.5002268-8.4762715c-.554671-.5531078-1.4926435-.6401467-2.1461663-.2056927l-1.314223.8736796c-.7208472.4792104-.8095753 1.4006937-.1997291 2.0088213l6.5085816 6.4902392c.1914525.1909129 0 .7030516 0 .7030516zm-21.8271574 0c-.1923352-.1917932-.1914525-.5121387 0-.7030516l6.5085816-6.4902392c.6098462-.6081276.5211181-1.5296109-.1997291-2.0088213l-1.314223-.8736796c-.6535228-.434454-1.5914953-.3474151-2.1461663.2056927l-8.5002268 8.4762715c-.5784934.5768632-.5805928 1.5056467 0 2.0846034l8.5002268 8.4762715c.5529327.5513744 1.4897643.6420608 2.1461663.2056927l1.314223-.8736796c.7145497-.4750239.8040456-1.4062079.1997291-2.0088213l-6.5085816-6.4902392z"></path></g></svg>
                    </div>
                    interviewing.io
                  </Button>
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

    const PersonCard = ({ person, title }: { person: { name: string, email: string, linkedinUrl?: string, avatar?: string }, title: string }) => {
      const isCharlieBrown = person.name === 'Charlie Brown'
      return (
        <Card className="w-full mb-4">
          <CardHeader className='flex flex-row items-center justify-between p-2 w-full'>
            <div className='flex items-center gap-2'>
              <Avatar>
                <AvatarImage src={person.avatar} />
                <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{person.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{title}</p>
              </div>
            </div>
            {isCharlieBrown && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className='flex items-center gap-2 text-sm self-start'><Info className='w-4 h-4 '></Info></TooltipTrigger>
                  <TooltipContent>
                    <div className="flex items-center gap-2 text-sm">
                      <Brain className="w-4 h-4" />
                      <span>Common Interest: Baseball</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}


          </CardHeader>
          <CardFooter className='flex justify-between p-2 self-end'>
            <p className="text-sm text-muted-foreground">{person.email}</p>
            {person.linkedinUrl && (
              <Button
                variant="outline"
                asChild
                className="bg-white text-black px-4 py-2 h-auto flex items-center gap-8"
              >
                <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </Button>
            )}
          </CardFooter>
        </Card>
      )
    }

    if (columnId === 'applied') {
      return (
        <Draggable draggableId={offer.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Card className={`w-full mb-4 border-2 ${offer.company === 'Google' ? 'border-custom-peach' : offer.company === 'GitHub' ? 'border-custom-yellow' : offer.company === 'LinkedIn' ? 'border-custom-lavender' : offer.company === 'Amazon' ? 'border-custom-periwinkle' : offer.company === 'Microsoft' ? 'border-custom-light-blue' : offer.company === 'Tesla' ? 'border-custom-mint' : borderColorClass}`}>
                <CardHeader className='flex flex-row items-center gap-2 pb-2'>
                  <Avatar>
                    <AvatarImage src={offer.companyLogo} />
                    <AvatarFallback>{offer.company.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="p-0">
                    {offer.company}
                    <p className="text-sm font-light text-muted-foreground">{offer.position}</p>
                  </CardTitle>
                </CardHeader>
                <CardContent className='pb-2'>
                  <p className="text-sm text-muted-foreground">{offer.description.split(" ").slice(0, 15).join(" ")}...</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    Posted on: {new Date(offer.postedDate).toLocaleDateString()}
                  </p>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        {loadingDocuments[offer.id] ? (
                          <div className="flex items-center justify-center gap-2">
                            <p className="mt-2 text-xs font-light">Generating documents</p>
                            <l-bouncy
                              size="24"
                              speed="1.75"
                              color="black"
                            />
                          </div>
                        ) : <div className='flex items-center justify-center gap-2'>
                          Learn more
                          <Book className='w-4 h-4'></Book>
                        </div>
                        }
                      </Button>
                    </SheetTrigger>
                    <SheetContent size="large" className="overflow-y-auto">
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
                                <div className="mt-2">
                                  <h4 className="text-md font-semibold">CEO</h4>
                                  <Card className="mt-1">
                                    <CardHeader className="flex flex-row items-center gap-2 p-2">
                                      <Avatar>
                                        <AvatarImage src={offer.companyInfo.ceo.avatar} />
                                        <AvatarFallback>{offer.companyInfo.ceo.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <CardTitle className="text-sm">{offer.companyInfo.ceo.name}</CardTitle>
                                        <a href={offer.companyInfo.ceo.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                                          LinkedIn Profile
                                        </a>
                                      </div>
                                    </CardHeader>
                                  </Card>
                                </div>
                              </ul>

                              <h4 className="text-md font-semibold">Open Positions</h4>
                              <div>
                                <Carousel className="w-full"
                                  plugins={[
                                    Autoplay({
                                      delay: 2000,
                                    }),
                                  ]}
                                  opts={{
                                    loop: true,
                                    dragFree: true,
                                    align: 'start',
                                  }}
                                >
                                  <CarouselContent className="-ml-1">
                                    {offer.companyInfo.openPositions.map((position, index) => (
                                      <CarouselItem key={index} className="pl-1 lg:basis-1/2">
                                        <Card>
                                          <CardHeader>
                                            <span className="text-xs font-semibold">{position}</span>
                                          </CardHeader>
                                        </Card>
                                      </CarouselItem>
                                    ))}
                                  </CarouselContent>
                                </Carousel>
                              </div>
                            </>
                          )}

                          <SalaryComparison offer={offer}></SalaryComparison>

                          <h3 className="text-lg font-semibold">Recruiters</h3>
                          <div className="flex gap-2">
                            {offer.recruiters.map((recruiter, index) => (
                              <PersonCard key={index} person={recruiter} title="Recruiter" />
                            ))}
                          </div>
                          <h3 className="text-lg font-semibold mt-4">Hiring Managers</h3>
                          <div className="flex gap-2">
                            {offer.hiringManagers.map((manager, index) => (
                              <PersonCard key={index} person={manager} title="Hiring Manager" />
                            ))}
                          </div>
                        </div>
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
                      </SheetDescription>
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
      <Draggable draggableId={offer.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Card className={`w-full mb-4 border-2 ${columnId === 'offers' ? 'border-gray-50' : borderColorClass}`}>
              <CardHeader className='flex flex-row items-center gap-2 pb-2'>
                <Avatar>
                  <AvatarImage src={offer.companyLogo} />
                  <AvatarFallback>{offer.company.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="p-0">
                  {offer.company}
                  <p className="text-sm font-light text-muted-foreground">{offer.position}</p>
                </CardTitle>
              </CardHeader>
              <CardContent className='pb-2'>
                <p className="text-sm text-muted-foreground">{offer.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Posted on: {new Date(offer.postedDate).toLocaleDateString()}
                </p>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      Details
                      <EyeIcon className="w-4 h-4 ml-2" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent size="large" className="overflow-y-auto">
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
                              <div className="mt-2">
                                <h4 className="text-md font-semibold">CEO</h4>
                                <Card className="mt-1">
                                  <CardHeader className="flex flex-row items-center gap-2 p-2">
                                    <Avatar>
                                      <AvatarImage src={offer.companyInfo.ceo.avatar} />
                                      <AvatarFallback>{offer.companyInfo.ceo.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <CardTitle className="text-sm">{offer.companyInfo.ceo.name}</CardTitle>
                                      <a href={offer.companyInfo.ceo.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                                        LinkedIn Profile
                                      </a>
                                    </div>
                                  </CardHeader>
                                </Card>
                              </div>
                            </ul>

                            <h4 className="text-md font-semibold">Open Positions</h4>
                            <div>
                              <Carousel className="w-full"
                                plugins={[
                                  Autoplay({
                                    delay: 2000,
                                  }),
                                ]}
                                opts={{
                                  loop: true,
                                  dragFree: true,
                                  align: 'start',
                                }}
                              >
                                <CarouselContent className="-ml-1">
                                  {offer.companyInfo.openPositions.map((position, index) => (
                                    <CarouselItem key={index} className="pl-1 lg:basis-1/2">
                                      <Card>
                                        <CardHeader>
                                          <span className="text-xs font-semibold">{position}</span>
                                        </CardHeader>
                                      </Card>
                                    </CarouselItem>
                                  ))}
                                </CarouselContent>
                              </Carousel>
                            </div>
                          </>
                        )}

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

                        <h3 className="text-lg font-semibold">Recruiters</h3>
                        <div className="flex gap-2">
                          {offer.recruiters.map((recruiter, index) => (
                            <PersonCard key={index} person={recruiter} title="Recruiter" />
                          ))}
                        </div>
                        <h3 className="text-lg font-semibold mt-4">Hiring Managers</h3>
                        <div className="flex gap-2">
                          {offer.hiringManagers.map((manager, index) => (
                            <PersonCard key={index} person={manager} title="Hiring Manager" />
                          ))}
                        </div>
                      </div>
                    </SheetDescription>
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
      <div className="flex space-x-2 overflow-x-auto w-full h-[calc(100vh-300px)]">
        {columns.map(column => (
          <div key={column.id} className="flex-shrink-0 flex-1 flex flex-col h-full">
            <h2 className="text-xl font-medium mb-4">
              {column.title} <span className="text-sm font-normal text-muted-foreground">({column.items.length})</span>
            </h2>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-4 rounded-lg bg-gray-50 border-2  flex-1 overflow-y-auto"
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