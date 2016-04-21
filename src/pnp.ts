/// <reference path="../node_modules/inversify/type_definitions/inversify/inversify.d.ts" />
/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
"use strict";

import * as Util from "./utils/Util";
import { SharePoint } from "./SharePoint/SharePoint";
import { PnPClientStorage } from "./utils/Storage";
import * as Configuration from "./configuration/configuration";
import { Logger } from "./utils/logging";
import { SiteInterface } from "./sharepoint/rest/site";
import kernel from "./inversify.config";
import "reflect-metadata";

/**
 * Root class of the Patterns and Practices namespace, provides an entry point to the library
 */
class PnP {
    /**
     * Utility methods
     */
    public util = Util;

    /**
     * SharePoint
     */

    public sharepoint = new SharePoint(this.site);

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

    private site: SiteInterface;
    /**
     *
     */
    constructor() {
        this.site = kernel.get<SiteInterface>("SiteInterface");
        this.sharepoint = new SharePoint(this.site);
    }
}

export = PnP;
