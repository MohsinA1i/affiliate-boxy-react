class Regex {
    getHostname(url: string) {
        const match = /(?:https?:\/\/)?([^/]+)/.exec(url);
        if (match) return match[1];
        return '';
    }

    getDomain(url: string) {
        const match = /(?:https?:\/\/)?(?:www\.)?([^/]+)/.exec(url);
        if (match) return match[1];
        return '';
    }

    getEndpoint(url: string) {
        let match = /(?<!https:\/)(?<!http:\/)\/([^/?]+)(?:\?|$)/.exec(url);
        if (match) return match[1];
        return '';
    }

    getAmazonProductID(url: string) {
        let match = /(?<=\/dp\/)\w+/.exec(url);
        if (match) return match[0];
    }
}

export default new Regex();