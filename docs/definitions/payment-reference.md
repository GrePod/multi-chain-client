# Payment reference

The concept of a payment reference is widely used in banking to identify payments from specific entities to specific destination addresses (accounts). For example, a service provider wants to charge a specific customer of a service. Usually the service provider uses one account for receiving all the payments from multiple customers. In order to be able to identify the payments from specific customers and the purposes of their payments, it is common that the service provider issues a unique (per service provider) identifier - the **payment reference**. The customer paying for the specific purpose then makes a payment to the service provider's account using the payment reference. As we can see, the concept of payment reference is of high importance in banking but also in any serious DeFi application that needs to do some kind of accounting with payments. An alternative to it would be to generate a specific new address for each customer (and possibly a purpose).

## Standardized payment reference

Blockchains allow for use of payment references in various ways. On some blockchains, like Algorand, mechanisms are used for providing payment references that allow attaching almost arbitrary-sized JSON objects as payment references. For use in DeFi applications, specifically with smart contracts, handling custom size payment reference strings is not the most convenient option. Payment references in the form of 32-byte sequences (`bytes32` in Solidity) are on one hand convenient for use in smart contracts and on the other hand allow for more than sufficient variability for any application and are available on any blockchain we have encountered until now, in some form. If a native payment transaction has exactly one 32-byte sequence provided as a unique payment reference, we say the transaction has a **standardized payment reference**.

Next: [Transaction status](./transaction-status.md)

[Back to home](../README.md)
