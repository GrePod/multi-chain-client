import { Managed } from "../../utils/managed";
import { prefix0x } from "../../utils/utils";
import { UtxoBlock } from "./UtxoBlock";

@Managed()
export class DogeBlock extends UtxoBlock {
   public get transactionIds(): string[] {
      // TODO update block type
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.data.tx!.map((tx) => prefix0x(tx));
   }
}
