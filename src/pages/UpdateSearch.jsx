import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ListingItem from "../components/ListingItem"

export default function Search() {
  const navigate = useNavigate()
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
    sold: false,
    propertyType: "all",
  })


  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState([])
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get("searchTerm")
    const typeFromUrl = urlParams.get("type")
    const parkingFromUrl = urlParams.get("parking")
    const furnishedFromUrl = urlParams.get("furnished")
    const offerFromUrl = urlParams.get("offer")
    const sortFromUrl = urlParams.get("sort")
    const orderFromUrl = urlParams.get("order")
    const soldFromUrl = urlParams.get("sold")
    const propertyTypeFromUrl = urlParams.get("propertyType")

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      soldFromUrl ||
      propertyTypeFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
        sold: soldFromUrl === "true" ? true : false,
        propertyType: propertyTypeFromUrl || "house",
      })
    }

    const fetchListings = async () => {
      setLoading(true)
      setShowMore(false)
      const searchQuery = urlParams.toString()
      const res = await fetch(`/api/listing/get?${searchQuery}`)
      const data = await res.json()
      if (data.length > 8) {
        setShowMore(true)
      } else {
        setShowMore(false)
      }
      setListings(data)
      setLoading(false)
    }

    fetchListings()
  }, [location.search])

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id })
    }

    if (e.target.id === "propertyType") {
      setSidebardata({ ...sidebardata, propertyType: e.target.value })
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value })
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      })
    }

    if (e.target.id === "sold") {
      setSidebardata({ ...sidebardata, sold: e.target.checked })
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at"

      const order = e.target.value.split("_")[1] || "desc"

      setSidebardata({ ...sidebardata, sort, order })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams()
    urlParams.set("searchTerm", sidebardata.searchTerm)
    urlParams.set("type", sidebardata.type)
    urlParams.set("parking", sidebardata.parking)
    urlParams.set("furnished", sidebardata.furnished)
    urlParams.set("offer", sidebardata.offer)
    urlParams.set("sort", sidebardata.sort)
    urlParams.set("order", sidebardata.order)
    urlParams.set("sold", sidebardata.sold)
    urlParams.set("propertyType", sidebardata.propertyType)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length
    const startIndex = numberOfListings
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("startIndex", startIndex)
    const searchQuery = urlParams.toString()
    const res = await fetch(`/api/listing/get?${searchQuery}`)
    const data = await res.json()
    if (data.length < 9) {
      setShowMore(false)
    }
    setListings([...listings, ...data])
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="font-semibold">Listing Status:</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  id="all"
                  className="mr-2"
                  onChange={handleChange}
                  checked={sidebardata.type === "all"}
                />
                All
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  id="sale"
                  className="mr-2"
                  onChange={handleChange}
                  checked={sidebardata.type === "sale"}
                />
                For Sale
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  id="rent"
                  className="mr-2"
                  onChange={handleChange}
                  checked={sidebardata.type === "rent"}
                />
                For Rent
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  id="sold"
                  className="mr-2"
                  onChange={handleChange}
                  checked={sidebardata.sold}
                />
                Sold
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <label className="font-semibold">Property Type:</label>
            <div className="flex flex-col gap-2">
                <label className="flex items-center">
                    <input 
                    type="checkbox"
                    id="all"
                    className="mr-2"
                    onChange={handleChange}
                    checked={sidebardata.type === "all"}
                     />
                    All
                </label>
                <label className="flex items-center">
                    <input 
                    type="checkbox"
                    id="house"
                    className="mr-2"
                    onChange={handleChange}
                    checked={sidebardata.type === "houses"}
                     />
                    Houses

                </label>
                <label className="flex items-center">
                    <input 
                    type="checkbox"
                    id="apartment"
                    className="mr-2"
                    onChange={handleChange}
                    checked={sidebardata.type === "apartment"}
                     />
                    Apartment/Flat
                    </label>
            </div>
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          ) : listings.length === 0 ? (
            <p className="text-xl text-slate-700">No listing found!</p>
          ) : (
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))
          )}
          {showMore && (
            <button
              onClick={() => {
                /* Implement show more functionality */
              }}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
