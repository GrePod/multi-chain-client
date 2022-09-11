# MCC Object

Currently, the MCC library supports querying from 5 different blockchains:

-  [Bitcoin (BTC)](./mccClient/BtcLtcDogeClient.md)
-  [Litecoin (LTC)](./mccClient/BtcLtcDogeClient.md)
-  [Dogecoin (DOGE)](./mccClient/BtcLtcDogeClient.md)
-  [Ripple (XRP)](./mccClient/XrpClient.md)
-  [Algorand (ALGO)](./mccClient/AlgoClient.md)

Each client implements the following methods:

-  `isHealthy(): Promise<boolean>`
-  `getBlock(blockNumberOrHash: number | string | any): any`
-  `getBlockHeight(): Promise<number>`
-  `getBlockHashFromHeight?(height: number): Promise<string | null>`
-  `getTopLiteBlocks?(branch_len: number): Promise<LiteBlock[]>`
-  `getTransaction(txId: string, metaData?: getTransactionOptions): any`

Some clients also implement other methods such as (for more detail refer to their individual implementations):

-  `listTransactions?(options?: any): any`
-  `getBlockTips?(height_gte: number): Promise<LiteBlock[]>`

[Back to home](README.md)
