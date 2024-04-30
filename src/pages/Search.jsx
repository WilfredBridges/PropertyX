import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Search() {
    const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  })
  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState([])

  

  useEffect(() => {
      const urlParams = new URLSearchParams(location.search)
      const searchTermFromUrl = urlParams.get("searchTerm")
      const typeFromUrl = urlParams.get("type")
      const parkingFromUrl = urlParams.get("parking")
      const furnishedFromUrl = urlParams.get("furnished")
      const offerFromUrl = urlParams.get("offer")
      const sortFromUrl = urlParams.get("sort")
      const orderFromUrl = urlParams.get("order")

      if (
        searchTermFromUrl ||
        typeFromUrl ||
        parkingFromUrl ||
        furnishedFromUrl ||
        offerFromUrl ||
        sortFromUrl ||
        orderFromUrl
        ) {
          setSidebardata({
            ...sidebardata,
            searchTerm: searchTermFromUrl || "",
            type: typeFromUrl || "all",
            parking: parkingFromUrl === "true" ? true : false,
            furnished: furnishedFromUrl === "true" ? true : false,
            offer: offerFromUrl === "true" ? true : false,
            sort: sortFromUrl || "created_at",
            order: orderFromUrl || "desc",
          })
      }

      const fetchListings = async () => {
          setLoading(true);
          const searchQuery = urlParams.toString();
          const response = await fetch(`/api/listing/get?${searchQuery}`);
          const data = await response.json();
          setListings(data);
          setLoading(false);
      }

      fetchListings()

  }, [location.search])

  

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "sale" ||
      e.target.id === "rent"
    ) {
      setSidebardata({
        ...sidebardata,
        type: e.target.id,
      })
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false,
      })
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({
        ...sidebardata,
        searchTerm: e.target.value,
      })
    }

    if (e.target.id === "sort_order") {
        const sort = e.target.value.split("-")[0] || "created_at";
        const order = e.target.value.split("-")[1] || "desc";

        setSidebardata({
            ...sidebardata,
            sort,
            order
        })
        
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);

  }

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <div
        className="p-7 border-b-2 md:border-r-2 md:min-h-screen"
        value="Search"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              value={sidebardata.searchTerm}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>For Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-semibold">Sort:</label>
            <select
              name="sort"
              id="sort_order"
              className="border border-slate-300 p-3 rounded-lg"
              onChange={handleChange}
              defaultValuealue={"created_at_desc"}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="created_at_desc">Latest</option>
              <option value="created_at_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85">
            Search
          </button>
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
