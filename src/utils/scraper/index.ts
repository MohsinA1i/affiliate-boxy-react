import RequestAPI, { LinkDetails, ScrapedLink } from '../request-api';
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
    private requestAPI;
    public proxy;

    constructor({ proxy }: ScraperOptions = {}) {
        this.requestAPI = new RequestAPI({
            //requestAPIURL: 'https://s9222iji3e.execute-api.us-east-1.amazonaws.com/Prod/'
        });
        this.proxy = proxy;
    }

    async scrapeSite(siteURL: string, stores: ('amazon' | 'ebay')[]) {
        const hostname = regex.getHostname(siteURL);

        const linkDetails = [{
            name: 'site',
            regex: `https://${hostname}`
        }];
        if (stores.includes('amazon')) {
            linkDetails.push({
                name: 'amazon',
                regex: 'amazon.'
            });
            linkDetails.push({
                name: 'amzn',
                regex: 'amzn.to'
            });
        }

        const site: Site = { hostname: hostname, pages: {}, links: {} };
        const page = this.createPage(`https://${hostname}/`, site);
        await this.requestResources([page], [], linkDetails);
        return site;
    }

    async requestResources(pages: Page[], links: Link[], linkDetails: LinkDetails[]) {
        const [ followRedirectResponse, scrapeLinksResponse ] = await Promise.allSettled([
            this.requestAPI.followRedirect({
                targets: links.map((link) => link.url),
                proxy: this.proxy
            }),
            this.requestAPI.scrapeLinks({
                targets: pages.map((page) => {
                    return { url: page.url, links: linkDetails }
                }),
                proxy: this.proxy
            })
        ]);
        
        if (followRedirectResponse.status === 'fulfilled') {
            for (const [index, redirectedURL] of followRedirectResponse.value.entries()) {
                const link = links[index];
                if (redirectedURL.error) {
                    link.error = redirectedURL.error;
                } else {
                    link.store = regex.getHostname(redirectedURL.url);
                    link.productID = regex.getAmazonProductID(redirectedURL.url);
                }
            }
        } else console.log(followRedirectResponse.reason);

        if (scrapeLinksResponse.status === 'fulfilled') {
            let newPages: Page[] = [];
            let newLinks: Link[] = [];
            for (const [index, scrapedPage] of scrapeLinksResponse.value.entries()) {
                const page = pages[index];
                if (scrapedPage.error) {
                    page.error = scrapedPage.error;
                } else {
                    const scrapedLinks = scrapedPage.links;
                    newPages = [...newPages, ...this.createPages(scrapedLinks, page.site)];
                    newLinks = [...newLinks, ...this.createLinks(scrapedLinks, page)];
                }
            }
            if (newPages.length > 0 || newLinks.length > 0)
                await this.requestResources(newPages, newLinks, linkDetails);
        } else console.log(scrapeLinksResponse.reason);
    }

    createPages(scrapedLinks: ScrapedLink[], site: Site) {
        const pages = [];
        for (const scrapedLink of scrapedLinks) {
            if (scrapedLink.type === 'site') {
                const page = site.pages[scrapedLink.url];
                if (!page) {
                    const page = this.createPage(scrapedLink.url, site);
                    pages.push(page);
                }
            }
        }
        return pages;
    }

    createLinks(scrapedLinks: ScrapedLink[], page: Page) {
        const links = [];
        for (const scrapedLink of scrapedLinks) {
            if (scrapedLink.type !== 'site') {
                const link = page.site.links[scrapedLink.url];
                if (!link) {
                    const link = this.createLink(scrapedLink.url, page);
                    if (scrapedLink.type === 'amazon') {
                        link.store = regex.getHostname(scrapedLink.url);
                        link.productID = regex.getAmazonProductID(scrapedLink.url);
                    } else if (scrapedLink.type === 'amzn') {
                        links.push(link);
                    }
                } else if (!page.links[scrapedLink.url]) {
                    page.links[scrapedLink.url] = link;
                    link.pages[page.url] = page;
                }
            }
        }
        return links;
    }

    createPage(pageURL: string, site: Site) {
        const page: Page = { url: pageURL, site: site, links: {} }
        site.pages[pageURL] = page;
        return page;
    }

    createLink(linkURL: string, page: Page) {
        const link: Link = { url: linkURL, store: '', site: page.site, pages: {} };
        page.site.links[linkURL] = link;
        page.links[linkURL] = link;
        link.pages[page.url] = page;
        return link;
    }
}