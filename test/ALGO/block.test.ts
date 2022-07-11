import { AlgoBlock, MCC, traceManager } from "../../src";
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

const algoCreateConfig = {
   algod: {
      url: process.env.ALGO_ALGOD_URL || "",
      token: process.env.ALGO_ALGOD_TOKEN || "",
   },
};

describe(`Algo block processing`, async () => {
   it("Should get top block", async function () {
      traceManager.displayStateOnException = false
      const MccClient = new MCC.ALGO(algoCreateConfig);
      const block = await MccClient.getBlock();

      expect(block).to.not.eq(undefined);
   });

   it("Should create block with msig", async function () {
      const MccClient = new MCC.ALGO(algoCreateConfig);
      const block = await MccClient.getBlock(21_659_776);
      block.data.block.txns[0].msig  = Buffer.from([0xad, 0x35, 0x08, 0xb8, 0xfa, 0x7e, 0x9c, 0x1d, 0x38, 0x43, 0x97, 0xb0, 0x70, 0x8a, 0xa1, 0x56, 0x7a, 0x74, 0xe7, 0x9e, 0xc9, 0xe3, 0x7c, 0xbd, 0x37, 0x0c, 0xe2, 0x27, 0x6b, 0xd8, 0x95, 0x98]);
      let aBlock = new AlgoBlock({ block: block.data.block, cert: block.data.cert });
      expect(aBlock).to.not.eq(undefined);
   });

   describe("Classic block test ", function () {
      let MccClient: MCC.ALGO;
      let block: AlgoBlock;
      const blockNumber = 21_659_776;

      before(async function () {
         MccClient = new MCC.ALGO(algoCreateConfig);
         block = await MccClient.getBlock(blockNumber);
      });

      it("Should get block", async function () {
         expect(block).to.not.eq(undefined);
      });

      it("Should get block number ", async function () {
         expect(block.number).to.eq(blockNumber);
      });

      it("Should get block hash ", async function () {
         expect(block.blockHash).to.eq("rWPGk6t3twBulPE4lt7Yt9IHpgeOsqU1IlGAGJ5B74g=");
      });

      it("Should get block hash base32 ", async function () {
         expect(block.blockHashBase32).to.eq("VVR4NE5LO63QA3UU6E4JNXWYW7JAPJQHR2ZKKNJCKGABRHSB56EA");
      });

      it("Should get block hash base64 ", async function () {
         expect(block.blockHashBase64).to.eq("rWPGk6t3twBulPE4lt7Yt9IHpgeOsqU1IlGAGJ5B74g=");
      });

      it("Should get block standard hash ", async function () {
         expect(block.stdBlockHash).to.eq("ad63c693ab77b7006e94f13896ded8b7d207a6078eb2a535225180189e41ef88");
      });

      it("Should get block timestamp ", async function () {
         expect(block.unixTimestamp).to.eq(1655413908);
      });

      it("Should get transaction ids ", async function () {
         expect(block.transactionIds.length).to.eq(69);
         expect(block.transactionIds).contains("FMOP2YDOU4GIDNV2GLAY3653IDUQAWJ7UTHO52FFYEPW74W3AD2Q");
         expect(block.transactionIds).contains("MGXTHGNBCVFLUNN4PIH37WYYZMLJ6DK7NMWHQEE472RI4MCK7WKA");
      });

      it("Should get transaction standard ids ", async function () {
         expect(block.stdTransactionIds.length).to.eq(69);
      });

      it("Should get transaction count ", async function () {
         expect(block.transactionCount).to.eq(69);
      });

      it("Should get transaction objects (ALGO SPECIFIC) ", async function () {
         expect(block.transactions.length).to.eq(69);
      });
   });
});
