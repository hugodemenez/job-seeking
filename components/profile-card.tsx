import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, Linkedin } from "lucide-react"

interface ProfileProps {
  name: string
  email: string
  role: "Recruiter" | "Hiring Manager"
  linkedinUrl?: string
}

function ProfileCard({ name, email, role, linkedinUrl }: ProfileProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${initials}`} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-lg">{name}</CardTitle>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${email}`} className="text-sm text-primary hover:underline">
            {email}
          </a>
        </div>
        {linkedinUrl && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.open(linkedinUrl, '_blank')}
          >
            <Linkedin className="h-4 w-4 mr-2" />
            Connect on LinkedIn
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

interface JobOfferProfilesProps {
  jobOffer: {
    recruiter?: {
      name: string
      email: string
      linkedinUrl?: string
    }
    hiringManager?: {
      name: string
      email: string
      linkedinUrl?: string
    }
  }
}

export default function JobOfferProfiles({ jobOffer }: JobOfferProfilesProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {jobOffer.recruiter && (
        <ProfileCard
          name={jobOffer.recruiter.name}
          email={jobOffer.recruiter.email}
          role="Recruiter"
          linkedinUrl={jobOffer.recruiter.linkedinUrl}
        />
      )}
      {jobOffer.hiringManager && (
        <ProfileCard
          name={jobOffer.hiringManager.name}
          email={jobOffer.hiringManager.email}
          role="Hiring Manager"
          linkedinUrl={jobOffer.hiringManager.linkedinUrl}
        />
      )}
    </div>
  )
}