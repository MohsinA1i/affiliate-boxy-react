import RequestManager from '../request-manager';
import regex from './regex';

export interface ScraperOptions {
    proxy?: string,
}

export interface Site {
    hostname: string,
    image?: string,
    pages: { [key: string]: Page },
    links: { [key: string]: Link }
}

export interface Page {
    url: string,
    site: Site,
    links: { [key: string]: Link },
    error?: string
}

export interface Link {
    url: string,
    productID?: string,
    store: string,
    site: Site,
    pages: { [key: string]: Page },
    error?: string
}

export default class Scraper {
    public request;
    public proxy;

    constructor({ proxy }: ScraperOptions = {}) {
        this.request = new RequestManager({ 
            requestAPIURL: 'https://s9222iji3e.execute-api.us-east-1.amazonaws.com/Prod/'
        });
        this.proxy = proxy;
    }

    async scrapeSite(siteURL: string, stores: ('amazon' | 'ebay')[]) {
        const hostname = regex.getHostname(siteURL);
        const site: Site = { hostname: hostname, pages: {}, links: {} };

        let storeRegex: RegExp[] = [];
        if (stores.includes('amazon')) storeRegex = [...storeRegex, /amazon./, /amzn.to/];

        await this.scrapePage(`https://${hostname}/`, storeRegex, site);
        return site;
    }

    async scrapePage(
        pageURL: string,
        stores: RegExp[],
        site: Site,
    ) {
        const page: Page = { url: pageURL, site: site, links: {} }
        site.pages[pageURL] = page;

        try {
            const dom = await this.request.dom({ url: page.url, proxy: this.proxy });
            const promises = [];
            for (const linkElement of Array.from(dom.window.document.links)) {
                if (linkElement.hostname === site.hostname) {
                    const pageURL = `${linkElement.origin}${linkElement.pathname}`;
                    if (!site.pages[pageURL]) promises.push(this.scrapePage(pageURL, stores, site));
                } else promises.push(this.scrapeLink(linkElement, stores, page, site));
            }
            await Promise.allSettled(promises);
        } catch (error) { page.error = error.message }
    }

    async scrapeLink(
        linkElement: HTMLAnchorElement | HTMLAreaElement,
        stores: RegExp[],
        page: Page,
        site: Site,
    ) {
        const linkURL = `${linkElement.origin}${linkElement.pathname}`;

        let link = page.links[linkURL];
        if (link) return;

        link = site.links[linkURL];
        if (link) {
            page.links[linkURL] = link;
            link.pages[page.url] = page;
            return;
        }

        const match = stores.find((regex) => regex.exec(linkElement.host));
        if (match) {
            let linkURL = `${linkElement.origin}${linkElement.pathname}`;
            const link = this.saveLink(linkURL, page, site);
            try {
                const linkType = String(match).slice(1, -1);
                if (linkType === 'amazon.') {
                    link.store = linkElement.host;
                    link.productID = regex.getAmazonProductID(linkURL);
                } else if (linkType === 'amzn.to') {
                    const { url } = await this.request.get(linkURL, undefined, { proxy: this.proxy });
                    link.store = regex.getHostname(url);
                    link.productID = regex.getAmazonProductID(url);
                }
                if (!link.productID) throw new Error('Failed to find productID');
            } catch (error) {
                link.error = error.message;
            }
        }
    }

    saveLink(linkURL: string, page: Page, site: Site) {
        const link: Link = { url: linkURL, store: '', site: site, pages: {} };
        site.links[linkURL] = link;
        page.links[linkURL] = link;
        link.pages[page.url] = page;
        return link;
    }
}