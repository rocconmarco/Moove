import React from "react";
import { useEffect } from "react";
import { formatEther } from "viem";
import { useReadContract } from "wagmi";
import { auctionAlphaContract } from "~~/contracts/contractsInfo";

interface Bid {
  bidder: string;
  amount: bigint;
  timestamp: bigint;
}

const StyledTable: React.FC<{ auctionId: bigint }> = ({ auctionId }) => {
  const { data: bidsArray, isLoading } = useReadContract({
    ...auctionAlphaContract,
    functionName: "getListOfBids",
    args: [auctionId],
    query: {
      refetchInterval: 5000,
    },
  });

  useEffect(() => {
    const handleResize = () => {
      const content = document.querySelector(".tbl-content");
      const table = document.querySelector(".tbl-content table");
      if (content && table) {
        const scrollWidth = content.clientWidth - table.clientWidth;
        const header = document.querySelector(".tbl-header");
        if (header) {
          (header as HTMLElement).style.paddingRight = `${scrollWidth}px`;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return <div className="text-center text-white my-8">Loading bid history...</div>;
  }

  if (!bidsArray || bidsArray.length === 0) {
    return <div className="text-center text-white my-8">No bids have been placed yet</div>;
  }

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString("it-IT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <section className="m-12">
      <h1 className="text-3xl text-white font-bold text-center mb-4">Bid history</h1>

      <div className="relative">
        <div className="tbl-header rounded-t-xl bg-darkPurple">
          <table className="w-full table-fixed">
            <thead>
              <tr>
                <th className="px-4 py-5 text-left font-medium text-xs text-white uppercase">Address</th>
                <th className="px-4 py-5 text-left font-medium text-xs text-white uppercase">Bid Amount</th>
                <th className="px-4 py-5 text-left font-medium text-xs text-white uppercase">Timestamp</th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="tbl-content h-[300px] overflow-x-auto border border-white/30">
          <table className="w-full table-fixed">
            <tbody>
              {[...bidsArray].reverse().map((bid: Bid, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-4 text-left align-middle font-light text-xs text-white border-b border-white/10">
                    {formatAddress(bid.bidder)}
                  </td>
                  <td className="px-4 py-4 text-left align-middle font-light text-xs text-white border-b border-white/10">
                    {formatEther(bid.amount)} ETH
                  </td>
                  <td className="px-4 py-4 text-left align-middle font-light text-xs text-white border-b border-white/10">
                    {formatTimestamp(bid.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default StyledTable;
