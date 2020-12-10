import Request from './request';
import regex from './regex';

export interface ScraperOptions {
    proxy?: string,
}

type Store = 'amazon' | 'ebay';

export interface Site {
    hostname: string,
    image?: string,
    pages: { [key: string]: Page },
    links: { [key: string]: Link }
}

export interface Page {
    url: string,
    site: Site,
    links: { [key: string]: Link }
}

export interface Link {
    url: string,
    store: string,
    site: Site,
    pages: { [key: string]: Page }
}

export default class Scraper {
    public onError?: (error: Error) => any = (error) => { console.log(error) };
    public request;

    constructor({ proxy }: ScraperOptions = {}) {
        this.request = new Request({
            requestAPIURL: 'https://s9222iji3e.execute-api.us-east-1.amazonaws.com/Prod/request/',
            proxy: proxy
        });
    }

    async scrapeSite(siteURL: string, stores: Store[]) {
        const hostname = regex.getHostname(siteURL);
        const site: Site = { hostname: hostname, pages: {}, links: {} };
        await this.scrapePage(`https://${hostname}/`, stores, site);
        return site;
    }

    async scrapePage(
        pageURL: string,
        stores: Store[],
        site: Site,
    ) {
        const page: Page = { url: pageURL, site: site, links: {} }
        site.pages[pageURL] = page;

        const dom = await this.request.dom({ url: page.url });
        const promises = [];
        for (const linkElement of Array.from(dom.window.document.links)) {
            if (linkElement.hostname === site.hostname) {
                const pageURL = `${linkElement.origin}${linkElement.pathname}`;
                if (!site.pages[pageURL]) promises.push(this.scrapePage(pageURL, stores, site));
            } else promises.push(this.scrapeLink(linkElement, stores, page, site));
        }
        await Promise.allSettled(promises);
    }

    async scrapeLink(
        linkElement: HTMLAnchorElement | HTMLAreaElement,
        stores: Store[],
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

        if (stores.includes('amazon')) {
            const linkHostname = linkElement.hostname;
            if (/amazon./.exec(linkHostname)) {
                link = { url: `${linkElement.origin}${linkElement.pathname}`, store: 'amazon', site: site, pages: {} };
            } else if (/amzn.to/.exec(linkHostname)) {
                const { url } = await this.request.get(`${linkElement.origin}${linkElement.pathname}`);
                link = { url: url, store: 'amazon', site: site, pages: {} };
            }
        }

        if (link) {
            site.links[linkURL] = link;
            page.links[linkURL] = link;
            link.pages[page.url] = page;
        }
    }
}