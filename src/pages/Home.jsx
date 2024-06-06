import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import SwiperCore from "swiper"
import "swiper/css/bundle"
import ListingItem from "../components/ListingItem"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

export default function Home() {
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  const [soldListings, setSoldListings] = useState([])
  const [listings, setListings] = useState([])

  const rentIcon = new L.Icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4yIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZmlsbD0iIzAwN2NkYiIgZD0iTTIxNS43IDQ5OS4yQzI2NyA0MzUgMzg0IDI3OS40IDM4NCAxOTJDMzg0IDg2IDI5OCAwIDE5MiAwUzAgODYgMCAxOTJjMCA4Ny40IDExNyAyNDMgMTY4LjMgMzA3LjJjMTIuMyAxNS4zIDM1LjEgMTUuMyA0Ny40IDB6TTE5MiAxMjhhNjQgNjQgMCAxIDEgMCAxMjggNjQgNjQgMCAxIDEgMC0xMjh6Ii8+PC9zdmc+",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  const saleIcon = new L.Icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4yIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZmlsbD0iIzAwZTZhMSIgZD0iTTIxNS43IDQ5OS4yQzI2NyA0MzUgMzg0IDI3OS40IDM4NCAxOTJDMzg0IDg2IDI5OCAwIDE5MiAwUzAgODYgMCAxOTJjMCA4Ny40IDExNyAyNDMgMTY4LjMgMzA3LjJjMTIuMyAxNS4zIDM1LjEgMTUuMyA0Ny40IDB6TTE5MiAxMjhhNjQgNjQgMCAxIDEgMCAxMjggNjQgNjQgMCAxIDEgMC0xMjh6Ii8+PC9zdmc+",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  const soldIcon = new L.Icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4yIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZmlsbD0iI2ZhMDAwMCIgZD0iTTIxNS43IDQ5OS4yQzI2NyA0MzUgMzg0IDI3OS40IDM4NCAxOTJDMzg0IDg2IDI5OCAwIDE5MiAwUzAgODYgMCAxOTJjMCA4Ny40IDExNyAyNDMgMTY4LjMgMzA3LjJjMTIuMyAxNS4zIDM1LjEgMTUuMyA0Ny40IDB6TTE5MiAxMjhhNjQgNjQgMCAxIDEgMCAxMjggNjQgNjQgMCAxIDEgMC0xMjh6Ii8+PC9zdmc+",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
  

  

  SwiperCore.use([Navigation])
  console.log(offerListings)
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/listing/get");
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
    };
  
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
      } catch (error) {
        console.log(error);
      }
    };
  
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
      } catch (error) {
        console.log(error);
      }
    };
  
    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
  
    const fetchSoldListings = async () => {
      try {
        const res = await fetch("/api/listing/get?sold=true&limit=4");
        const data = await res.json();
        setSoldListings(data);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchListings();
    fetchOfferListings();
    fetchRentListings();
    fetchSaleListings();
    fetchSoldListings();
  }, []);

  

  const getMapCenter = (listings) => {
    console.log("Calculating center for listings:", listings)
    if (listings && listings.length > 0) {
      console.log("Using coordinates:", listings[0].lat, listings[0].long)
      return [listings[0].lat, listings[0].long]
    }
    console.log("Defaulting to [40, 0]")
    return [40, 0]
  }

  if (!listings || listings.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Property X is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Map showing sale, rent and sold markers */}

      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h2 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Listings map
        </h2>
        <div className="text-gray-400 text-xs sm:text-sm">
          Click on a marker to see the listing details
        </div>

        <MapContainer
          center={getMapCenter(listings)}
          zoom={10}
          scrollWheelZoom={false}
          style={{ height: "400px", width: "100%", border: "3px solid black", borderRadius: "10px" }}
          
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {rentListings.map((listing) => (
            <Marker
              key={listing._id}
              position={[listing.lat, listing.long]}
              icon={rentIcon}
            >
              <Popup>
                
                {listing.name}
                </Popup>
            </Marker>
          ))}
          {saleListings.map((listing) => (
            <Marker
              key={listing._id}
              position={[listing.lat, listing.long]}
              icon={saleIcon}
            >
              <Popup>{listing.name}</Popup>
            </Marker>
          ))}
          {soldListings.map((listing) => (
            <Marker
              key={listing._id}
              position={[listing.lat, listing.long]}
              icon={soldIcon}
            >
              <Popup>{listing.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* listing results for offer, sale and rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {soldListings && soldListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recently sold
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?sold=true"}
              >
                Show more recently sold
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {soldListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
