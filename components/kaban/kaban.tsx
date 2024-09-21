import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { PlusIcon, Linkedin } from "lucide-react"

// Define an interface for the task object
interface Task {
  title: string;
  description: string;
  logo?: string;
  linkedinUrl?: string;
}

export default function Component() {
  const [openSheet, setOpenSheet] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Task | null>(null)

  const columns = [
    {
      name: "Opportunities",
      color: "border-[#8EE8CF]",
      tasks: [
        { title: "Sales Manager ACME", logo: "/placeholder.svg?height=40&width=40", description: "Lead sales team for ACME's innovative products" },
        { title: "Sales Manager ABC", logo: "/placeholder.svg?height=40&width=40", description: "Develop sales strategies for ABC Corporation" },
        { title: "AE ZZZZ", logo: "/placeholder.svg?height=40&width=40", description: "Account executive role at ZZZZ Tech" },
        { title: "CSM ACME", logo: "/placeholder.svg?height=40&width=40", description: "Manage customer success for ACME clients" },
        { title: "VP Sales AVC", logo: "/placeholder.svg?height=40&width=40", description: "Lead global sales team at AVC" },
      ]
    },
    {
      name: "Applied",
      color: "border-[#FFEA85]",
      tasks: [
        { title: "Sales Director", logo: "/placeholder.svg?height=40&width=40", description: "Direct sales operations for tech startup" },
        { title: "AM BBB", logo: "/placeholder.svg?height=40&width=40", description: "Account management role at BBB Inc." },
        { title: "Sales Director OOO", logo: "/placeholder.svg?height=40&width=40", description: "Lead sales team for OOO's expansion" },
      ]
    },
    {
      name: "Interview Recruiter",
      color: "border-[#F6C3FF]",
      tasks: [
        { title: "Neily Lemai", linkedinUrl: "https://www.linkedin.com/in/neilylemai/", description: "Experienced tech recruiter specializing in sales" },
        { title: "Sandi L", linkedinUrl: "https://www.linkedin.com/in/sandil/", description: "Senior recruiter for Fortune 500 companies" },
        { title: "Éline Gerstner", linkedinUrl: "https://www.linkedin.com/in/%C3%A9line-gerstner-869424146/", description: "International talent acquisition specialist" },
        { title: "Sandrine Tadeusiak", linkedinUrl: "https://www.linkedin.com/in/sandrine-tadeusiak-0311a44/", description: "Executive recruiter for tech industry" },
        { title: "Deirdre McDonough", linkedinUrl: "https://www.linkedin.com/in/deirdre-mcdonough/", description: "Recruiter focusing on sales leadership roles" },
      ]
    },
    {
      name: "Interview Hiring Manager",
      color: "border-[#BFC9FA]",
      tasks: [
        { title: "Alessandro Vittozzi", linkedinUrl: "https://www.linkedin.com/in/alessandrovittozzi/", description: "VP of Sales at TechCorp" },
        { title: "Ozlem Cikoca", linkedinUrl: "https://www.linkedin.com/in/ozlemcikoca/", description: "Director of Business Development" },
        { title: "Y Podin", linkedinUrl: "https://www.linkedin.com/in/ypodin/", description: "Chief Revenue Officer at StartupX" },
        { title: "Ashley Chou", linkedinUrl: "https://www.linkedin.com/in/ashleymchou/", description: "Head of Global Sales Operations" },
        { title: "Jamie Saunders", linkedinUrl: "https://www.linkedin.com/in/jamiensaunders/", description: "Senior Sales Director at MegaCorp" },
      ]
    },
  ]

  const handleKnowMore = (person: Task) => {
    setSelectedPerson(person)
    setOpenSheet(true)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Job Application Kanban</h1>
        </div>
        <Button variant="outline" className="bg-white text-black hover:bg-gray-100">
          <PlusIcon className="mr-2 h-4 w-4" /> New Application
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.name} className="space-y-4">
            <div className={`px-4 py-2 rounded-lg flex justify-between items-center ${column.color} border-2`}>
              <span className="font-semibold">{column.name}</span>
            </div>
            <div className="space-y-3">
              {column.tasks.map((task: Task, index) => (
                <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-black">{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-gray-500 mb-3">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {'logo' in task ? (
                          <img src={task.logo} alt={task.title} className="h-10 w-10 rounded" />
                        ) : (
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://i.pravatar.cc/40?img=${index}`} alt={task.title} />
                            <AvatarFallback>{task.title.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {'linkedinUrl' in task && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#0077B5] hover:bg-[#0077B5] hover:text-white"
                            onClick={() => window.open(task.linkedinUrl, '_blank')}
                          >
                            <Linkedin className="h-4 w-4 mr-1" />
                            Connect
                          </Button>
                        )}
                        {!('logo' in task) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => handleKnowMore(task)}
                          >
                            Know More
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedPerson?.title}</SheetTitle>
            <SheetDescription>{selectedPerson?.description}</SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Previous Jobs</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Senior Recruiter at TechGiant Inc.</li>
              <li>Talent Acquisition Specialist at InnovaCorp</li>
            </ul>
            <h3 className="font-semibold mb-2">Interests</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>AI in Recruitment</li>
              <li>Diversity and Inclusion</li>
              <li>Talent Development</li>
            </ul>
            <h3 className="font-semibold mb-2">Hobbies</h3>
            <ul className="list-disc pl-5">
              <li>Yoga</li>
              <li>Travel Photography</li>
              <li>Cooking International Cuisines</li>
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}