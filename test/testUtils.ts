import { expect } from "chai";
import { AddressAmount, PaymentSummary, unPrefix0x } from "../src";
import { IIUtxoVout, TransactionSuccessStatus } from "../src/types";
import { addressToHex, hexToBytes } from "../src/utils/algoUtils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expectThrow = async (method: any, errorMessage: any) => {
   let error = null;
   try {
      await method;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } catch (err: any) {
      error = err;
   }
   if (typeof errorMessage === "object") {
      // eslint-disable-next-line guard-for-in
      for (const prop in errorMessage) {
         expect(error).to.haveOwnProperty(prop);
         expect(error[prop]).to.eq(errorMessage[prop]);
      }
   } else {
      expect(error).to.equal(errorMessage);
   }
};

export function round_for_ltc(input: number) {
   return parseFloat(input.toFixed(8));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendMinimalUTXOTransaction(RPC: any, fromWalletLabel: string, from: string, to: string) {
   const unspent = await RPC.listUnspentTransactions(fromWalletLabel);
   const vin = [];
   const vinaddresses = [];
   let unspentAmount = 0;
   for (const utx of unspent) {
      console.log("ALL utxo", utx);

      if (utx.address == from) {
         console.log(utx);

         vin.push({
            txid: utx.txid,
            vout: utx.vout,
         });
         vinaddresses.push(utx.address);
         unspentAmount += utx.amount;
      }
   }
   const gas = 1e-5;
   const test_amount = 1e-5;
   if (unspentAmount < gas + test_amount) {
      console.error("Not enough founds on sender wallet");
      throw Error("Insufficient founds on sender wallet");
   }
   const vout: IIUtxoVout[] = [
      { address: to, amount: test_amount },
      { address: from, amount: round_for_ltc(unspentAmount - test_amount - gas) },
   ];
   const a = await RPC.createRawTransaction(fromWalletLabel, vin, vout);
   const signkeys = [];
   for (const add of vinaddresses) {
      signkeys.push(await RPC.getPrivateKey(fromWalletLabel, add));
   }
   const signedTx = await RPC.signRawTransaction(fromWalletLabel, a, signkeys);
   const txId = await RPC.sendRawTransactionInBlock(fromWalletLabel, signedTx.hex);
   return txId;
}

export function addressToBtyeAddress(address: string): Uint8Array {
   const algoKeyPair = addressToHex(address);
   return hexToBytes(unPrefix0x(algoKeyPair.publicKey) + unPrefix0x(algoKeyPair.checksum));
}

export interface algoTransactionTestCases extends transactionTestCases {
   block: number;
}

export interface transactionTestCases {
   description: string;
   txid: string;
   expect: expectTransactionTestCase;
   summary?: PaymentSummary;
}

export interface expectTransactionTestCase {
   txid: string;
   stdTxid: string;
   hash: string;
   reference: string[];
   stdPaymentReference: string;
   unixTimestamp: number;
   sourceAddresses: (string | undefined)[];
   receivingAddresses: (string | undefined)[];
   isFeeError: boolean;
   fee: string; // number as a string or error string if error is expected
   spentAmounts: AddressAmount[];
   receivedAmounts: AddressAmount[];
   type: string;
   isNativePayment: boolean;
   currencyName: string;
   elementaryUnits: string; // number as string
   successStatus: TransactionSuccessStatus;
   isOneToOne?: boolean;
}
