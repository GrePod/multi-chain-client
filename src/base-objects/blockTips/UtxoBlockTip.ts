import { IUtxoChainTip, IUtxoChainTipStatuses } from "../../types";
import { Managed } from "../../utils/managed";
import { BlockTipBase } from "../BlockBase";

@Managed()
export class UtxoBlockTip extends BlockTipBase<IUtxoChainTip> {
   public get number(): number {
      return this.data.height;
   }

   public get blockHash(): string {
      return this.data.hash;
   }

   public get stdBlockHash(): string {
      return this.blockHash;
   }

   public get chainTipStatus(): IUtxoChainTipStatuses {
      return this.data.status;
   }
}
