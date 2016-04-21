/// <reference path="../../node_modules/inversify/type_definitions/inversify/inversify.d.ts" />
/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
import "reflect-metadata";
"use strict";

import { Provisioning } from "./Provisioning/Provisioning";
import { Rest } from "./Rest/Rest";
import { SiteInterface } from "./rest/site";
import { injectable, inject } from "inversify";

export interface SharePointInterface {
    rest: Rest;
    provisioning: Provisioning;
}

@injectable()
export class SharePoint implements SharePointInterface {
    public rest: Rest;
    public provisioning: Provisioning;

    constructor(@inject("SiteInterface") site: SiteInterface) {
        this.rest = new Rest(site);
        this.provisioning = new Provisioning();
    }
}
