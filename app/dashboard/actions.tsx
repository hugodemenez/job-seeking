'use server'

interface AdzunaJobSearchResults {
  __CLASS__: string;
  results: AdzunaJob[];
}

export interface AdzunaJob {
  __CLASS__: string;
  id: string;
  title: string;
  description: string;
  created: string;
  salary_min: number;
  salary_max: number;
  salary_is_predicted: number;
  company: {
    __CLASS__: string;
    display_name: string;
  };
  category: {
    __CLASS__: string;
    label: string;
    tag: string;
  };
  location: {
    __CLASS__: string;
    area: string[];
    display_name: string;
  };
  latitude: number;
  longitude: number;
  redirect_url: string;
  contract_type: string;
}

export async function getJobOffers() {
    const offers = await fetch(`http://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${process.env.ADZUNA_API_ID}&app_key=${process.env.ADZUNA_API_KEY}&results_per_page=20&content-type=application/json`)
    const data = await offers.json() as AdzunaJobSearchResults
    return data.results
}