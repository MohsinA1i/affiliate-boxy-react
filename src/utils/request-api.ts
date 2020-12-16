interface ScrapeLinksOptions {
    targets: {
        url: string,
        links: LinkDetails[]
    }[]
    proxy?: string
}

export interface LinkDetails {
    name: string,
    regex: string
}

interface ScrapeLinksResponse {
    url: string,
    links: ScrapedLink[],
    error?: string
}

export interface ScrapedLink {
    url: string
    type: string
}

interface FollowRedirectOptions {
    targets: string[],
    proxy?: string
}

interface FollowRedirectResponse {
    url: string,
    error?: string
}

interface AmazonProductOptions {
    credentials: AmazonProductAPICredentials,
    productIDs: string[]
}

interface AmazonProductResponse {

}

export default class RequestAPI {
    public requestAPIURL;

    constructor({ requestAPIURL = 'http://localhost:3000/' }) {
        this.requestAPIURL = requestAPIURL;
    }

    async scrapeLinks(options: ScrapeLinksOptions) {
        if (options.targets.length === 0) return [];
        return await this.request('scrape-links', options) as ScrapeLinksResponse[];
    }


    async followRedirect(options: FollowRedirectOptions) {
        if (options.targets.length === 0) return [];
        return await this.request('follow-redirect', options) as FollowRedirectResponse[];
    }

    async getAmazonProduct(options: AmazonProductOptions) {
        return await this.request('product-amazon', options) as AmazonProductResponse[];
    }

    async request(endpoint: string, options: any) {
        const APIResponse = await fetch(this.requestAPIURL + endpoint, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(options)
        });
        const requestResponse = JSON.parse(await APIResponse.text());
        return requestResponse;
    }
}