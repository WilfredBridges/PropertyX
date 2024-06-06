import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ListingItem from "../components/ListingItem"
import { RadioGroup, RadioButton } from "react-radio-buttons"

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
    minPrice: 0,
    maxPrice: 100000000,
    bedroomsRange: "any",
    bathroomsRange: "any",
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
    const minPriceFromUrl = urlParams.get("minPrice")
    const maxPriceFromUrl = urlParams.get("maxPrice")
    const bedroomsRangeFromUrl = urlParams.get("bedroomsRange")
    const bathroomsRangeFromUrl = urlParams.get("bathroomsRange")

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      soldFromUrl ||
      propertyTypeFromUrl ||
      minPriceFromUrl ||
      maxPriceFromUrl ||
      bedroomsRangeFromUrl ||
      bathroomsRangeFromUrl
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
        minPrice: minPriceFromUrl || 0,
        maxPrice: maxPriceFromUrl || 100000000,
        bedroomsRange: bedroomsRangeFromUrl || "any",
        bathroomsRange: bathroomsRangeFromUrl || "any",
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
    console.log("Before update:", sidebardata)
    const { id, value, checked, type, name } = e.target

    // Handle checkbox changes
    if (["parking", "furnished", "offer", "sold"].includes(id)) {
      setSidebardata((prev) => ({ ...prev, [id]: checked }))
    }
    // Handle changes for radio buttons and select inputs
    else if (type === "radio" || type === "select-one") {
      setSidebardata((prev) => ({ ...prev, [name]: value }))
    }
    // Handle changes for text inputs and other inputs
    else {
      setSidebardata((prev) => ({ ...prev, [id]: value }))
    }

    if (id === "sale" || id === "rent" || id === "all") {
      setSidebardata((prev) => ({ ...prev, type: id }))
    }

    // Special handling for split values like sort_order
    if (id === "sort_order") {
      const [sort, order] = value.split("_")
      setSidebardata((prev) => ({ ...prev, sort, order }))
    }
    console.log("After update:", sidebardata)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Submitting with state:", sidebardata)
    const urlParams = new URLSearchParams()

    // Helper function to add parameters only if they have meaningful values
    const addParam = (key, value, defaultValue) => {
      if (
        value !== defaultValue ||
        (defaultValue === 0 && value === 0) ||
        (defaultValue === false && value === false)
      ) {
        urlParams.set(key, value.toString()) // Ensure conversion to string if needed
      }
    }

    // Add parameters, checking against default values where appropriate
    addParam("searchTerm", sidebardata.searchTerm, "")
    addParam("type", sidebardata.type, "all")
    addParam("parking", sidebardata.parking, false)
    addParam("furnished", sidebardata.furnished, false)
    addParam("offer", sidebardata.offer, false)
    addParam("sort", sidebardata.sort, "created_at")
    addParam("order", sidebardata.order, "desc")
    addParam("sold", sidebardata.sold, false)
    addParam("propertyType", sidebardata.propertyType, "all")
    addParam("minPrice", sidebardata.minPrice, 0)
    addParam("maxPrice", sidebardata.maxPrice, 100000000)
    addParam("bedroomsRange", sidebardata.bedroomsRange, "any")
    addParam("bathroomsRange", sidebardata.bathroomsRange, "any")

    // Convert URLSearchParams to string and navigate
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
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen">
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
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Listing Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                name="type"
                value="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span>All</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                name="type"
                value="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>To Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                name="type"
                value="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>For Sale</span>
            </div>
            
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Property Status: </label>
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
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sold"
                onChange={handleChange}
                checked={sidebardata.sold}
                className="w-5"
              />
              <span>Sold</span>
            </div>
          </div>
          <div>
            <label className="font-semibold">Property Type: </label>
            <select
              onChange={handleChange}
              defaultValue={"all"}
              name="propertyType"
              id="propertyType"
              className="border rounded-lg p-3"
            >
              <option value="all">All Property Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment/Flat</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Vacant Land</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Price Range: </label>
            <select
              onChange={handleChange}
              defaultValue={"0"}
              name="minPrice"
              id="minPrice"
              className="border rounded-lg p-3"
            >
              <option value="0">Min Price</option>
              <option value="0">0</option>
              <option value="50000">50,000</option>
              <option value="100000">100,000</option>
              <option value="150000">150,000</option>
              <option value="200000">200,000</option>
              <option value="250000">250,000</option>
              <option value="500000">500,000</option>
              <option value="1000000">1,000,000</option>
              <option value="1500000">1,500,000</option>
              <option value="2000000">2,000,000</option>
              <option value="3000000">3,000,000</option>
            </select>
            <select
              onChange={handleChange}
              defaultValue={"10000000"}
              name="maxPrice"
              id="maxPrice"
              className="border rounded-lg p-3 "
            >
              <option value="10000000">Max Price</option>
              <option value="500000">500,000</option>
              <option value="1000000">1,000,000</option>
              <option value="1500000">1,500,000</option>
              <option value="2000000">2,000,000</option>
              <option value="3000000">3,000,000"</option>
              <option value="4000000">4,000,000</option>
              <option value="5000000">5,000,000</option>
              <option value="7500000">7,500,000</option>
              <option value="10000000">10,000,000</option>
              <option value="20000000">20,000,000</option>
            </select>
          </div>

          <div>
  <label className="font-semibold">Bedrooms</label>
  <div className="flex gap-2">
    {['any', '1+', '2+', '3+', '4+', '5+'].map((value) => (
      <label key={value} className="radio-container">
        <input
          type="radio"
          name="bedroomsRange"
          value={value}
          checked={sidebardata.bedroomsRange === value}
          onChange={handleChange}
          className="hidden"
        />
        <span className={`radio-label ${sidebardata.bedroomsRange === value ? 'selected' : ''}`}>{value}</span>
      </label>
    ))}
  </div>
</div>

<div>
  <label className="font-semibold">Bathrooms</label>
  <div className="flex gap-2">
    {['any', '1+', '2+', '3+', '4+', '5+'].map((value) => (
      <label key={value} className="radio-container">
        <input
          type="radio"
          name="bathroomsRange"
          value={value}
          checked={sidebardata.bathroomsRange === value}
          onChange={handleChange}
          className="hidden"
        />
        <span className={`radio-label ${sidebardata.bathroomsRange === value ? 'selected' : ''}`}>{value}</span>
      </label>
    ))}
  </div>
</div>

          
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to hight</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
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
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
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
