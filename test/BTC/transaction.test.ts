import { expect } from "chai";
import { BtcTransaction, MCC, toBN, traceManager, TransactionSuccessStatus, UtxoMccCreate, UtxoTransaction } from "../../src";
import { transactionTestCases } from "../testUtils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chai = require("chai");
// eslint-disable-next-line @typescript-eslint/no-var-requires
chai.use(require("chai-as-promised"));

const BtcMccConnection = {
   url: process.env.BTC_URL || "",
   username: process.env.BTC_USERNAME || "",
   password: process.env.BTC_PASSWORD || "",
   apiTokenKey: process.env.FLARE_API_PORTAL_KEY || "",
} as UtxoMccCreate;

describe("Transaction Btc base test ", function () {
   let MccClient: MCC.BTC;

   before(async function () {
      traceManager.displayStateOnException = false;
      MccClient = new MCC.BTC(BtcMccConnection);
   });

   describe("Transaction does not exist ", function () {
      const txid = "8bae12b5f4c088d940733dcd1455efc6a3a69cf9340e17a981286d37786156ff";

      it("Should get Invalid Transaction error ", async function () {
         await expect(MccClient.getTransaction(txid)).to.be.rejectedWith("InvalidTransaction");
      });
   });

   describe("Transaction full ", function () {
      const txid = "141479db9d6da30fafaf47e71ae6323cac57c391ea2f7f84754e0a70fea8e36a";
      let transaction: BtcTransaction;

      before(async () => {
         const fullTrans = await MccClient.getTransaction(txid);

         if (fullTrans) {
            transaction = new BtcTransaction(fullTrans.data);
            await transaction.makeFullPayment(MccClient);
         }
      });

      it("Should find transaction in block ", function () {
         expect(transaction).to.not.eq(undefined);
      });

      it("Should get transaction txid ", async function () {
         expect(transaction.txid).to.eq(txid);
      });

      it("Should get standardized txid ", async function () {
         expect(transaction.stdTxid).to.eq(txid);
      });

      it("Should get transaction hash ", async function () {
         expect(transaction.hash).to.eq("f3180575f7662b49ee6267c424d894b84f7d0ef72405c02b18677a683d4052af");
      });

      it("Should get transaction reference array ", async function () {
         expect(transaction.reference.length).to.eq(0);
      });

      it("Should get standardized transaction reference ", async function () {
         expect(transaction.stdPaymentReference).to.eq("0x0000000000000000000000000000000000000000000000000000000000000000");
      });

      it("Should get transaction timestamp ", async function () {
         expect(transaction.unixTimestamp).to.eq(1647613710);
      });

      it("Should get source address ", async function () {
         expect(transaction.sourceAddresses.length).to.eq(3);
         expect(transaction.sourceAddresses[0]).to.eq("bc1q38lr3a45xtlz8032sz8xwc72gs652wfcq046pzxtxx6c70nvpessnc8dyk");
      });

      it("Should get receiving address ", async function () {
         expect(transaction.receivingAddresses.length).to.eq(6);
         expect(transaction.receivingAddresses[0]).to.eq("19Vxz7mg6YSgQhVB96YvXFsES1e8aXewHp");
      });

      it("Should get fee ", async function () {
         expect(transaction.fee.toNumber()).to.eq(43300);
      });

      it("Should spend amount ", async function () {
         expect(transaction.spentAmounts.length).to.eq(3);
         expect(transaction.spentAmounts[0].address).to.eq("bc1q38lr3a45xtlz8032sz8xwc72gs652wfcq046pzxtxx6c70nvpessnc8dyk");
         expect(transaction.spentAmounts[0].amount.toNumber()).to.eq(7424891554);
      });

      it("Should received amount ", async function () {
         expect(transaction.receivedAmounts.length).to.eq(6);
         expect(transaction.receivedAmounts[0].address).to.eq("19Vxz7mg6YSgQhVB96YvXFsES1e8aXewHp");
         expect(transaction.receivedAmounts[0].amount.toNumber()).to.eq(237272503);
      });

      it("Should get type ", async function () {
         expect(transaction.type).to.eq("full_payment");
      });

      it("Should check if native payment ", async function () {
         expect(transaction.isNativePayment).to.eq(true);
      });

      it("Should get currency name ", async function () {
         expect(transaction.currencyName).to.eq("BTC");
      });

      it("Should get elementary unit ", async function () {
         expect(transaction.elementaryUnits.toNumber()).to.eq(100000000);
      });

      it("Should get success status ", async function () {
         expect(transaction.successStatus).to.eq(0);
      });

      it("Should reject assets", async function () {
         expect(() => transaction.assetSourceAddresses).to.throw("InvalidResponse");
         expect(() => transaction.assetReceivingAddresses).to.throw("InvalidResponse");
         expect(() => transaction.assetSpentAmounts).to.throw("InvalidResponse");
         expect(() => transaction.assetReceivedAmounts).to.throw("InvalidResponse");
      });
   });

   describe("Transaction makeFull ", function () {
      const txid = "141479db9d6da30fafaf47e71ae6323cac57c391ea2f7f84754e0a70fea8e36a";
      let transaction: BtcTransaction;

      before(async () => {
         const fullTrans = await MccClient.getTransaction(txid);

         if (fullTrans) {
            transaction = new BtcTransaction(fullTrans.data);
            await transaction.makeFull(MccClient);
         }
      });

      it("Should find transaction in block ", function () {
         expect(transaction).to.not.eq(undefined);
      });

      it("Should get transaction txid ", async function () {
         expect(transaction.txid).to.eq(txid);
      });

      it("Should get standardized txid ", async function () {
         expect(transaction.stdTxid).to.eq(txid);
      });

      it("Should get transaction hash ", async function () {
         expect(transaction.hash).to.eq("f3180575f7662b49ee6267c424d894b84f7d0ef72405c02b18677a683d4052af");
      });

      it("Should get transaction reference array ", async function () {
         expect(transaction.reference.length).to.eq(0);
      });

      it("Should get standardized transaction reference ", async function () {
         expect(transaction.stdPaymentReference).to.eq("0x0000000000000000000000000000000000000000000000000000000000000000");
      });

      it("Should get transaction timestamp ", async function () {
         expect(transaction.unixTimestamp).to.eq(1647613710);
      });

      it("Should get source address ", async function () {
         expect(transaction.sourceAddresses.length).to.eq(3);
         expect(transaction.sourceAddresses[0]).to.eq("bc1q38lr3a45xtlz8032sz8xwc72gs652wfcq046pzxtxx6c70nvpessnc8dyk");
      });

      it("Should get receiving address ", async function () {
         expect(transaction.receivingAddresses.length).to.eq(6);
         expect(transaction.receivingAddresses[0]).to.eq("19Vxz7mg6YSgQhVB96YvXFsES1e8aXewHp");
      });

      it("Should get fee ", async function () {
         expect(transaction.fee.toNumber()).to.eq(43300);
      });

      it("Should spend amount ", async function () {
         expect(transaction.spentAmounts.length).to.eq(3);
         expect(transaction.spentAmounts[0].address).to.eq("bc1q38lr3a45xtlz8032sz8xwc72gs652wfcq046pzxtxx6c70nvpessnc8dyk");
         expect(transaction.spentAmounts[0].amount.toNumber()).to.eq(7424891554);
      });

      it("Should received amount ", async function () {
         expect(transaction.receivedAmounts.length).to.eq(6);
         expect(transaction.receivedAmounts[0].address).to.eq("19Vxz7mg6YSgQhVB96YvXFsES1e8aXewHp");
         expect(transaction.receivedAmounts[0].amount.toNumber()).to.eq(237272503);
      });

      it("Should get type ", async function () {
         expect(transaction.type).to.eq("full_payment");
      });

      it("Should check if native payment ", async function () {
         expect(transaction.isNativePayment).to.eq(true);
      });

      it("Should get currency name ", async function () {
         expect(transaction.currencyName).to.eq("BTC");
      });

      it("Should get elementary unit ", async function () {
         expect(transaction.elementaryUnits.toNumber()).to.eq(100000000);
      });

      it("Should get success status ", async function () {
         expect(transaction.successStatus).to.eq(0);
      });

      it("Should reject assets", async function () {
         expect(() => transaction.assetSourceAddresses).to.throw("InvalidResponse");
         expect(() => transaction.assetReceivingAddresses).to.throw("InvalidResponse");
         expect(() => transaction.assetSpentAmounts).to.throw("InvalidResponse");
         expect(() => transaction.assetReceivedAmounts).to.throw("InvalidResponse");
      });
   });

   const TransactionsToTest: transactionTestCases[] = [
      {
         description: "Transaction with one reference",
         txid: "8bae12b5f4c088d940733dcd1455efc6a3a69cf9340e17a981286d3778615684",
         expect: {
            txid: "8bae12b5f4c088d940733dcd1455efc6a3a69cf9340e17a981286d3778615684",
            stdTxid: "8bae12b5f4c088d940733dcd1455efc6a3a69cf9340e17a981286d3778615684",
            hash: "8bae12b5f4c088d940733dcd1455efc6a3a69cf9340e17a981286d3778615684",
            reference: ["636861726c6579206c6f766573206865696469"],
            stdPaymentReference: "0x0000000000000000000000000000000000000000000000000000000000000000",
            unixTimestamp: 1404107109,
            sourceAddresses: [undefined],
            receivingAddresses: ["1HnhWpkMHMjgt167kvgcPyurMmsCQ2WPgg", undefined],
            isFeeError: true,
            fee: "InvalidResponse", // number as a string
            spentAmounts: [
               {
                  address: undefined,
                  amount: toBN(0),
               },
            ],
            receivedAmounts: [
               {
                  address: undefined,
                  amount: toBN(0),
               },
               {
                  address: "1HnhWpkMHMjgt167kvgcPyurMmsCQ2WPgg",
                  amount: toBN(200000),
               },
            ],
            type: "payment",
            isNativePayment: true,
            currencyName: "BTC",
            elementaryUnits: "100000000", // number as string
            successStatus: TransactionSuccessStatus.SUCCESS,
         },
         summary: {
            isNativePayment: true,
            sourceAddress: "1HnhWpkMHMjgt167kvgcPyurMmsCQ2WPgg",
            receivingAddress: undefined,
            spentAmount: toBN(20000),
            receivedAmount: toBN(0),
            paymentReference: "0x0000000000000000000000000000000000000000000000000000000000000000",
            oneToOne: false,
            isFull: true,
         },
      },
      {
         description: "Transaction with multiple vins",
         txid: "16920c5619b4c43fd5c9c0fc594153f2bf1a80c930238a8ee870aece0bc7cc59",
         expect: {
            txid: "16920c5619b4c43fd5c9c0fc594153f2bf1a80c930238a8ee870aece0bc7cc59",
            stdTxid: "16920c5619b4c43fd5c9c0fc594153f2bf1a80c930238a8ee870aece0bc7cc59",
            hash: "dda6777e407602bcec51963278b071a95a3a3f382fb73429ab203769d658da08",
            reference: [],
            stdPaymentReference: "0x0000000000000000000000000000000000000000000000000000000000000000",
            unixTimestamp: 1647547988,
            sourceAddresses: [undefined, undefined, undefined],
            receivingAddresses: ["bc1q7ydxwryw7u6xkkzhlddugv8hyzsd6u6c8zr7rc", "14PbdXD3gRMnrrsP4CnS66fYKHSb1aawea"],
            isFeeError: true,
            fee: "InvalidResponse", // number as a string
            spentAmounts: [
               {
                  address: undefined,
                  amount: toBN(0),
               },
               {
                  address: undefined,
                  amount: toBN(0),
               },
               {
                  address: undefined,
                  amount: toBN(0),
               },
            ],
            receivedAmounts: [
               {
                  address: "bc1q7ydxwryw7u6xkkzhlddugv8hyzsd6u6c8zr7rc",
                  amount: toBN(2259),
               },
               {
                  address: "14PbdXD3gRMnrrsP4CnS66fYKHSb1aawea",
                  amount: toBN(12240),
               },
            ],
            type: "payment",
            isNativePayment: true,
            currencyName: "BTC",
            elementaryUnits: "100000000", // number as string
            successStatus: TransactionSuccessStatus.SUCCESS,
         },
         summary: {
            isNativePayment: true,
            sourceAddress: "bc1qtwha4x2kcm6z05z4hn88atye3wq7aatrljrjly",
            receivingAddress: "bc1q7ydxwryw7u6xkkzhlddugv8hyzsd6u6c8zr7rc",
            spentAmount: toBN(3533),
            receivedAmount: toBN(-4405),
            paymentReference: "0x0000000000000000000000000000000000000000000000000000000000000000",
            oneToOne: false,
            isFull: true,
         },
      },
      {
         description: "Coinbase transaction with more reference",
         txid: "fbf351cd9f1a561be21e3977282e931c5209ed6b90472e225b4a674dbc643511",
         expect: {
            txid: "fbf351cd9f1a561be21e3977282e931c5209ed6b90472e225b4a674dbc643511",
            stdTxid: "fbf351cd9f1a561be21e3977282e931c5209ed6b90472e225b4a674dbc643511",
            hash: "0d7d19de1dff1bb5873d1cb790cb4087d5e3ba7607e001d4d5870b1e87872dc4",
            reference: [
               "aa21a9ed7e2e11c040dbddce689e9a075f91f0bfa408cf3dadc229a0993ded3b4a9423e2",
               "b9e11b6deaba71a095ba7fa47426cabe0b340a393b6eeecce598af3020a413ec1d7116e7",
               "52534b424c4f434b3ab51f35a72153280cffb0721d9196f11c4830ebf63866e84ce24fae2c003e4e48",
            ],
            stdPaymentReference: "0x0000000000000000000000000000000000000000000000000000000000000000",
            unixTimestamp: 1644814708,
            sourceAddresses: [undefined],
            receivingAddresses: ["1JvXhnHCi6XqcanvrZJ5s2Qiv4tsmm2UMy", undefined, undefined, undefined],
            isFeeError: false,
            fee: "0", // number as a string
            spentAmounts: [{ address: undefined, amount: toBN(0) }],
            receivedAmounts: [
               {
                  address: "1JvXhnHCi6XqcanvrZJ5s2Qiv4tsmm2UMy",
                  amount: toBN(632706642),
               },
               {
                  address: undefined,
                  amount: toBN(0),
               },
               {
                  address: undefined,
                  amount: toBN(0),
               },
               {
                  address: undefined,
                  amount: toBN(0),
               },
            ],
            type: "coinbase",
            isNativePayment: true,
            currencyName: "BTC",
            elementaryUnits: "100000000", // number as string
            successStatus: TransactionSuccessStatus.SUCCESS,
         },
         summary: {
            isNativePayment: true,
            sourceAddress: undefined,
            receivingAddress: "1JvXhnHCi6XqcanvrZJ5s2Qiv4tsmm2UMy",
            spentAmount: toBN(0),
            receivedAmount: toBN(632706642),
            paymentReference: "0x0000000000000000000000000000000000000000000000000000000000000000",
            oneToOne: false,
            isFull: false,
         },
      },
   ];

   for (const transData of TransactionsToTest) {
      describe(transData.description, function () {
         let transaction: UtxoTransaction;
         before(async function () {
            const transactionb = await MccClient.getTransaction(transData.txid);
            if (transactionb !== null) {
               transaction = transactionb;
            }
         });

         it("Should find transaction in block ", function () {
            expect(transaction).to.not.eq(undefined);
         });

         it("Should get transaction txid ", async function () {
            expect(transaction.txid).to.eq(transData.expect.txid);
         });

         it("Should get standardized txid ", async function () {
            expect(transaction.stdTxid).to.eq(transData.expect.stdTxid);
         });

         it("Should get transaction hash ", async function () {
            expect(transaction.hash).to.eq(transData.expect.hash);
         });

         it("Should get transaction reference array ", async function () {
            expect(transaction.reference.length).to.eq(transData.expect.reference.length);
            const a = transaction.reference.sort();
            const b = transData.expect.reference.sort();
            for (let i = 0; i < a.length; i++) {
               expect(a[i]).to.eq(b[i]);
            }
         });

         it("Should get standardized transaction reference ", async function () {
            expect(transaction.stdPaymentReference).to.eq(transData.expect.stdPaymentReference);
         });

         it("Should get transaction timestamp ", async function () {
            expect(transaction.unixTimestamp).to.eq(transData.expect.unixTimestamp);
         });

         it("Should get source address ", async function () {
            expect(transaction.sourceAddresses.length).to.eq(transData.expect.sourceAddresses.length);
            const a = transaction.sourceAddresses.sort();
            const b = transData.expect.sourceAddresses.sort();
            for (let i = 0; i < a.length; i++) {
               expect(a[i]).to.eq(b[i]);
            }
         });

         it("Should get receiving address ", async function () {
            expect(transaction.receivingAddresses.length).to.eq(transData.expect.receivingAddresses.length);
            const a = transaction.receivingAddresses.sort();
            const b = transData.expect.receivingAddresses.sort();
            for (let i = 0; i < a.length; i++) {
               expect(a[i]).to.eq(b[i]);
            }
         });

         it("Should get fee ", async function () {
            if (transData.expect.isFeeError) {
               expect(function () {
                  transaction.fee;
               }).to.throw(transData.expect.fee);
            } else {
               expect(transaction.fee.toString()).to.eq(transData.expect.fee);
            }
         });

         it("Should spend amount ", async function () {
            expect(transaction.spentAmounts.length).to.eq(transData.expect.spentAmounts.length);
            const a = transaction.spentAmounts.sort();
            const b = transData.expect.spentAmounts.sort();
            for (let i = 0; i < a.length; i++) {
               expect(a[i].address).to.eq(b[i].address);
               expect(a[i].amount.toString()).to.eq(b[i].amount.toString());
            }
         });

         it("Should received amount ", async function () {
            expect(transaction.receivedAmounts.length).to.eq(transData.expect.receivedAmounts.length);
            const a = transaction.receivedAmounts.sort();
            const b = transData.expect.receivedAmounts.sort();
            for (let i = 0; i < a.length; i++) {
               expect(a[i].address).to.eq(b[i].address);
               expect(a[i].amount.toString()).to.eq(b[i].amount.toString());
            }
         });

         it("Should get type ", async function () {
            expect(transaction.type).to.eq(transData.expect.type);
         });

         it("Should check if native payment ", async function () {
            expect(transaction.isNativePayment).to.eq(transData.expect.isNativePayment);
         });

         it("Should get currency name ", async function () {
            expect(transaction.currencyName).to.eq(transData.expect.currencyName);
         });

         it("Should get elementary unit ", async function () {
            expect(transaction.elementaryUnits.toString()).to.eq(transData.expect.elementaryUnits);
         });

         it("Should get success status ", async function () {
            expect(transaction.successStatus).to.eq(transData.expect.successStatus);
         });

         it("Should get payment summary", async function () {
            const summary = await transaction.paymentSummary(MccClient, 0, 0, true);

            if (transData.expect.isNativePayment) {
               expect(summary.isNativePayment).to.eq(transData.summary?.isNativePayment);
               expect(summary.sourceAddress).to.eq(transData.summary?.sourceAddress);
               expect(summary.receivingAddress).to.eq(transData.summary?.receivingAddress);
               expect(summary.spentAmount?.toString()).to.eq(transData.summary?.spentAmount?.toString());
               expect(summary.receivedAmount?.toString()).to.eq(transData.summary?.receivedAmount?.toString());
               expect(summary.paymentReference).to.eq(transData.summary?.paymentReference);
               expect(summary.oneToOne).to.eq(transData.summary?.oneToOne);
               expect(summary.isFull).to.eq(transData.summary?.isFull);
            } else {
               expect(summary.isNativePayment).to.eq(transData.summary?.isNativePayment);
            }
         });

         it("Should get payment summary 2", async function () {
            const summary = await transaction.paymentSummary(MccClient);
            expect(summary.isNativePayment).to.be.true;
            expect(summary.sourceAddress).to.be.undefined;
            expect(summary.receivingAddress).to.be.undefined;
            expect(summary.spentAmount?.toNumber()).to.eq(0);
            expect(summary.receivedAmount?.toNumber()).to.eq(0);
         });
      });
   }

   describe("Transactions vin and vout indexes ", async function () {
      const txid = "141479db9d6da30fafaf47e71ae6323cac57c391ea2f7f84754e0a70fea8e36a";
      let transaction: BtcTransaction;
      before(async () => {
         transaction = await MccClient.getTransaction(txid);
      });
      it("Should get vin index invalid ", async function () {
         const fn = () => {
            return transaction.assertValidVinIndex(-2);
         };
         expect(fn).to.throw(Error);
      });
      it("Should get vout index invalid ", async function () {
         const fn = () => {
            return transaction.assertValidVoutIndex(-2);
         };
         expect(fn).to.throw(Error);
      });

      it("Should get synced vin index ", async function () {
         expect(transaction.isSyncedVinIndex(0)).to.be.false;
      });

      it("Should get partial_payment type ", async function () {
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         transaction.additionalData!.vinouts = [
            { index: -1, vinvout: { value: 1, n: 300, scriptPubKey: { asm: "", hex: "", type: "" } } },
            { index: -1, vinvout: undefined },
            undefined,
         ];
         expect(transaction.type).to.eq("partial_payment");
      });

      it("Should not extract vout ", async function () {
         transaction.data.vout[0].n = 10;
         const fn0 = () => {
            return transaction.extractVoutAt(0);
         };
         expect(fn0).to.throw(Error);
      });

      it("Should not assert additional data and synchronize additional data ", async function () {
         const fn0 = () => {
            return transaction.assertAdditionalData();
         };
         expect(fn0).to.throw(Error);
         const fn00 = () => {
            return transaction.synchronizeAdditionalData();
         };
         expect(fn00).to.throw(Error);

         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         transaction.additionalData!.vinouts = [undefined, { index: Number.MAX_SAFE_INTEGER, vinvout: undefined }, { index: -1, vinvout: undefined }];
         const fn01 = () => {
            return transaction.synchronizeAdditionalData();
         };
         expect(fn01).to.throw(Error);

         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         transaction.additionalData!.vinouts = [{ index: 0, vinvout: undefined }];
         transaction.synchronizeAdditionalData();
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         expect(transaction.additionalData!.vinouts[0]?.index).to.eq(0);

         transaction.data.vin.splice(-1);
         const fn1 = () => {
            return transaction.assertAdditionalData();
         };
         expect(fn1).to.throw(Error);
         delete transaction.additionalData?.vinouts;
         const fn2 = () => {
            return transaction.assertAdditionalData();
         };
         expect(fn2).to.throw(Error);
         delete transaction.additionalData;
         expect(transaction.assertAdditionalData()).to.be.undefined;
      });

      it("Should get the vout corresponding to vin", async function () {
         await expect(transaction.vinVoutAt(0)).to.be.rejected;
      });

      it("Should not extract vout ", async function () {
         delete transaction.additionalData?.vinouts;
         const fn0 = () => {
            return transaction.extractVoutAt(0);
         };
         expect(fn0).to.throw(Error);
      });
   });
});

// TODO special transactions

// https://www.blockchain.com/btc/tx/56214420a7c4dcc4832944298d169a75e93acf9721f00656b2ee0e4d194f9970
// https://www.blockchain.com/btc/tx/055f9c6dc094cf21fa224e1eb4a54ee3cc44ae9daa8aa47f98df5c73c48997f9
