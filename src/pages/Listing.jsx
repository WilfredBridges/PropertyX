import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore from "swiper"
import { useSelector } from "react-redux"
import { Navigation, FreeMode, Thumbs } from "swiper/modules"
import "swiper/css/bundle"
import {
  FaBath,
  FaBed,
  FaCar,
  FaHouzz,
  FaLocationArrow,
  FaMapMarkedAlt,
  FaSwimmingPool,
} from "react-icons/fa"
import { WiThermometer } from "react-icons/wi"
import Contact from "../components/Contact"
import { FaChair } from "react-icons/fa"
import Bond from "../components/Bond"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet";
import { Loader } from "@googlemaps/js-api-loader"

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation])
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [contact, setContact] = useState(false)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const params = useParams()
  const { currentUser } = useSelector((state) => state.user)
  const [nearbyPlaces, setNearbyPlaces] = useState([])

  const mainMarkerIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    
  });

  const placesMarkerIcon = new L.Icon({
    iconUrl: "https://img.icons8.com/officel/30/000000/marker.png",
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/listing/get/${params.listingId}`)
        const data = await res.json()
        if (data.success === false) {
          setError(true)
          setLoading(false)
          return
        }
        setListing(data)
        setLoading(false)
        setError(false)
      } catch (error) {
        setError(true)
        setLoading(false)
      }
    }
    fetchListing()
  }, [params.listingId])

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"],
    })

    loader.load().then(() => {
      const map = new window.google.maps.Map(document.createElement("div"), {
        center: { lat: parseFloat(listing.lat), lng: parseFloat(listing.long) },
        zoom: 15,
      })

      const service = new window.google.maps.places.PlacesService(map)
      const request = {
        location: {
          lat: parseFloat(listing.lat),
          lng: parseFloat(listing.long),
        },
        radius: "2000",
        type: ["restaurant"],
        maxResults: 10,
      }

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setNearbyPlaces(results)
        }
      })
    })
  }, [listing])

  console.log(nearbyPlaces)

  if (loading) return <p className="text-center my-7 text-2xl">Loading...</p>
  if (error)
    return <p className="text-center my-7 text-2xl">Something went wrong...</p>

  return (
    <main className="">
      {listing && (
        <>
          <div className="flex flex-col w-full items-center mt-8 p-5 ">
            <h1 className="text-4xl font-bold text-center text-slate-700">
              {listing.bedrooms} Bedroom {listing.propertyType}{" "}
              {listing.type === "sale" ? "for Sale" : "to Rent"} in{" "}
              {listing.subburb}, {listing.city}
            </h1>
            <p className="text-2xl text-slate-500 font-semibold flex gap-4 items-center mt-5">
              <span className=" font-bold text-slate-700">
                R{parseInt(listing.regularPrice).toLocaleString()}
              </span>{" "}
              | <FaBed />
              {listing.bedrooms} <FaBath />
              {listing.bathrooms} <FaCar />
              {listing.garages}
            </p>
          </div>
          <div className="flex flex-col lg:flex-row w-full ">
            <div className="lg:w-2/3 p-4 bg-white m-6">
              <div className="w-full">
                <Swiper
                  style={{
                    "--swiper-navigation-color": "#000",
                    "--swiper-pagination-color": "#000",
                  }}
                  loop={true}
                  spaceBetween={10}
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper2"
                >
                  {listing.imageUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={url}
                        alt="Listing"
                        className="w-full h-80 object-cover overflow-hidden"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Swiper
                  onSwiper={setThumbsSwiper}
                  loop={true}
                  spaceBetween={2}
                  slidesPerView={6}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper mt-5"
                >
                  {listing.imageUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={url}
                        alt="Thumbnail"
                        className="sm:w-full sm:h-40 w-20 h-20 object-cover overflow-hidden"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="flex flex-col w-full text-center mt-7">
                <h3 className="text-2xl text-slate-700 font-semibold">
                  {listing.name}
                </h3>
                <p className="mt-4 text-start">{listing.description}</p>
              </div>
              <div className="mt-8">
                <h5 className="text-slate-700 font-bold">Property Details:</h5>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <p>
                    <FaBed className="inline" /> {listing.bedrooms} Bedrooms
                  </p>

                  {listing.pool && (
                    <p>
                      <FaSwimmingPool className="inline" /> Pool
                    </p>
                  )}

                  <p>
                    <FaBath className="inline" /> {listing.bathrooms} Bathrooms
                  </p>
                  <p>
                    <FaHouzz className="inline" /> {listing.reception} Reception
                    rooms
                  </p>
                  <p>
                    <FaCar className="inline" /> {listing.garages} Garages
                  </p>
                  {listing.furnished && (
                    <p>
                      <FaChair className="inline" /> Furnished
                    </p>
                  )}
                  {listing.aircon && (
                    <p>
                      <WiThermometer className="inline text-lg" /> Aircon
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-8">
                <h5 className="text-slate-700 font-bold">Location:</h5>
                <div className="mt-4 border-4 flex justify-between">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-slate-700 font-bold">Address:</h3>
                    <div className="flex gap-2 items-center p-3">
                      <FaLocationArrow className="inline text-slate-500 hover:text-blue-500" />
                      <p className="text-start">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            listing.address
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-blue-500 font-semibold"
                        >
                          {listing.address}, {listing.city}, {listing.subburb}
                        </a>
                      </p>
                    </div>
                    <div className="">
                      <h3 className="text-slate-700 font-bold">
                        Nearby Places:
                      </h3>
                      <ul>
                        {nearbyPlaces.slice(0, 6).map((place, index) => (
                          <li
                            key={index}
                            className="text-slate-500  font-semibold p-3"
                          >
                            - {place.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <MapContainer
                    center={[listing.lat, listing.long]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "400px", width: "50%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[listing.lat, listing.long]} icon={mainMarkerIcon}>
                      <Popup>
                        {listing.name} <br />
                        {listing.address} <br /> R {listing.regularPrice} <br />
                        <br />
                        <img
                          src={listing.imageUrls[0]}
                          alt={listing.name}
                          style={{ width: "100%" }}
                        />{" "}
                        <br />
                      </Popup>
                    </Marker>
                    {nearbyPlaces.map((place, index) => {
                      const { lat, lng } = place.geometry.location
                      if (lat && lng) {
                        return (
                          <Marker key={index} position={[lat(), lng()]} icon={placesMarkerIcon}>
                            <Popup>
                              {place.name} <br />
                              {place.vicinity} <br />
                            </Popup>
                          </Marker>
                        )
                      } else {
                        return null // Skip rendering if lat and lng are missing
                      }
                    })}
                  </MapContainer>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 mt-5">
              <Contact listing={listing} />
              {listing.type !== "rent" && <Bond listing={listing} />}
            </div>
          </div>
        </>
      )}
    </main>
  )
}
