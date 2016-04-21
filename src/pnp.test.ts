"use strict";

import kernel from "./inversify.config";
import { expect } from "chai";
import { PnPInterface } from "./pnp";

describe("PnP", () => {
    let pnp = kernel.get<PnPInterface>("PnPInterface");

    it("util should not be null", () => {
        expect(pnp.util).to.not.be.null;
    });

    it("sharepoint should not be null", () => {
        expect(pnp.sharepoint).to.not.be.null;

        expect(pnp.sharepoint.rest.site.toUrlAndQuery()).to.equal("_api");
    });

    it("storage should not be null", () => {
        expect(pnp.storage).to.not.be.null;
    });

    it("configuration should not be null", () => {
        expect(pnp.configuration).to.not.be.null;
    });

    it("logging should not be null", () => {
        expect(pnp.logging).to.not.be.null;
    });
});
