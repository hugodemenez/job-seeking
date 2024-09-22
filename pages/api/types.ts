export interface JobOffer {
  id: string
  company: string
  position: string
  description: string
  postedDate: string
  recruiters: {
    name: string
    email: string
  }[]
  hiringManagers: {
    name: string
    email: string
  }[]
}