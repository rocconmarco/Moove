<br />
<div id="readme-top" align="center">
  <a href="">
    <img src="/packages/nextjs/public/logo.png/" alt="Moove Logo" width="160" height="30">
  </a>

<h3 align="center">Moove</h3>

  <p align="center">
    MOOVE is a blockchain-based auction platform and NFT marketplace.
    <br />
    <a href="https://moove-bay.vercel.app/"><strong>Visit the website »</strong></a>
    <br />
  </p>
</div>

# Table of contents
- [About The Project](#about-the-project)
- [How to run the project locally](#how-to-run-the-project-locally)
  - [Start local development server](#start-local-development-server)
  - [Test smart contracts](#test-smart-contracts)
- [Specs for nerds](#specs-for-nerds)
  - [Smart Contracts](#smart-contracts)
    - [1. MooveNFT](#1-moovenft)
    - [2. AuctionAlpha](#2-auctionalpha)
  - [Front end](#front-end)
  - [Gas efficiency](#gas-efficiency)
  - [Automation](#automation)
  - [After the minting](#after-the-minting)
- [Updates (v1.1)](#updates-v11)
  - [Reading events with TheGraph](#reading-events-with-thegraph)
  - [Helper functions](#helper-functions)
  - [Constructor and events](#constructor-and-events)
  - [Graphic improvements](#graphic-improvements)
- [Further development](#further-development)
- [Contacts](#contacts)
- [Copyright](#copyright)

<br>

# About The Project

**MOOVE** is a blockchain-based auction platform and NFT marketplace created by **Marco Roccon** as part of the final project for the **Master in Blockchain Development** at **start2impact University**.

The platform is fully functional, allowing users to bid for a chance to obtain unique NFTs from the MOOVE collection.  
- Each auction lasts **30 days**, after which the highest bidder wins the NFT.  
- If no bids are placed by the end of an auction, the NFT is marked as **"unsold"** and becomes available in the **"Buy"** section at its starting price.

Both the auction process and the marketplace are fully managed by **smart contracts** developed in **Solidity** and deployed on the **Sepolia testnet**. Users can connect a web3 wallet to:  
- Interact with the platform.  
- View their NFTs in the **"MyNFTs"** section.

The platform's design is entirely created by the author and aligns with the **futuristic aesthetic** commonly adopted by designers in the web3 space.

**MOOVE** is open to everyone for testing and interaction. The **minting mechanisms** have been successfully implemented and tested, ensuring that anyone has a real chance to win one of the **13 unique NFTs** in the collection.

This project has been a tough challenge, but through perseverance, I turned every mistake into a learning opportunity, which ultimately made me a better developer. Each difficulty I faced became a strength and laid the foundation for further growth in my skillset.

<br>

# How to run the project locally

## Start local development server

1- Clone the repository
```
git clone https://github.com/rocconmarco/Moove.git
```

2- Navigate to the project folder
```
cd Moove
```

3- Install the dependencies
```
yarn install
```

4- Set up your `packages/nextjs/.env.local` file<br>
In order to run the project locally, you will need to provide the following environment variables
- NEXT_PUBLIC_ALCHEMY_API_KEY: sign up for Alchemy and generate your API key on https://www.alchemy.com/
- NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: create your project on https://www.reown.com and copy the project ID

5- Run your local development server
```
cd packages/nextjs
yarn start
```

## Test smart contracts

To run the test suite for smart contracts, make sure to have Foundry installed on your device.<br>
Refer to the official guide for more instructions on the installation: https://book.getfoundry.sh/getting-started/installation

1- Navigate to the `packages/foundry` folder
```
cd packages/foundry
```

2- Run the test suite
```
forge test
```

<br>

# Specs for nerds

The project was built using ScaffoldETH-2, a web3 framework that provides the foundational structure for developing and testing dApps.

It leverages Next.js as the JavaScript framework for the front end, while Foundry is used as the smart contract development framework for testing and deploying smart contracts on-chain.


## Smart Contracts

At its core, **MOOVE** is entirely powered by two smart contracts deployed on the Sepolia testnet: **MooveNFT** and **AuctionAlpha**.

- MooveNFT: **0xbF55B5F7D70015C99e6e6E04F32f4693881ede55**
- AuctionAlpha: **0x02D9b78795c95fc10C0a5a63E92607bb8AD4f8e9**

### 1. MooveNFT
This contract manages the minting process for the NFT collection.  
- It adheres to the **ERC721 standard**, inheriting its implementation from **OpenZeppelin**.  
- Beyond the standard, it includes functionality for managing **minting authorizations**, which are granted exclusively by the contract owner.  
- Ideally, only **AuctionAlpha** should hold minting rights for the NFTs.  

### 2. AuctionAlpha
This contract manages the entire auction process and serves as the foundation for the marketplace section.  
- It includes **robust checks** to ensure that auctions run as expected.  
- The owner is granted **limited rights**, specifically the ability to adjust:  
  - The starting price.  
  - The minimum bid increment for upcoming auctions.  
- These measures are designed to mitigate the impact of **ETH volatility**, which could otherwise inflate the minimum bid in dollar terms, potentially discouraging user participation.

The smart contracts follow **NatSpec guidelines**, ensuring that the purpose behind each line of code is **clear** and **well-documented**.

## Front end

The front-end design reflects contemporary trends in the web3 space, featuring a **futuristic aesthetic** and a **seamless user experience**. A **smooth landing page** enhances the project's credibility.

Wallet connection is natively managed by **RainbowKit**, providing users with insights into:  
- Their **wallet balance**.  
- Their **on-platform balance**, namely **“MOOVE Balance.”**  

These two pieces of information allow users to quickly view their total available funds.

All bids for the current auction are displayed in the **“Bid History”** table, which provides users with:  
- The **address** of the bidder (shortened for privacy).  
- The **bid amount**.  
- The **exact timestamp** of the bid.

To prevent unintended behavior, **custom errors** have been implemented within the smart contracts.  
These checks are also mirrored on the **front end**, adding an **extra layer of security**.  
- Buttons for certain actions are **disabled** if the required conditions are not met, ensuring a seamless and error-free user experience.

## Gas efficiency

The **auction process** has been optimized for **gas efficiency** while maintaining the **security** and **transparency** essential for on-chain dApps.  
- When a user is outbid, their funds are not automatically returned to their web3 wallet.  
- Instead, the funds are retained on-platform as **MOOVE Balance**, enabling users to place a new bid quickly with all or part of the balance available on-platform.  

If a user decides to exit the auction, they can easily withdraw their funds via the **“Withdraw Funds”** page, accessible through the **wallet dropdown menu**.

## Automation

The starting and closing steps of the auction process are automated via **Chainlink Automation**.  
As a result:  
- The `startAuction` and `closeAuction` functions are designed to be **exclusively callable** by the Forwarder address provided by Chainlink.  
- This ensures that auctions can only be closed when specific conditions are met, enabling a smooth transition to the next auction.

## After the minting

Once a user successfully obtains an NFT—either by winning an auction or purchasing an unsold NFT—they can verify the minting of their NFT:  
- In the **“MyNFTs”** page.  
- In their **web3 wallet**.  

Users can also transfer ownership of their NFTs directly from their wallets.  
The **“MyNFTs”** page always reflects the NFTs owned by the user, even after one or more NFTs are transferred to another user, thanks to the tracking of the `Transfer` event emitted by the **MooveNFT** contract via **TheGraph**.

<br>

# Updates (v1.1)

Version 1.1 of the project introduces several enhancements to improve the security and efficiency of the contracts, along with some updates to the front end.

## Reading events with TheGraph

Blockchain data is accessed using <a href="https://thegraph.com/">TheGraph</a>, a powerful tool for reading and organizing on-chain events.
This approach eliminates redundant data structures, improving gas efficiency.

TheGraph has been used in the following areas:
- **MooveNFT**: NFTs ownership is inferred by tracking the `Transfer` event emitted by the standard ERC721 contract.
- **AuctionAlpha**: the bid history for a particular auction is reconstructed by monitoring the BidPlaced event, while the unsold NFTs are tracked through of UnsoldNFTListed and UnsoldNFTDelisted events.

## Helper functions

The logic for transforming and fetching metadata from IPFS has been simplified and made more readable through the implementation of two helper functions available at `packages/nextjs/utils/helper`.
- **fetchNFTImage.ts**
- **fetchNFTName.ts**

This implementation has an impact on the following components:
- **NFTImage.tsx**
- **NFTName.tsx**
- **MyNFTImage.tsx**
- **UnsoldNFTImage.tsx**

Metadata is fetched whenever the `tokenURI` passed as a prop to the individual components is modified.

## Constructor and events

The `maxSupply` parameter has been added to the constructor of the **MooveNFT** contract to allow the owner to set the number of NFTs available in the collection at the time of deployment.
<br>
<br>
The events `AuthorizedMinterAdded` and `AuthorizedMinterRemoved` have been added to the respective functions in the **MooveNFT** contract to track the permissions granted regarding NFT minting.

## Graphic improvements

The style of the **Open Discord** and **Download the app** buttons on the landing page has been modified to align with the overall style of the platform.

<br>

# Further development

If you discover a bug or have questions, feel free to reach out via **Telegram** or through the **contact section** of my portfolio website.

<br>

# Contacts

**Marco Roccon - Digital Innovation & Development**<br>
Portfolio website: https://rocconmarco.github.io/<br>
Linkedin: https://www.linkedin.com/in/marcoroccon/<br>
Telegram: https://t.me/marcoroccon<br>
GitHub: https://github.com/rocconmarco

Project Link: https://moove-bay.vercel.app/

<br>

# Copyright

© 2025 Marco Roccon. All rights reserved.