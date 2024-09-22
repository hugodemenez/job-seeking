'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon, XIcon, BookmarkIcon, Loader2 } from 'lucide-react'
import jobOffersData from '../data/jobOffers.json'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface CompanyInfo {
  sector: string;
  founded: string;
  ceo: {
    name: string;
    avatar: string;
    linkedinUrl: string;
  };
  openPositions: string[];
}

interface JobOffer {
  id: string
  company: string
  companyLogo: string
  position: string
  description: string
  postedDate: string
  recruiters: {
    name: string
    email: string
    linkedinUrl?: string
    avatar: string
  }[]
  hiringManagers: {
    name: string
    email: string
    linkedinUrl?: string
    avatar: string
  }[]
  companyInfo?: CompanyInfo
}

interface GeneratedDocuments {
  resume: string;
  coverLetter: string;
}

export default function JobOffers() {
  const [displayedOffers, setDisplayedOffers] = useState<JobOffer[]>([])
  const [remainingOffers, setRemainingOffers] = useState<JobOffer[]>([])
  const [actionStates, setActionStates] = useState<{ [key: string]: 'idle' | 'accepted' | 'denied' | 'saved' | 'generating' | 'ready' }>({})
  const [generatedDocuments, setGeneratedDocuments] = useState<{ [key: string]: GeneratedDocuments }>({})
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const [highlightedOffers, setHighlightedOffers] = useState<Set<string>>(new Set())
  const [additionTimes, setAdditionTimes] = useState<{ [key: string]: number }>({})

  const addNewOffer = useCallback(() => {
    if (remainingOffers.length > 0) {
      console.log('Adding new offer')
      const newOffer = remainingOffers[0]
      setDisplayedOffers(prev => [...prev, newOffer])
      setRemainingOffers(prev => prev.slice(1))
      toast("New offer has been added.")
      
      setHighlightedOffers(prev => new Set(prev).add(newOffer.id))
      
      setAdditionTimes(prev => ({...prev, [newOffer.id]: Date.now()}))
      
      setTimeout(() => {
        setHighlightedOffers(prev => {
          const updated = new Set(prev)
          updated.delete(newOffer.id)
          return updated
        })
      }, 5000)
    }
  }, [remainingOffers, displayedOffers.length])

  // Update seconds ago every second
  useEffect(() => {
    const interval = setInterval(() => {
      setAdditionTimes(prev => {
        const now = Date.now()
        const updated = {...prev}
        Object.keys(updated).forEach(id => {
          if (now - updated[id] > 60000) { // Remove after 60 seconds
            delete updated[id]
          }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Function to schedule the next offer
  const scheduleNextOffer = useCallback(() => {
    console.log('Scheduling next offer')
    // If there are only two offers, add a new one after 2 seconds
    if (displayedOffers.length === 2 && remainingOffers.length > 0) {
      setTimeout(() => {
        addNewOffer();
      }, 2000);
      return; // Exit early to avoid scheduling another offer
    }
    const delay = Math.floor(Math.random() * (10000 - 1000 + 1)) + 5000 // Random delay between 5-15 seconds
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      addNewOffer()
      if (remainingOffers.length > 0) {
        scheduleNextOffer()
      }
    }, delay)
  }, [addNewOffer, remainingOffers.length])

  useEffect(() => {
    scheduleNextOffer()
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [scheduleNextOffer])

  useEffect(() => {
    // Add unique IDs to job offers
    const offersWithIds = jobOffersData.map(offer => ({
      ...offer,
      id: crypto.randomUUID(),
      recruiter: offer.recruiters[0], // Assign the first recruiter as the main recruiter
      hiringManager: offer.hiringManagers[0] // Assign the first hiring manager as the main hiring manager
    }))

    // Initialize with 2 random offers
    const shuffled = [...offersWithIds].sort(() => 0.5 - Math.random())
    setDisplayedOffers(shuffled.slice(0, 2))
    setRemainingOffers(shuffled.slice(2))

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleAction = async (offer: JobOffer, action: 'accepted' | 'denied' | 'saved' | 'generating') => {
    setActionStates(prevStates => ({
      ...prevStates,
      [offer.id]: action
    }))
    console.log(`Job offer for "${offer.company}" ${action}`)

    if (action === 'accepted') {
      setActionStates(prevStates => ({
        ...prevStates,
        [offer.id]: 'generating'
      }))
      try {
        const response = await fetch('/api/generateDocuments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ offer })
        })
        const data = await response.json()
        if (response.ok) {
          const { resume, coverLetter } = data
          setGeneratedDocuments(prevDocs => ({
            ...prevDocs,
            [offer.id]: { resume, coverLetter }
          }))
          setActionStates(prevStates => ({
            ...prevStates,
            [offer.id]: 'ready'
          }))
        } else {
          console.error('Failed to generate documents:', data.error)
          setActionStates(prevStates => ({
            ...prevStates,
            [offer.id]: 'idle'
          }))
        }
      } catch (error) {
        console.error('Failed to generate documents:', error)
        setActionStates(prevStates => ({
          ...prevStates,
          [offer.id]: 'idle'
        }))
      }
    }
  }

  const handleRedirect = (offer: JobOffer) => {
    const documents = generatedDocuments[offer.id]
    if (documents) {
      router.push(`/generated-documents?offer=${encodeURIComponent(JSON.stringify(offer))}&resume=${encodeURIComponent(documents.resume)}&coverLetter=${encodeURIComponent(documents.coverLetter)}`)
    }
  }

  return (
    <main className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Job Offers</h1>
      <ul className="space-y-4">
        <AnimatePresence>
          {displayedOffers.map((offer) => (
            <motion.li
              key={offer.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={`w-full ${highlightedOffers.has(offer.id) ? 'ring-2 ring-primary' : ''} relative`}>
                {additionTimes[offer.id] && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded-bl">
                    Just added {Math.floor((Date.now() - additionTimes[offer.id]) / 1000)} seconds ago
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{offer.company}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{offer.position}</p>
                  <p className="text-sm mb-4">{offer.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Posted on: {new Date(offer.postedDate).toLocaleDateString()}
                  </p>
                  {generatedDocuments[offer.id] && (
                    <div className="mt-4 p-4 border rounded bg-gray-50">
                      <h2 className="text-lg font-bold mb-2">Generated Resume</h2>
                      <pre className="text-sm whitespace-pre-wrap">{generatedDocuments[offer.id].resume}</pre>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => actionStates[offer.id] === 'ready' ? handleRedirect(offer) : handleAction(offer, 'accepted')}
                    disabled={['denied', 'saved'].includes(actionStates[offer.id] || '')}
                    className={actionStates[offer.id] === 'ready' ? 'bg-green-100' : ''}
                  >
                    {actionStates[offer.id] === 'generating' && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {actionStates[offer.id] === 'ready' && (
                      <CheckIcon className="w-4 h-4 mr-2" />
                    )}
                    {actionStates[offer.id] === 'generating' ? 'Generating...' : 
                     actionStates[offer.id] === 'ready' ? 'Go to next steps' : 'Accept'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(offer, 'denied')}
                    disabled={actionStates[offer.id] !== undefined}
                    className={actionStates[offer.id] === 'denied' ? 'bg-red-100' : ''}
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    Deny
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(offer, 'saved')}
                    disabled={actionStates[offer.id] !== undefined}
                    className={actionStates[offer.id] === 'saved' ? 'bg-blue-100' : ''}
                  >
                    <BookmarkIcon className="w-4 h-4 mr-2" />
                    Save for Later
                  </Button>
                </CardFooter>
              </Card>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </main>
  )
}