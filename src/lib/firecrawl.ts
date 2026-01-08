import Firecrawl from '@mendable/firecrawl-js';

export const firecrawl = new Firecrawl({ 
    apiKey: process.env.FIRECRWAL_API_KEY!
});