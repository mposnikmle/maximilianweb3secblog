---
title: "Intro to Anchor"
subtitle: "Intro to Solana Development Using Anchor"
date: "2025-03-17"
tags: " #Solana, #Anchor "
---
### Questions

- [What’s Anchor?](#whats-anchor)
- [Why Rust?](#why-rust)
- [What is a Solana program?](#what-is-a-solana-program)
- [What is a Solana account?](#what-is-a-solana-account)
  - [How are accounts created?](#how-are-accounts-created)
- [What’s `declare_id!`?](#whats-declare_id)
- [What‘s `#[program]` used for?](#whats-program-used-for)
- [What’s `Context<Initialize>`?](#whats-contextinitialize)
- [What’s `msg!`?](#whats-msg)
- [What’s `#[derive(Accounts)]`?](#whats-deriveaccounts)
- [Why is `Initialize` an empty struct?](#why-is-initialize-an-empty-struct)

![Anchor Introduction](/images/anchor_intro.png)

### What’s Anchor?
Anchor is like Solana’s Foundry. It’s how developers simplify the Solana program creation process. Anchor abstracts away a lot of the low-level programming required for Solana and provides built-in tools for account management, validation, and testing.

### Why Rust?
One of Solana’s key innovations is: Sealevel Parallel Runtime, which implements parallel transaction processing, is designed to support programs written in Rust, C, and C++. As of March 2025, Rust is still the preferred language of the Solana ecosystem.

### What is a Solana program?
Smart contracts on Ethereum are the equivalent to programs on Solana. Solana programs are stateless, meaning they do not store data themselves, and they operate on data stored separately in accounts on the blockchain. 

### What is a Solana account?
An account on Solana is an entity all on its own, separate from a Solana program. All data on Solana is stored in accounts. Accounts are essentially just containers for information on the blockchain. Accounts can store information like balances, user data, or the state of a dApp. All accounts have program owners. Anyone can increase an account’s balance, but only the program that owns the account can deduct from the balance or modify data.

#### How are accounts created?
Solana has “native” programs which are built into the Solana runtime. The System Program is a native Solana program that creates all new accounts on the network. By default, the System Program is the owner of all accounts when they are first created on the network. The System Program can then reassign ownership of the account to a different program owner.

### What is `declare_id!`?
This is a macro we are importing from `anchor_lang::prelude`. It’s used to declare the public key also known as the address of the Solana program. You can look this key up on Solana Explorer and it will have the program’s details if deployed correctly. Where does this value come from? This is an important part of the Anchor dev process: the `anchor build` command gets run twice in the terminal. First build compiles your code into a .so (shared object file) which is one of Solana’s deployment requirements. Then we can do `anchor keys list` in the terminal to get our compiled program’s ID. After defining the program ID using `declare_id!` another build is required to embed the ID into the binary of the program. The deployed program binary should match the declared ID. 

### What‘s `#[program]` used for?
This is specifying the module that will contain all the public instruction logic. Each function within this module corresponds to an on-chain instruction that can be invoked by anyone interacting with the program.

### What’s `Context<Initialize>`?
When someone wants to interact with this Anchor program they send an “instruction.” An `Instruction Handler` is the specific function within the program that knows how to process it. The first and mandatory parameter of every instruction handler is `ctx: Context<AccountsStruct>`. We get `Context` from Anchor, it wraps our struct, giving us access to built-in fields using dot notation (ex. ctx.accounts). The `AccountsStruct` specifies the accounts that the instruction requires. 

### What’s `msg!`?
This is an Anchor macro that is used to log messages to the Solana transaction logs. Can be highly useful during debugging and auditing. Like a `console.log` in JavaScript, only it’s on-chain.

### What’s `#[derive(Accounts)]`?
An Anchor tool used to define all accounts required for an instruction. An important part of the Anchor workflow that performs basic validation based on the fields defined in the struct.

### Why is `Initialize` an empty struct?
The `hello_world` instruction doesn’t require any accounts to perform its action, therefore the `Initialize` struct is left empty.
