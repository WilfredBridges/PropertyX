import React, { useState } from "react";

export default function Bond({ listing }) {
  const [purchasePrice, setPurchasePrice] = useState(listing.regularPrice);
  const [yearsToPay, setYearsToPay] = useState(20);
  const [interestRate, setInterestRate] = useState(11.75);
  const [deposit, setDeposit] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const calculateBond = () => {
    const r = interestRate / 100 / 12;
    const n = yearsToPay * 12;
    const payment =
      ((purchasePrice - deposit) * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    setMonthlyPayment(payment);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Bond Calculator</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="purchasePrice" className="block text-lg font-semibold text-gray-700">
              Purchase Price:
            </label>
            <input
              type="text"
              id="purchasePrice"
              value={`R ${purchasePrice.toLocaleString()}`}
              onChange={(e) => setPurchasePrice(parseFloat(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="deposit" className="block text-lg font-semibold text-gray-700">
              Deposit (Optional):
            </label>
            <input
              type="number"
              id="deposit"
              value={deposit}
              onChange={(e) => setDeposit(parseFloat(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="interestRate" className="block text-lg font-semibold text-gray-700">
              Interest Rate:
            </label>
            <input
              type="number"
              id="interestRate"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="yearsToPay" className="block text-lg font-semibold text-gray-700">
              Loan Term:
            </label>
            <input
              type="number"
              id="yearsToPay"
              value={yearsToPay}
              onChange={(e) => setYearsToPay(parseInt(e.target.value, 10))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col items-start">
            <label className="text-lg font-semibold text-gray-700">Monthly Repayment:</label>
            <span className="text-xl font-bold">R {monthlyPayment.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </div>
          <div className="flex flex-col items-start">
            <label className="text-lg font-semibold text-gray-700">Total Once-off Costs:</label>
            <span className="text-xl font-bold">R 80,395</span> {/* Static value for example */}
          </div>
          <div className="flex flex-col items-start">
            <label className="text-lg font-semibold text-gray-700">Min Gross Monthly Income:</label>
            <span className="text-xl font-bold">R 45,118</span> {/* Static value for example */}
          </div>
          <button
            onClick={calculateBond}
            className="px-6 py-2 bg-blue-600 text-white font-bold uppercase rounded-lg shadow hover:bg-blue-700"
          >
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
}