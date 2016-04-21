"use strict";

import { expect } from "chai";
import PnP = require("./pnp");

describe("PnP", () => {
    let pnp = new PnP();

    it("util should not be null", () => {
        expect(pnp.util).to.not.be.null;
    });

    it("sharepoint should not be null", () => {
        expect(pnp.sharepoint).to.not.be.null;
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
