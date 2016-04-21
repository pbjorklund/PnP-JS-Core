/// <reference path="../node_modules/inversify/type_definitions/inversify/inversify.d.ts" />

import { Kernel, INewable } from "inversify";

import { Site, SiteInterface, SiteFactory, SiteFactoryInterface } from "./sharepoint/rest/site";
import { PnP, PnPInterface } from "./pnp";

let kernel = new Kernel();
kernel.bind<PnPInterface>("PnPInterface").to(PnP);
kernel.bind<SiteFactoryInterface>("SiteFactoryInterface").to(SiteFactory);
kernel.bind<INewable<SiteInterface>>("INewable<SiteInterface>").toConstructor<SiteInterface>(Site);

export default kernel;
