import React from "react"

export default function Search() {
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen" value='Search'>
        <form className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
                <label className="whitespace-nowrap font-semibold">Search Term:</label>
                <input type="text" 
                id="searchTerm"
                placeholder="Search..."
                className="border p-3 rounded-lg w-full"
                />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <label className="font-semibold">Type:</label>
                <div className="flex gap-2">
                    <input type="checkbox" id="all" className="w-5"/>
                    <span>Rent & Sale</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="rent" className="w-5"/>
                    <span>Rent</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="sale" className="w-5"/>
                    <span>For Sale</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="offer" className="w-5"/>
                    <span>Offer</span>
                </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <label className="font-semibold">Amenities:</label>
                <div className="flex gap-2">
                    <input type="checkbox" id="parking" className="w-5"/>
                    <span>Parking</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="furnished" className="w-5"/>
                    <span>Furnished</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <label className="font-semibold">Sort:</label>
                <select name="sort" id="sort_order" className="border border-slate-300 p-3 rounded-lg">
                    <option value="">Price high to low</option>
                    <option value="">Price low to high</option>
                    <option value="">Latest</option>
                    <option value="">Oldest</option>
                </select>
            </div>
            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85">Search</button>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold border-b p-3 mt-5 mb-3 text-slate-700">
            Search Results:
        </h1>
      </div>
    </div>
  )
}