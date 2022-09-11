import { RateLimitOptions } from "../types";
import { optional } from "../utils/typeReflection";
import { IIGetBlockRes, IIGetTransactionRes, MccLoggingOptions, RPCInterface } from "./genericMccTypes";

/**
 * @category Btc UTXO
 */
export class UtxoMccCreate {
   url: string = "";
   username: string = "";
   password: string = "";
   @optional() inRegTest?: boolean;
   @optional() rateLimitOptions? = new RateLimitOptions();
   @optional() loggingOptions? = new MccLoggingOptions();
}

// Creating transactions
/**
 * @category Btc UTXO
 */
export interface IIUtxoVin {
   txid: string;
   vout: number;
   sequence?: number;
}

/**
 * @category Btc UTXO
 */
export interface IIUtxoVout {
   address: string;
   amount: number;
}

/**
 * @category Btc UTXO
 */
export interface IUtxoScriptPubKey {
   asm: string;
   hex: string;
   reqSigs?: number;
   type: string; // choices :  "witness_v0_keyhash",
   addresses?: string[];
   address?: string;
}

/**
 * @category Btc UTXO
 */
export interface UtxoVout {
   value: number;
   n: number;
   scriptPubKey: IUtxoScriptPubKey;
}

/**
 * @category Btc UTXO
 */
export interface IUtxoScriptSig {
   asm: string;
   hex: string;
}

/**
 * @category Btc UTXO
 */
export interface IUtxoWalletRes {
   name: string;
   warning: string;
}

/**
 * @category Btc UTXO
 */
export interface getAddressByLabelResponse {
   address: string;
   purpose: string; // TODO make this a choice:  "receive" |
}

/**
 * @category Btc UTXO
 */
export interface IUtxoTransactionListRes {
   txid: string;
   vout: number;
   address: string;
   label: string;
   scriptPubKey: string;
   amount: number;
   confirmations: number;
   spendable: boolean;
   solvable: boolean;
   desc: string;
   safe: boolean;
}

/**
 * @category Btc UTXO
 */
export interface IUtxoGetBlockHeaderRes {
   hash: string;
   confirmations: number;
   height: number;
   version: number;
   versionHex: string;
   merkleroot: string;
   time: number;
   mediantime: number;
   nonce: number;
   bits: string;
   difficulty: number;
   chainwork: string;
   previousblockhash: string;
   nextblockhash: string;
}

/**
 * @category Btc UTXO
 */
export interface IUtxoGetBlockRes extends IUtxoGetBlockHeaderRes, IIGetBlockRes {
   size: number;
   strippedsize: number;
   weight: number;
   tx: IUtxoInBlockTransaction[]; // | string[] // if verbose is 1
   nTx: number;
}

/**
 * Vin interface from transaction details requests
 * @category Btc UTXO
 */
export interface IUtxoVinTransaction {
   coinbase?: string;
   sequence: number;
   txid?: string;
   vout?: number;
   scriptSig?: IUtxoScriptSig;
   txinwitness?: string[];
}

/**
 * @category Btc UTXO
 */
export interface IUtxoCoinbase {
   coinbase?: string;
}

/**
 * @category Btc UTXO
 */
export interface IUtxoVoutTransaction {
   value: number;
   n: number;
   scriptPubKey: IUtxoScriptPubKey;
}

/**
 * @category Btc UTXO
 */
export interface IUtxoInBlockTransaction extends IIGetTransactionRes {
   txid: string;
   hash: string;
   version: number;
   size: number;
   vsize: number;
   weight: number;
   locktime: number;
   vin: IUtxoVinTransaction[];
   vout: IUtxoVoutTransaction[];
   hex: string;
}

/**
 * @category Btc UTXO
 */
export interface IUtxoGetTransactionRes extends IIGetTransactionRes {
   txid: string;
   hash: string;
   version: number;
   size: number;
   vsize: number;
   weight: number;
   locktime: number;
   vin: IUtxoVinTransaction[];
   vout: IUtxoVoutTransaction[];
   hex: string;
   blockhash: string;
   confirmations: number;
   time: number;
   blocktime: number;
}

/**
 * @category Btc UTXO
 */
export interface IUtxoGetAlternativeBlocksOptions {
   height_gte?: number; // We only want tips / blocks that happened after specified height
   all_blocks?: boolean; // If we want to get all
}

/**
 * @category Btc UTXO
 */
export type IUtxoGetAlternativeBlocksRes = IUtxoChainTip[];

/**
 * @category Btc UTXO
 */
export interface IUtxoChainTip {
   height: number; // height of the chain tip
   hash: string; // block hash of the tip
   branchlen: number; // zero for main chain
   status: "active" | "valid-fork" | "valid-headers" | "headers-only" | "invalid";
   // Possible status options
   // 1.  "invalid"               This branch contains at least one invalid block
   // 2.  "headers-only"          Not all blocks for this branch are available, but the headers are valid
   // 3.  "valid-headers"         All blocks are available for this branch, but they were never fully validated
   // 4.  "valid-fork"            This branch is not part of the active chain, but is fully validated
   // 5.  "active"                This is the tip of the active main chain, which is certainly valid
   all_block_hashes?: string[]; // Array of all hashes that are on alternative (orphaned) branch, only returned if all_blocks is set to True
}

// Deprecated
// export interface IUtxoGetFullTransactionRes extends IUtxoGetTransactionRes, IIGetTransactionRes {
//    // List of v-outs that were used in vins of the transaction, or coinbase strings if transaction is a coinbase transaction
//    vinouts: (IUtxoVoutTransaction | IUtxoCoinbase)[];
// }

/**
 * @category Btc UTXO
 */
export interface IUtxoVinVoutsMapper {
   index: number;
   vinvout: IUtxoVoutTransaction | undefined;
}

/**
 * @category Btc UTXO
 */
export interface IUtxoTransactionAdditionalData {
   vinouts?: (IUtxoVinVoutsMapper | undefined)[];
}

// Status methods

/**
 * @category Btc UTXO
 */
export interface INetworks {
   name: string; // network (ipv4, ipv6 or onion)
   limited: boolean; // is the network limited using -onlynet?
   reachable: boolean; // is the network reachable?
   proxy: string; // (host:port) the proxy that is used for this network, or empty if none
   proxy_randomize_credentials: boolean; // Whether randomized credentials are used
}

/**
 * @category Btc UTXO
 */
export interface ILocalAddresses {
   address: string; // network address
   port: number; // network port
   score: number; // relative score
}

/**
 * @category Btc UTXO
 */
export interface IUtxoGetNetworkInfoRes {
   version: number; // the server version
   subversion: string; // the server subversion string
   protocolversion: number; // the protocol version
   localservices: string; // hexstring              // the services we offer to the network
   localservicesnames: string[]; // the services we offer to the network, in human-readable form as string array
   localrelay: boolean; // true if transaction relay is requested from peers
   timeoffset: number; // the time offset
   connections: number; // the total number of connections
   connections_in: number; // the number of inbound connections
   connections_out: number; // the number of outbound connections
   networkactive: boolean; // whether p2p networking is enabled
   networks: INetworks[]; //         (json array) information per network
   relayfee: number; // minimum relay fee for transactions in BTC/kB
   incrementalfee: number; // minimum fee increment for mempool limiting or BIP 125 replacement in BTC/kB
   localaddresses: ILocalAddresses[]; // list of local addresses
   warnings: string;
}

/**
 * @category Btc UTXO
 */
interface IUtxoStatisticsBip9 {
   // numeric statistics about BIP9 signalling for a softfork (only for started status)
   period: number; // the length in blocks of the BIP9 signalling period
   threshold: number; // the number of blocks with the version bit set required to activate the feature
   elapsed: number; // the number of blocks elapsed since the beginning of the current period
   count: number; // the number of blocks with the version bit set in the current period
   possible: boolean; // returns false if there are not enough blocks left in this period to pass activation threshold
}

/**
 * @category Btc UTXO
 */
interface IUtxoBip9 {
   // status of bip9 softforks (only for bip9 type)
   status: string; // one of defined, started, locked_in, active, failed
   bit: number; // the bit (0-28) in the block version field used to signal this softfork (only for started status)
   start_time: string; // the minimum median time past of a block at which the bit gains its meaning
   timeout: string; // the median time past of a block at which the deployment is considered failed if not yet locked in
   since: number; // height of the first block to which the status applies
   statistics: IUtxoStatisticsBip9;
}

/**
 * @category Btc UTXO
 */
interface IUtxoSoftFork {
   // name of the softfork
   type: string; // one of buried, bip9
   bip9: IUtxoBip9;
   height: number; // height of the first block which the rules are or will be enforced (only for buried type, or bip9 type with active status)
   active: boolean; // true if the rules are enforced for the mempool and the next block
}

/**
 * @category Btc UTXO
 */
export interface IUtxoGetBlockchainInfoRes {
   chain: "main" | "test" | "regtest"; // current network name (main, test, regtest)
   blocks: number; // the height of the most-work fully-validated chain. The genesis block has height 0
   headers: number; // the current number of headers we have validated
   bestblockhash: string; // the hash of the currently best block
   difficulty: number; // the current difficulty
   mediantime: number; // median time for the current best block
   verificationprogress: number; // estimate of verification progress [0..1]
   initialblockdownload: boolean; // (debug information) estimate of whether this node is in Initial Block Download mode
   chainwork: string; // total amount of work in active chain, in hexadecimal
   size_on_disk: number; // the estimated size of the block and undo files on disk
   pruned: boolean; // if the blocks are subject to pruning
   pruneheight: number; // lowest-height complete block stored (only present if pruning is enabled)
   automatic_pruning: boolean; // whether automatic pruning is enabled (only present if pruning is enabled)
   prune_target_size: number; // the target size used by pruning (only present if automatic pruning is enabled)
   softforks: any; // actually an object whre you have name: IUtxoSoftFork
   warnings: string;
}

export type IUtxoNodeStatus = IUtxoGetBlockchainInfoRes & IUtxoGetNetworkInfoRes;

/**
 * Mcc extended BTC based UTXO transactions
 * @category Btc UTXO
 */
export type UtxoTransactionTypeOptions = "coinbase" | "payment" | "partial_payment" | "full_payment";
// Transaction types and their description
// - coinbase        : transaction that mints new coins
// - payment         : what you get from node
// - partial_payment : transaction with some vout of vins added to additional data
// - full_payment    : transaction with vouts for all vins added to additional data

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// MCC RPC implementation interfaces ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @category Btc UTXO
 */
export interface UtxoRpcInterface extends RPCInterface {
   getBlockHeader(blockHash: string): any;

   createWallet(walletLabel: string): any;

   loadWallet(walletLabel: string): any;

   createAddress(walletLabel: string, addressLabel?: string, address_type?: string): any;

   listAllWallets(): any;

   listAllAddressesByLabel(walletLabel: string, addressLabel: string): Promise<any[]>;

   listUnspentTransactions(walletLabel: string, min: number, max: number): any;

   getPrivateKey(walletLabel: string, address: string): any;
}
