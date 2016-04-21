/// <reference path="../node_modules/inversify/type_definitions/inversify/inversify.d.ts" />
/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
"use strict";

import * as Util from "./utils/Util";
import { SharePoint } from "./SharePoint/SharePoint";
import { PnPClientStorage } from "./utils/Storage";
import * as Configuration from "./configuration/configuration";
import { Logger } from "./utils/logging";
import { SiteInterface, SiteFactoryInterface } from "./sharepoint/rest/site";
import { inject, injectable } from "inversify";

export interface PnPInterface {
    util: any;
    sharepoint: SharePoint;
    storage: PnPClientStorage;
    configuration: any;
    logging: Logger;
    site: SiteInterface;
}
/**
 * Root class of the Patterns and Practices namespace, provides an entry point to the library
 */
@injectable()
export class PnP {
    /**
     * Utility methods
     */
    public util = Util;

    /**
     * SharePoint
     */
    public siteFactory;

    public sharepoint;

    /**
     * Provides access to local and session storage through
     */
    public storage: PnPClientStorage = new PnPClientStorage();

    /**
     * Configuration
     */
    public configuration = Configuration;

    /**
     * Global logging instance to which subscribers can be registered and messages written
     */
    public logging = new Logger();

    public site: SiteInterface;
    /**
     *
     */
    constructor(@inject("SiteFactoryInterface") siteFactory: SiteFactoryInterface) {
        this.sharepoint = new SharePoint(siteFactory);
    }
}
