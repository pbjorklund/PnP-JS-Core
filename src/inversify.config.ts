/// <reference path="../node_modules/inversify/type_definitions/inversify/inversify.d.ts" />

import { Kernel } from "inversify";

import { Site, SiteInterface } from "./sharepoint/rest/site";

let kernel = new Kernel();
kernel.bind<SiteInterface>("SiteInterface").to(Site);

export default kernel;
