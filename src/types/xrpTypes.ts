import { AccountInfoRequest, AccountTxRequest, LedgerResponse, TxResponse } from "xrpl";
import { RateLimitOptions } from "../types";
import { optional } from "../utils/typeReflection";
import { IIGetBlockRes, IIGetTransactionRes, MccLoggingOptions } from "./genericMccTypes";

/**
 * @category Ripple
 */
export class XrpMccCreate {
   url: string = "";
   @optional() username?: string = "";
   @optional() password?: string = "";
   @optional() inRegTest?: boolean = false;
   @optional() rateLimitOptions? = new RateLimitOptions();
   @optional() loggingOptions? = new MccLoggingOptions();
}

/**
 * @category Ripple
 */
export interface XrpCreateAddressData {}

/**
 * @category Ripple
 */
export interface IXrpGetTransactionRes extends IIGetTransactionRes, TxResponse {}

/**
 * @category Ripple
 */
export interface IXrpGetFullTransactionRes extends IXrpGetTransactionRes {}

/**
 * @category Ripple
 */
export interface IXrpGetBlockRes extends LedgerResponse, IIGetBlockRes {}

// TODO modify to lite version of get block
/**
 * @category Ripple
 */
export interface IXrpGetBlockHeaderRes extends LedgerResponse, IIGetBlockRes {}

////
// CONSTANTS
////

// Flags
// maybe one day https://github.com/ripple/rippled/issues/2457
/**
 * @category Ripple
 */
export type AccountRootFlags =
   | "lsfDefaultRipple"
   | "lsfDepositAuth"
   | "lsfDisableMaster"
   | "lsfDisallowXRP"
   | "lsfGlobalFreeze"
   | "lsfNoFreeze"
   | "lsfPasswordSpent"
   | "lsfRequireAuth"
   | "lsfRequireDestTag";

/**
 * @category Ripple
 */
export const FlagToHex = {
   lsfDepositAuth: 0x01000000,
   lsfDefaultRipple: 0x00800000,
   lsfGlobalFreeze: 0x00400000,
   lsfNoFreeze: 0x00200000,
   lsfDisableMaster: 0x00100000,
   lsfDisallowXRP: 0x00080000,
   lsfRequireAuth: 0x00040000,
   lsfRequireDestTag: 0x00020000,
   lsfPasswordSpent: 0x00010000,
};

/**
 * @category Ripple
 */
export const allHexFlags = [
   FlagToHex.lsfDepositAuth,
   FlagToHex.lsfDefaultRipple,
   FlagToHex.lsfGlobalFreeze,
   FlagToHex.lsfNoFreeze,
   FlagToHex.lsfDisableMaster,
   FlagToHex.lsfDisallowXRP,
   FlagToHex.lsfRequireAuth,
   FlagToHex.lsfRequireDestTag,
   FlagToHex.lsfPasswordSpent,
];

/**
 * @category Ripple
 */
export const HexToFlag = {
   0x01000000: "lsfDepositAuth",
   0x00800000: "lsfDefaultRipple",
   0x00400000: "lsfGlobalFreeze",
   0x00200000: "lsfNoFreeze",
   0x00100000: "lsfDisableMaster",
   0x00080000: "lsfDisallowXRP",
   0x00040000: "lsfRequireAuth",
   0x00020000: "lsfRequireDestTag",
   0x00010000: "lsfPasswordSpent",
};

/**
 * @category Ripple
 */
export const PosToFlag = {
   24: "lsfDepositAuth",
   23: "lsfDefaultRipple",
   22: "lsfGlobalFreeze",
   21: "lsfNoFreeze",
   20: "lsfDisableMaster",
   19: "lsfDisallowXRP",
   18: "lsfRequireAuth",
   17: "lsfRequireDestTag",
   16: "lsfPasswordSpent",
};

/**
 * @category Ripple
 */
export const SpecialAddressesReverse = {
   rrrrrrrrrrrrrrrrrrrrrhoLvTp: "ACCOUNT_ZERO",
   rrrrrrrrrrrrrrrrrrrrBZbvji: "ACCOUNT_ONE",
   rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh: "GENESIS_ACCOUNT",
   rrrrrrrrrrrrrrrrrNAMEtxvNvQ: "RESERVATION_BLACK_HOLE",
   rrrrrrrrrrrrrrrrrrrn5RM1rHd: "NaN_ADDRESS",
};

/**
 * @category Ripple
 */
export const SpecialAddresses = {
   ACCOUNT_ZERO: "rrrrrrrrrrrrrrrrrrrrrhoLvTp",
   ACCOUNT_ONE: "rrrrrrrrrrrrrrrrrrrrBZbvji",
   GENESIS_ACCOUNT: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
   RESERVATION_BLACK_HOLE: "rrrrrrrrrrrrrrrrrNAMEtxvNvQ",
   NaN_ADDRESS: "rrrrrrrrrrrrrrrrrrrn5RM1rHd",
};

////
// INTERNAL USE
////

/**
 * Params data for methods (internal use)
 * @category Ripple
 */
export type IAccountInfoRequest = Omit<AccountInfoRequest, "command">;

/**
 * @category Ripple
 */
export type IAccountTxRequest = Omit<AccountTxRequest, "command">;
