import { ApolloClient, InMemoryCache } from "@apollo/client";

const auctionAlphaClient = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/99703/auctionalpha/0.0.1",
  cache: new InMemoryCache(),
});

const mooveNFTClient = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/99703/moovenft/0.0.1",
  cache: new InMemoryCache(),
});

export {auctionAlphaClient, mooveNFTClient};