import React from "react"

export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create A Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 p-3 flex-1">
          <input
            type="text"
            placeholder="name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="64"
            minLength="5"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="discription"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-5 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5 " />
              <span>For Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5 " />
              <span>For Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5 " />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5 " />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5 " />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="border border-gray-300 p-3 rounded-lg "
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="border border-gray-300 p-3 rounded-lg "
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                required
                className="border border-gray-300 p-3 rounded-lg "
              />
              <div className="flex flex-col">
                <span>Price</span>
                <span className="text-xs">(R / month)</span>
              </div>
            </div>
            <div className="flex  items-center gap-2">
              <input
                type="number"
                id="discountedPrice"
                min="1"
                required
                className="border border-gray-300 p-3 rounded-lg "
              />
              <div className="flex flex-col">
                <span> Discounted Price</span>
                <span className="text-xs">(R / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4 text-xl">
          <p className="font-semibold">
            Images:
            <span className="text-sm text-gray-500 ml-2">
              The first image will be the cover
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="border p-3 rounded-lg border-gray-400 w-full"
            />
            <button className="p-3 text-green-700 border border-green-700 uppercase  hover:bg-green-700 hover:text-white rounded-lg shadow-lg">
              Upload
            </button>
          </div>
          <button className="uppercase bg-violet-700 text-white rounded-lg p-3 hover:opacity-75 disabled:opacity-75 ">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  )
}
