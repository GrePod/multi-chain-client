import axios, { AxiosRequestConfig } from "axios";
import { AccountInfoResponse, AccountTxResponse, LedgerRequest, ServerStateResponse } from "xrpl";
import { XrpBlock, XrpTransaction } from "..";
import axiosRateLimit from "../axios-rate-limiter/axios-rate-limit";
import { XrpNodeStatus } from "../base-objects/StatusBase";
import { ChainType, getTransactionOptions, IAccountInfoRequest, IAccountTxRequest, RateLimitOptions, ReadRpcInterface, XrpMccCreate } from "../types";
import { MccLoggingOptionsFull } from "../types/genericMccTypes";
import { PREFIXED_STD_BLOCK_HASH_REGEX, PREFIXED_STD_TXID_REGEX } from "../utils/constants";
import { defaultMccLoggingObject, fillWithDefault, unPrefix0x } from "../utils/utils";
import { xrp_ensure_data } from "../utils/xrpUtils";

const DEFAULT_TIMEOUT = 15000;
const DEFAULT_RATE_LIMIT_OPTIONS: RateLimitOptions = {
   maxRPS: 5,
};

export class XRPImplementation implements ReadRpcInterface {
   rippleApi: any;
   client: any;
   inRegTest: any;
   chainType: ChainType;
   loggingObject: MccLoggingOptionsFull;

   constructor(createConfig: XrpMccCreate) {
      const createAxiosConfig: AxiosRequestConfig = {
         baseURL: createConfig.url,
         timeout: createConfig.rateLimitOptions?.timeoutMs || DEFAULT_TIMEOUT,
         headers: { "Content-Type": "application/json" },
         validateStatus: function (status: number) {
            return (status >= 200 && status < 300) || status == 500;
         },
      };
      if (createConfig.username && createConfig.password) {
         createAxiosConfig.auth = {
            username: createConfig.username,
            password: createConfig.password,
         };
      }
      let client = axios.create(createAxiosConfig);
      this.client = axiosRateLimit(client, {
         ...DEFAULT_RATE_LIMIT_OPTIONS,
         ...createConfig.rateLimitOptions,
      });
      this.inRegTest = createConfig.inRegTest || false;
      this.loggingObject = createConfig.loggingOptions ? fillWithDefault(createConfig.loggingOptions) : defaultMccLoggingObject();

      this.chainType = ChainType.XRP;
   }

   async getTransaction(txId: string, options?: getTransactionOptions): Promise<XrpTransaction | null> {
      if (PREFIXED_STD_TXID_REGEX.test(txId)) {
         txId = unPrefix0x(txId);
      }
      const binary = options?.binary || false;
      const min_block = options?.min_block || undefined;
      const max_block = options?.max_block || undefined;
      interface XrpTxParams {
         transaction: string;
         binary: boolean;
         min_ledger?: number;
         max_ledger?: number;
      }
      let params: XrpTxParams = {
         transaction: txId,
         binary: binary,
      };
      if (min_block !== null && min_block !== null) {
         params.min_ledger = min_block;
         params.max_ledger = max_block;
      }
      try {
         let res = await this.client.post("", {
            method: "tx",
            params: [params],
         });
         xrp_ensure_data(res.data);
         return new XrpTransaction(res.data);
      } catch (e: any) {
         if (e.error === "txnNotFound") {
            return null;
         }
         throw e;
      }
   }

   /**
    * @deprecated Use getNodeStatus to get server info
    * @returns
    */
   async isHealthy(): Promise<boolean> {
      let res = await this.client.post("", {
         method: "server_info",
         params: [{}],
      });
      const validStates = ["full"];
      xrp_ensure_data(res.data);
      let state = res.data.result.info.server_state;
      if (this.loggingObject.mode === "develop") this.loggingObject.loggingCallback(state);
      return validStates.includes(state);
   }

   async getBlockHeight(): Promise<number> {
      let res = await this.client.post("", {
         method: "ledger_closed",
         params: [{}],
      });
      xrp_ensure_data(res.data);
      return res.data.result.ledger_index;
   }

   async getBlock(blockNumberOrHash: number | string): Promise<XrpBlock | null> {
      if (typeof blockNumberOrHash === "string") {
         if (PREFIXED_STD_BLOCK_HASH_REGEX.test(blockNumberOrHash)) {
            blockNumberOrHash = unPrefix0x(blockNumberOrHash);
         }
      }
      try {
         this.loggingObject.loggingCallback(`block number: ${blockNumberOrHash} `);

         let res = await this.client.post("", {
            method: "ledger",
            params: [
               {
                  ledger_index: blockNumberOrHash,
                  transactions: true,
                  expand: true,
                  binary: false,
               } as LedgerRequest,
            ],
         });
         xrp_ensure_data(res.data);
         return new XrpBlock(res.data);
      } catch (e: any) {
         if (e?.result?.error === "lgrNotFound") {
            return null;
         }
         if (e?.response?.status === 400) {
            return null;
         }
         throw new Error(e);
      }
   }

   /**
    *
    * @param account A unique identifier for the account, most commonly the account's Address.
    * @param upperBound either blockHash or block number for the upper bound (The information does not contain any changes from ledger versions newer than this one.)
    * @returns
    */
   async getAccountInfo(account: string, upperBound: number | string = "current"): Promise<AccountInfoResponse> {
      const params = {
         account: account,
         signer_lists: true
      } as IAccountInfoRequest;
      if (typeof upperBound === "number") {
         params.ledger_index = upperBound;
      } else if (upperBound === "current") {
         params.ledger_index = upperBound;
      } else if (typeof upperBound === "string") {
         params.ledger_hash = upperBound;
      } else {
         this.loggingObject.exceptionCallback(upperBound, "Invalid upperBound parameter");
      }
      // AccountInfoRequest
      this.loggingObject.loggingCallback('Call Params')
      this.loggingObject.loggingCallback(JSON.stringify(params))
      let res = await this.client.post("", {
         method: "account_info",
         params: [params],
      });
      xrp_ensure_data(res.data);
      return res.data;
   }

   async getAccountTransactions(account: string, lowerBound: number = -1, upperBound: number = -1): Promise<AccountTxResponse> {
      const params = {
         account: account,
      } as IAccountTxRequest;
      params.ledger_index_min = lowerBound;
      params.ledger_index_max = upperBound;
      this.loggingObject.loggingCallback(JSON.stringify(params));
      let res = await this.client.post("", {
         method: "account_tx",
         params: [params],
      });
      xrp_ensure_data(res.data);
      return res.data;
   }

   /**
    * TODO implement
    * @external_docs https://xrpl.org/server_state.html
    */
   async getNodeStatus(): Promise<XrpNodeStatus | null> {
      try {
         let res = await this.client.post("", {
            method: "server_state",
            params: [],
         });
         xrp_ensure_data(res.data);
         return new XrpNodeStatus(res.data as ServerStateResponse);
      } catch (e) {
         return null;
      }
   }
}
