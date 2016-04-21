/// <reference path="../../../node_modules/inversify/type_definitions/inversify/inversify.d.ts" />
/// <reference path="../../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
"use strict";

import "reflect-metadata";
import { Queryable, QueryableInstance } from "./Queryable";
import { Web } from "./webs";
import { Dictionary } from "../../collections/collections";
import { injectable, inject } from "inversify";

export interface Parser {
    (r: Response): Promise<any>;
}

export interface SiteInterface {
    rootWeb: Web;
    _query: Dictionary<string>;
    _url: string;
    _parentUrl: string;
    query: Dictionary<string>;
    parentUrl: string;
    get(): Promise<any>;
    select(...selects: string[]): Site;
    concat(pathPart: string);
    post(postOptions?: {}, parser?: Parser): Promise<any>;
    defaultParser(r: Response): Promise<any>;
    append(pathPart: string);
    toUrl(): string;
    toUrlAndQuery(): string;
}


export interface SiteFactoryInterface {
    create(baseUrl: string, path?: string): SiteInterface;
}

@injectable()
export class SiteFactory implements SiteFactoryInterface {
    public create(baseUrl: string, path?: string): SiteInterface {
        return new Site(new SiteFactory(), baseUrl);
    }
}

/**
 * Describes a site collection
 *
 */
export class Site extends QueryableInstance {
    private siteFactory: SiteFactory;
    /**
     * Creates a new instance of the RoleAssignments class
     *
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(@inject("SiteFactory") siteFactory: SiteFactory, baseUrl: string, path?: string) {
        super(baseUrl, path);
        this.siteFactory = siteFactory;
    }

    /**
     * Gets the root web of the site collection
     *
     */
    public get rootWeb(): Web {
        return new Web(this, "rootweb");
    }

    /**
     * Gets the context information for the site.
     */
    public getContextInfo(): Promise<any> {
        let q = this.siteFactory.create("_api/contextinfo");
        return q.post();
    }

    /**
     * Gets the document libraries on a site. Static method. (SharePoint Online only)
     *
     * @param absoluteWebUrl The absolute url of the web whose document libraries should be returned
     */
    public getDocumentLibraries(absoluteWebUrl: string): Promise<any> {
        let q = new Queryable("_api/sp.web.getdocumentlibraries(@v)");
        q.query.add("@v", "'" + absoluteWebUrl + "'");
        return q.get();
    }

    /**
     * Gets the site URL from a page URL.
     *
     * @param absolutePageUrl The absolute url of the page
     */
    public getWebUrlFromPageUrl (absolutePageUrl: string): Promise<string> {
        let q = new Queryable("_api/sp.web.getweburlfrompageurl(@v)");
        q.query.add("@v", "'" + absolutePageUrl + "'");
        return q.get();
    }
     /* Execute the get request
     *
     */
    public get(): Promise<any> { return; }

    /**
     * Select the fields to return
     *
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): Site { return; }
}
