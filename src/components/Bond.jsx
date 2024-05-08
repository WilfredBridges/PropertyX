import React, { useState } from "react"

export default function Bond({ listing }) {
  const [purchasePrice, setPurchasePrice] = useState(listing.regularPrice)
  const [yearsToPay, setYearsToPay] = useState(20)
  const [interestRate, setInterestRate] = useState(11.75)
  const [deposit, setDeposit] = useState(0)
  const [monthlyPayment, setMonthlyPayment] = useState(0)

  const calculateBond = () => {
    const r = interestRate / 100 / 12
    const n = yearsToPay * 12
    const payment =
      ((purchasePrice - deposit) * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)
    setMonthlyPayment(payment)
  }

  return (
    <div className="flex flex-col items-center bg-white p-8">
      <h2 className="text-2xl font-bold">Bond Calculator</h2>
      <div className="flex flex-row">
        <div
          id="1"
          className="w-2/3 p-3 flex flex-col justify-start border-r-2 "
        >
          <div className="p-3">
            <label
              htmlFor="purchasePrice"
              className="text-slate-700 font-semibold text-lg"
            >
              Purchase Price:
            </label>
            <input
              type="string"
              id="purchasePrice"
              value={`R ${purchasePrice.toLocaleString()}`}
              onChange={(e) => setPurchasePrice(parseFloat(e.target.value))}
              className="w-full border p-3 rounded-lg bg-slate-100 mb-5"
            />
          </div>
          <div className="">
            <label
              htmlFor="yearsToPay"
              className="text-slate-700 font-semibold text-lg"
            >
              Years to Pay:
            </label>
            <input
              type="number"
              id="yearsToPay"
              value={yearsToPay}
              onChange={(e) => setYearsToPay(e.target.value)}
              className="w-full border p-3 rounded-lg bg-slate-100 mb-5"
            />
          </div>
          <div className="">
            <label
              htmlFor="interestRate"
              className="text-slate-700 font-semibold text-lg"
            >
              Interest Rate:
            </label>
            <input
              type="number"
              id="interestRate"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full border p-3 rounded-lg bg-slate-100 mb-5"
            />
          </div>
          <div className="">
            <label
              htmlFor="deposit"
              className="text-slate-700 font-semibold text-lg"
            >
              Deposit:
            </label>
            <input
              type="number"
              id="deposit"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              className="w-full border p-3 rounded-lg bg-slate-100 mb-5"
            />
          </div>
        </div>
        <div id="2" className="w-1/2 p-5 flex">
          <p className="text-slate-700 font-semibold text-lg flex flex-col">
            Monthly Payment:
            <span className="text-xl border-4 border-violet-700 px-2 p-3">R {monthlyPayment.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </p>
        </div>
      </div>

      <button
        onClick={calculateBond}
        className="w-40 border p-3 rounded-lg bg-slate-700 mb-5 text-white uppercase"
      >
        Calculate
      </button>
    </div>
  )
}
