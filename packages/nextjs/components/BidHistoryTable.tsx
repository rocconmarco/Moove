import React from 'react';
import { useState, useEffect } from 'react';

interface TableData {
  address: string;
  bidAmount: string;
  timestamp: string;
}

const StyledTable: React.FC = () => {
  // Esempio di dati
  const sampleData: TableData[] = [{
    address: "0x09213u843yre983bfu",
    bidAmount: "2 ETH",
    timestamp: "78398423798",
  }, {
    address: "0x09234983457heh98983bfu",
    bidAmount: "1.5 ETH",
    timestamp: "78398424568",
  }];

  // Gestione scrollbar
  useEffect(() => {
    const handleResize = () => {
      const content = document.querySelector('.tbl-content');
      const table = document.querySelector('.tbl-content table');
      if (content && table) {
        const scrollWidth = content.clientWidth - table.clientWidth;
        const header = document.querySelector('.tbl-header');
        if (header) {
          (header as HTMLElement).style.paddingRight = `${scrollWidth}px`;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Chiamata iniziale

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="m-12">
      <h1 className="text-3xl text-white font-bold text-center mb-4">
        Bid History
      </h1>
      
      <div className="relative">
        {/* Table Header */}
        <div className="tbl-header rounded-t-xl bg-lightPurple/50">
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
        
        {/* Table Content */}
        <div className="tbl-content h-[300px] overflow-x-auto border border-white/30">
          <table className="w-full table-fixed">
            <tbody>
              {sampleData.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 text-left align-middle font-light text-xs text-white border-b border-white/10">
                    {item.address}
                  </td>
                  <td className="px-4 py-4 text-left align-middle font-light text-xs text-white border-b border-white/10">
                    {item.bidAmount}
                  </td>
                  <td className="px-4 py-4 text-left align-middle font-light text-xs text-white border-b border-white/10">
                    {item.timestamp}
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