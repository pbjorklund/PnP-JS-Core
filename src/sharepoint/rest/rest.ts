/// <reference path="../../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
"use strict";

import "reflect-metadata";
import { SiteFactoryInterface, SiteInterface } from "./site";
import { Web } from "./webs";
import * as Util from "../../utils/util";
import { Queryable } from "./queryable";
import { inject } from "inversify";

/**
 * Root of the SharePoint REST module
 */

export class Rest {
    private siteFactory: SiteFactoryInterface;
    /**
     *
     */
    constructor(@inject("SiteFactoryInterface") siteFactory: SiteFactoryInterface) {
        this.siteFactory = siteFactory;
    }
    /**
     * Begins a site collection scoped REST request
     *
     * @param url The base url for the request, optional if running in the context of a page
     */
    public get site(): SiteInterface {
        return this.siteFactory.create("_api", "site");
    }

    /**
     * Begins a web scoped REST request
     *
     * @param url The base url for the request, optional if running in the context of a page
     */
    public get web(): Web {
        return new Web("_api", "web");
    }

    /**
     * Begins a cross-domain, host site scoped REST request, for use in add-in webs
     *
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     */
    public crossDomainSite(addInWebUrl: string, hostWebUrl: string): SiteInterface {
        return this._cdImpl<SiteInterface>(this.siteFactory, addInWebUrl, hostWebUrl, "site");
    }

    /**
     * Begins a cross-domain, host web scoped REST request, for use in add-in webs
     *
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     */
    // TODO Make it factory
    // public crossDomainWeb(addInWebUrl: string, hostWebUrl: string): Web {
    //     return this._cdImpl<Web>(Web, addInWebUrl, hostWebUrl, "web");
    // }

    /**
     * Implements the creation of cross domain REST urls
     *
     * @param factory The constructor of the object to create Site | Web
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     * @param urlPart String part to append to the url "site" | "web"
     */
    private _cdImpl<T extends Queryable>(factory: { create (s: string): T }, addInWebUrl: string, hostWebUrl: string, urlPart: string): T {

        if (!Util.isUrlAbsolute(addInWebUrl)) {
            throw "The addInWebUrl parameter must be an absolute url.";
        }

        if (!Util.isUrlAbsolute(hostWebUrl)) {
            throw "The hostWebUrl parameter must be an absolute url.";
        }

        let url = Util.combinePaths(addInWebUrl, "_api/SP.AppContextSite(@target)", urlPart);

        let instance = factory.create(url);
        instance.query.add("@target", encodeURIComponent(hostWebUrl));
        return instance;
    }
}
