export type Tab = 'explore' | 'love' | 'support'
export type LovePathway = 'sponsor' | 'commit' | 'idea' | 'community'

export interface ContactFields {
  name: string
  email: string
  social: string
  phone: string
  state: string
  city: string
}

export interface CreatorData {
  platforms: string[]
  wants: string[]        // explore: what they want to do
  participation: string[] // love: co-create / run a challenge / share an idea
  idea?: string
}

export interface BrandData {
  company: string
  description: string
  partnership: string
}

export interface SubmissionPayload {
  tab: Tab
  pathway: string
  contact: ContactFields
  data: Record<string, unknown>
  is_creator: boolean
  creator_data?: CreatorData & ContactFields
  is_brand: boolean
  brand_data?: BrandData & ContactFields
}
