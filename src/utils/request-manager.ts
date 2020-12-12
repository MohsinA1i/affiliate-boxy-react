//import { Auth } from 'aws-amplify';
import { JSDOM, ResourceLoader, VirtualConsole, ConstructorOptions } from 'jsdom';
import { CookieJar, Cookie } from 'tough-cookie';
import regex from './scraper/regex';

interface RequestManagerOptions {
    baseURL?: string,
    headers?: { [key: string]: string },
    userAgent?: string,
    requestAPIURL?: string,
}

interface RequestOptions {
    headers?: { [key: string]: string },
    proxy?: string,
}

interface DomRequestOptions {
    location?: string,
    url?: string,
    content?: string,
    runScripts?: 'outside-only' | 'dangerously',
    proxy?: string,
}

interface ProductRequestOptions {
    credentials: AmazonProductAPICredentials,
    productIDs: string[]
}

interface Response {
    body: string,
    headers: { [key: string]: string },
    ok: boolean,
    redirected: boolean,
    status: number,
    statusText: string,
    type: string,
    url: string,
}

export default class RequestManager {
    public headers;
    public userAgent;
    public baseURL;
    private requestAPIURL;
    private cookieJar: CookieJar;

    constructor({
        baseURL,
        headers = {},
        userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0',
        requestAPIURL = 'http://localhost:3000/',
    }: RequestManagerOptions = {}) {
        this.baseURL = baseURL;
        this.headers = headers;
        this.userAgent = userAgent;
        this.requestAPIURL = requestAPIURL;

        this.cookieJar = new CookieJar();
    }

    async get(url: string, query?: { [key: string]: any }, { headers, proxy }: RequestOptions = {}) {
        const fetchOptions: { [key: string]: any } = {
            url: this.fullURL(url),
            proxy: proxy,
            init: {
                method: 'GET',
                headers: headers,
            }
        };
        if (query) fetchOptions.url.search = new URLSearchParams(query);
        return await this.requestAPI('fetch', fetchOptions);
    }

    async post(url: string, body?: string, { headers, proxy }: RequestOptions = {}) {
        const fetchOptions: { [key: string]: any } = {
            url: this.fullURL(url),
            proxy: proxy,
            init: {
                method: 'POST',
                headers: headers,
                body: body,
            }
        };
        return await this.requestAPI('fetch', fetchOptions);
    }

    fullURL(url: string) {
        if (url.startsWith('/')) url = `https://${this.baseURL}${url}`;
        return new URL(url);
    }

    async requestAPI(endpoint: string, payload: { [key: string]: any }) {
        console.log(`${payload.init.method} Request ${payload.url}`);

        if (!payload.init) payload.init = {};
        if (!payload.init.headers) payload.init.headers = {};
        if (!payload.init.headers['user-agent']) payload.init.headers['user-agent'] = this.userAgent;
        payload.cookies = await this.cookieJar.serialize();

        try {
            //const authenticatedUser = await Auth.currentAuthenticatedUser();
            const APIResponse = await fetch(this.requestAPIURL + endpoint, {
                method: 'POST',
                mode: 'cors',
                //headers: { 'Authorization': authenticatedUser.signInUserSession.idToken.jwtToken },
                body: JSON.stringify(payload)
            });
            const requestResponse = JSON.parse(await APIResponse.text());

            if (APIResponse.ok) {
                const cookieHeader = requestResponse.headers['set-cookie'];
                if (cookieHeader) {
                    const cookies = [Cookie.parse(cookieHeader)];
                    for (const cookie of cookies) if (cookie) await this.cookieJar.setCookie(cookie, requestResponse.url);
                }
            }

            return requestResponse as Response;
        } catch (error) {
            error.message = error.message + ' ' + payload.url;
            console.log(error.message);
            throw error;
        }
    }

    async dom(options: DomRequestOptions) {
        const domOptions: ConstructorOptions = {
            resources: new ResourceLoader({
                proxy: options.proxy,
                strictSSL: false,
                userAgent: this.userAgent
            }),
            pretendToBeVisual: true,
            cookieJar: this.cookieJar
        };
        domOptions.virtualConsole = new VirtualConsole();
        domOptions.virtualConsole.sendTo(console, { omitJSDOMErrors: true });
        if (options.location) {
            if (options.location.startsWith('/'))
                options.location = `https://${this.baseURL}${options.location}`;
            domOptions.url = options.location;
            domOptions.referrer = options.location;
        }
        if (options.runScripts) {
            domOptions.runScripts = options.runScripts;
            domOptions.beforeParse = (window) => {
                window.matchMedia = this.matchMediaStub;
            }
        }
        if (options.url) {
            const response = await this.get(options.url);
            options.content = response.body;
        }
        return new JSDOM(options.content, domOptions);
    }

    matchMediaStub(): MediaQueryList {
        return {
            media: '',
            matches: false,
            addListener: function () { },
            removeListener: function () { },
            onchange: function () { },
            addEventListener: function () { },
            removeEventListener: function () { },
            dispatchEvent: () => false
        }
    }

    async getAmazonProduct(options: ProductRequestOptions) {
        const domain = regex.getDomain(options.credentials.marketplace)
        return await this.requestAPI('aws-signed-fetch', {
            url: {
                host: `webservices.${domain}`,
                path: '/paapi5/getitems',
                service: 'ProductAdvertisingAPIv1',
                region: this.getAmazonRegion(options.credentials.marketplace),
            },
            credentials: {
                accessKeyId: options.credentials.accessKey,
                secretAccessKey: options.credentials.secretKey,
            },
            init: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Content-Encoding': 'amz-1.0',
                    'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems',
                },
                body: JSON.stringify({
                    ItemIds: options.productIDs,
                    ItemIdType: 'ASIN',
                    Resources: [
                        'ItemInfo.Title'
                    ],
                    PartnerTag: options.credentials.partnerTag,
                    PartnerType: options.credentials.partnerType || 'Associates',
                    Marketplace: options.credentials.marketplace
                })
            }
        });
    }


    getAmazonRegion(store: string) {
        if (store.endsWith('.co.uk')) return 'eu-west-1';
        else return 'us-east-1';
    }
}