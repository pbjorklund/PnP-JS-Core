/// <reference path="../../../node_modules/inversify/type_definitions/inversify/inversify.d.ts" />
"use strict";

import { Queryable, QueryableInstance } from "./Queryable";
import { Web } from "./webs";
import { Dictionary } from "../../collections/collections";
import { injectable } from "inversify";

export interface SiteInterface {
    rootWeb: Web;
    _query: Dictionary<string>;
    _url: string;
    query: Dictionary<string>;
    get(): Promise<any>;
    select(...selects: string[]): Site;
    concat(pathPart: string);
    append(pathPart: string);
    toUrl(): string;
    toUrlAndQuery(): string;
}
/**
 * Describes a site collection
 *
 */
@injectable()
export class Site extends QueryableInstance {
    /**
     * Creates a new instance of the RoleAssignments class
     *
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string, path?: string) {
        super(baseUrl, path);
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
        let q = new Site("_api/contextinfo");
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
