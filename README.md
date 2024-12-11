<br />
<div id="readme-top" align="center">
  <a href="">
    <img src="/packages/nextjs/public/logo.png/" alt="Moove Logo" width="100" height="30">
  </a>

<h3 align="center">Moove</h3>

  <p align="center">
    MOOVE is a blockchain-based auction platform and NFT marketplace.
    <br />
    <a href=""><strong>Repository GitHub »</strong></a>
    <br />
  </p>
</div>

## About The Project

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


## Specs for nerds

The project was built using ScaffoldETH-2, a web3 framework that provides the foundational structure for developing and testing dApps.

It leverages Next.js as the primary JavaScript framework for the front end, while Foundry is used as the smart contract development framework for testing and deploying on-chain.


## Smart Contracts

At its core, **MOOVE** is entirely powered by two smart contracts deployed on the Sepolia testnet: **MooveNFT** and **AuctionAlpha**.

- MooveNFT: **0x11eAF27a2Ec15FdE8E9c3f5208c7F71dF1C5c111**
- AuctionAlpha: **0x3AA8c544CBFb5f562688fb6A746D174Ad2e99ABA**

### 1. MooveNFT
This contract manages the minting process for the NFT collection.  
- It adheres to the **ERC721 standard**, inheriting its implementation from **OpenZeppelin**.  
- Beyond the standard, it includes functionality for managing **minting authorizations**, which are granted exclusively by the contract owner.  
- Ideally, only **AuctionAlpha** should hold minting rights for the NFTs.  

### 2. AuctionAlpha
This contract oversees the entire auction process and serves as the foundation for the marketplace section.  
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
- Instead, the funds are retained on-platform as **MOOVE Balance**, enabling users to place a new bid quickly without incurring duplicate transaction costs.  

If a user decides to exit the auction, they can easily withdraw their funds via the **“Withdraw Funds”** page, accessible through the **wallet dropdown menu**.

## Automation

The starting and closing steps of the auction process are automated via **Chainlink Automation**.  
As a result:  
- The `startAuction` and `closeAuction` functions are designed to be **exclusively callable** by the Forwarder address provided by Chainlink.  
- This ensures that auctions can only be closed when specific conditions are met, enabling the seamless transition to the next auction.

## After the minting

Once a user successfully obtains an NFT—either by winning an auction or purchasing an unsold NFT—they can verify the minting of their NFT:  
- In the **“MyNFTs”** page.  
- In their **web3 wallet**.  

Users can also transfer ownership of their NFTs directly from their wallets.  
To facilitate this, the **MooveNFT** contract extends the ERC721 `transferFrom` function by implementing an `_updateOwnership` internal function, ensuring the **“MyNFTs”** page reflects the correct ownership.

## Further development

If you discover a bug or have questions, feel free to reach out via **Telegram** or through the **contact section** of my portfolio website.

<br>

## Contacts

**Marco Roccon - Digital Innovation & Development**<br>
Portfolio website: https://rocconmarco.github.io/<br>
Linkedin: https://www.linkedin.com/in/marcoroccon/<br>
Telegram: https://t.me/marcoroccon<br>
GitHub: https://github.com/rocconmarco

Project Link: 

<br>

## Copyright

© 2024 Marco Roccon. All rights reserved.