---
title: "Low-level Calls in Solidity"
subtitle: "General Overview of Low-level Calls in Solidity"
date: "2024-10-21"
tags: " #Solidity, #low-level-calls, #EVM "
---
# Low-level Calls In Solidity 
### What are low-level calls in Solidity?
In Solidity, smart contracts communicate with eachother via the Ethereum Virtual Machine using the <mark>EVM CALL Opcode</mark>.

```
MyContract.someFunctionFromMyContract()
```

The example above is an example of a <mark>high-level call</mark>, or a function call that uses a contract's interface. The code calls the contract's function by its name and it will automatically revert the transaction if any error is thrown. <mark>Low-level calls</mark> are done using Solidity's built in methods like `call()`, `delegatecall()`, and `staticcall()`. Even though the `call()` method uses the same opcode as the high-level function call it does not provide handling of errors. `call()` returns a boolean value true/false regarding the success of the call and any data returned in bytes memory form where bytes memory can represent data of any type. <br>

Let's take a look at this example taken from Cyfrin Updraft:

```
(bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
```

The default behavior of one address using `call()` on another address (especially when transferring ETH) is to attempt to send a specified value of ETH from the calling contract/address to the recipient. In this case the call is attempting to send the entire balance of the contract `address(this).balance` to the `msg.sender`.<br>
Notice the `,` after `bool callSuccess` leaving the second value blank means we are ignoring the return data. The `("")` at the end represents the function signature to be called, but since we are only doing a simple ETH transfer call this is also left blank. If the call fails it will return `false`, but the transaction will continue. This allows developers to implement custom error handling for specific calls. A contract can become more flexible in which some parts of the transaction are critical while failure in other parts is permissible. This added flexibility inherently makes these calls riskier. One of the most notorious web3 attacks: <mark>reentrancy</mark> can be done when a `call()` is not properly secured. Reentrancy occurs when a malicious contract receiving ETH can repeatedly call back into the target contract before the first transaction completes.

### What about staticcall and delegatecall?
`staticcall` is used for <mark>view</mark> functions, meaning staticcalls are read-only. They ensure no state changes will be written therefore providing added protection against attacks like reentrancy. <br>
For the `delegatecall` example imagine we have 2 separate contracts **contract A** and **contract B**. `delegatecall` is used when **contract A** wants to execute a function in **contract B**, but the context (msg.sender, msg.value, and storage) is preserved as if it were executed within **contract A** itself. It can be used in proxy patterns, where **contract A** serves as a proxy for logic stored in **contract B** allowing you to make changes to **B** while preserving the state in **A**. <br>
It should be noted that there are a few caveats for using `delegatecall`. Firstly, the storage layout must match between the contracts, meaning you cannot mismatch data types otherwise it could result in complete contract malfunction. Also, the called contract can modify the caller's state meaning if **contract A** is calling `delegatecall()` on **contract B**, **contract B** can write changes to the state of **contract A**.

### Are there any other low-level calls?
There are 2 other low-level calls: `send()` and `transfer()` but these are not commonly used in modern Solidity and are generally deprecated in favor of `call()`.<br>

## References/Sources:
* EVM CALL Opcode: https://www.ethervm.io/#F1
* Cyfrin Updraft: https://www.cyfrin.io/updraft
