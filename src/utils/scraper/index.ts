import Request from './request';
import regex from './regex';

export interface ScraperOptions {
    proxy?: string,
}

export interface Site {
    url: string,
    image?: string,
    pages: {[key: string]: Page},
    links: {[key: string]: Link}
}

export interface Page {
    url: string,
    site: Site,
    links: {[key: string]: Link}
}

export interface Link {
    url: string,
    store: string,
    site: Site,
    pages: {[key: string]: Page}
}

export default class Scraper {
    public onError?: (error: Error) => any = (error) => { console.log(error) };
    public request;

    constructor({ proxy }: ScraperOptions = {}) {
        this.request = new Request({
            requestAPIURL: 'https://uwx0k675d0.execute-api.us-east-1.amazonaws.com/Prod/request',
            proxy: proxy
        });
    }

    async scrapeSite(siteDomain: string, storeDomains: { [key: string]: string[] }) {
        siteDomain = regex.getHostname(siteDomain);
        const siteUrl = `https://${siteDomain}/`;
        const site: Site = { url: siteUrl, pages: {}, links: {} };
        const page: Page = { url: siteUrl, site: site, links: {} }
        site.pages[siteUrl] = page;
        return new Promise((resolve) => {
            const functionManager = new FunctionManager(this.scrapePage, this)
                .then(() => { resolve(site) })
                .catch((error) => { if (this.onError) this.onError(error) });
            functionManager.execute(page, siteDomain, storeDomains, site);
        });
    }

    async scrapePage(
        page: Page,
        siteDomain: string,
        storeDomains: { [key: string]: string[] },
        site: Site,
        functionManager: FunctionManager,
    ) {
        const dom = await this.dom(page.url);
        for (const anchorElement of Array.from(dom.window.document.links)) {
            if (anchorElement.hostname === siteDomain) {
                const pageURL = `${anchorElement.origin}${anchorElement.pathname}`;
                const page = site.pages[pageURL];
                if (!page) { //Page does not exist
                    //Add page to site
                    const page: Page = { url: pageURL, site: site, links: {} }
                    site.pages[pageURL] = page;
                    functionManager.execute(page, siteDomain, storeDomains, site);
                }
            } else {
                for (const storeName in storeDomains) {
                    for (const storeDomain of storeDomains[storeName]) {
                        if (anchorElement.hostname === storeDomain) {
                            const linkURL = `${anchorElement.origin}${anchorElement.pathname}`;
                            let link = site.links[linkURL];
                            if (!link) { //Link does not exist
                                link = { url: linkURL, store: storeName, site: site, pages: {} };
                                link.pages[page.url] = page;
                                //Add Link to site and page
                                site.links[linkURL] = link;
                                page.links[linkURL] = link;
                            } else { //Link exists in site
                                //Add link to page overwrite if exists
                                page.links[linkURL] = link;
                            }
                        }
                    }
                }
            }
        }
    }

    async dom(url: string) {
        try {
            return await this.request.dom({ url: url });
        } catch (error) {
            error.message = error.message + ' ' + url;
            throw error;
        }
    }
}

class FunctionManager {
    private handler: (...args: any[]) => any;
    private onComplete?: () => any;
    private onError?: (error: Error) => void;
    private count: number = 0;

    constructor(handler: (...args: any[]) => any, context?: object) {
        this.handler = context ? handler.bind(context) : handler;
        return this;
    }

    then(onComplete: (...args: any[]) => any) {
        this.onComplete = onComplete;
        return this;
    }

    catch(onError?: (error: Error) => void) {
        this.onError = onError;
        return this;
    }

    async execute(...args: any[]) {
        this.count++;
        args.push(this);
        try {
            await this.handler(...args);
        } catch (error) { if (this.onError) this.onError(error) }
        this.count--;
        if (this.onComplete && this.count === 0) this.onComplete();
    }
}