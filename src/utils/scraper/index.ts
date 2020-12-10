import RequestManager from './request-manager';
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
        this.request = new RequestManager({ requestAPIURL: 'https://s9222iji3e.execute-api.us-east-1.amazonaws.com/Prod/request/' });
        this.proxy = proxy;
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
        } catch(error) { page.error = error.message }
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

        const linkHostname = linkElement.hostname;
        if (stores.includes('amazon')) {
            const index = [/amazon./, /amzn.to/].findIndex((regex) => regex.exec(linkHostname));
            if (index > 0) {
                let linkURL = `${linkElement.origin}${linkElement.pathname}`;
                const link = this.saveLink(linkURL, 'amazon', page, site);
                try {
                    let productID;
                    if (index === 1) {
                        const { url } = await this.request.get(linkURL, undefined, { proxy: this.proxy });
                        productID = regex.getAmazonProductID(url);
                    } else productID = regex.getAmazonProductID(linkURL);

                    if (productID) link.productID = productID;
                    else throw new Error('No productID in link');
                } catch (error) {
                    link.error = error.message;
                }  
            }
        }
    }

    saveLink(linkURL: string, store: Store, page: Page, site: Site) {
        const link: Link = {url: linkURL, store: store, site: site, pages: {}};
        site.links[linkURL] = link;
        page.links[linkURL] = link;
        link.pages[page.url] = page;
        return link;
    }
}