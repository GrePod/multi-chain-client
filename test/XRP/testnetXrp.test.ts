import { expect } from "chai";
import { MCC, traceManager } from "../../src";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chai = require("chai");
// eslint-disable-next-line @typescript-eslint/no-var-requires
chai.use(require("chai-as-promised"));

const XRPMccConnection = {
   url: process.env.XRP_URL || "",
   username: process.env.XRP_USERNAME || "",
   password: process.env.XRP_PASSWORD || "",
   apiTokenKey: process.env.FLARE_API_PORTAL_KEY || "",
};

describe("XRP testnet client tests", () => {
   let client: MCC.XRP;

   before(function () {
      traceManager.displayStateOnException = false;

      client = new MCC.XRP(XRPMccConnection);
   });

   describe("Should be able to get block height", async () => {
      it(`Should be able to get block height `, async () => {
         const height = await client.getBlockHeight();
         expect(height).to.be.greaterThan(70_000_000);
      });
   });

   describe("Basic functionalities", function () {
      it("Should return block if exists", async () => {
         const n = 69453782;
         const block = await client.getBlock(n);
         if (block) {
            expect(block.number).to.equal(n);
         }
      });

      it("Should return InvalidBlock if block does not exist", async () => {
         let n = 694537820;
         let block = client.getBlock(n);
         await expect(block).to.be.rejectedWith("InvalidBlock");
         n *= 100;
         block = client.getBlock(n);
         await expect(block).to.be.rejectedWith("InvalidBlock");
      });

      it("Should return transaction if exists", async () => {
         const txResponse = await client.getTransaction("0x0569969AFDAF91BFCFF709D49FE23DD5656335AFD0A3879C03C8EFADEF83A0C2");
         expect(txResponse).to.not.equal(null);
      });

      it("Should return null if transaction does not exist", async () => {
         const txResponse = client.getTransaction("0669969AFDAF91BFCFF709D49FE23DD5656335AFD0A3879C03C8EFADEF83A0C2");
         await expect(txResponse).to.be.rejectedWith("InvalidTransaction");
      });
   });
});
