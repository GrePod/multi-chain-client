import { IBlock, IBlockHeader, IBlockTip } from "../base-objects/BlockBase";
import { INodeStatus } from "../base-objects/StatusBase";
import { ITransaction } from "../base-objects/TransactionBase";

interface BaseRpcInterface {
   chainType: ChainType;
}

export interface ReadRpcInterface extends BaseRpcInterface {
   // General methods
   getNodeStatus(): Promise<INodeStatus>;
   /**
    * The lowest block in the latest joined set of blocks
    */
   getBottomBlockHeight(): Promise<number>;

   // Block data
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   getBlockHeader(blockNumberOrHash: number | string | any): Promise<IBlockHeader>;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   getBlock(blockNumberOrHash: number | string | any): Promise<IBlock>;
   getBlockHeight(): Promise<number>;

   // To be used with chain tip indexer processing
   getBlockTips?(height_gte: number): Promise<IBlockTip[]>;
   getTopLiteBlocks(branch_len: number, read_main?: boolean): Promise<IBlockTip[]>;

   // Transaction data
   getTransaction(txId: string, metaData?: getTransactionOptions): Promise<ITransaction>;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   listTransactions?(options?: any): any;

   // bottom block in connected node (0 if nodes dont support partial history)
}

export interface WriteRpcInterface extends BaseRpcInterface {
   // Wallets

   // Addresses
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   createAddress(createAddressData: any): any;

   // Transactions
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   createRawTransaction(walletLabel: string, vin: any[], out: any[]): any;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   signRawTransaction(walletLabel: string, rawTx: string, keysList: string[]): any;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   sendRawTransaction(walletLabel: string, signedRawTx: string): any;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   sendRawTransactionInBlock(walletLabel: string, signedRawTx: string): any;

   // Faucet
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   fundAddress(address: string, amount: number): any;
}

export interface RPCInterface extends ReadRpcInterface, WriteRpcInterface {}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// MCC base response interfaces ////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Parent Class objects that are extended on each unique underlying chain

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IIGetTransactionRes {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IIGetBlockRes {}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// Flare attestation interfaces ////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export enum TransactionSuccessStatus {
   SUCCESS = 0,
   SENDER_FAILURE = 1, // if there is a failure and cannot be clearly attributed to the receiver, then it is SENDER_FAILURE
   RECEIVER_FAILURE = 2,
}

/**
 * Object to use in get transaction additional parameters
 */
export interface getTransactionOptions {
   verbose?: boolean;
   binary?: boolean;
   min_block?: number;
   max_block?: number;
}

export enum ChainType {
   invalid = -1,
   BTC = 0,
   LTC = 1,
   DOGE = 2,
   XRP = 3,
   ALGO = 4,
   // ... make sure IDs are the same as in Flare node
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// Logging /////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Mode of debugging (default to off)
// - off : no debugging
// - production : light weight debugging that can be used on production
// - develop : full debugging mode
export type LoggingModes = "off" | "production" | "develop";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IExceptionCallback = (error: any, message: string) => void;
export type ILoggingCallback = (message: string) => void;

export class MccLoggingOptions {
   mode?: LoggingModes;
   loggingCallback?: ILoggingCallback;
   warningCallback?: ILoggingCallback;
   exceptionCallback?: IExceptionCallback;
}

export class MccLoggingOptionsFull {
   mode!: LoggingModes;
   loggingCallback!: ILoggingCallback;
   warningCallback!: ILoggingCallback;
   exceptionCallback!: IExceptionCallback;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// Lite blocks /////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEmptyObject {}
