import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore from "swiper"
import { useSelector } from "react-redux"
import { Navigation } from "swiper/modules"
import "swiper/css/bundle"
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa"
import Contact from "../components/Contact"

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation])
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [contact, setContact] = useState(false)
  const params = useParams()
  const { currentUser } = useSelector((state) => state.user)

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

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong...</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setCopied(true)
                setTimeout(() => {
                  setCopied(false)
                }, 2000)
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[19%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
              Link Copied
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - R{" "}
              {listing.offer
                ? listing.regularPrice - +listing.discountPrice
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  R{listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p>
              {" "}
              <span className="font-semibold text-black">
                Description -{" "}
              </span>{" "}
              {listing.description}
            </p>
            <ul className="text-sm font-semibold flex flex-wrap gap-4 lg:gap-6 items-center">
              <li className="flex items-center gap-2">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Bedrooms`
                  : "1 Bedroom"}
              </li>
              <li className="flex items-center gap-2">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Bathrooms`
                  : "1 Bathroom"}
              </li>
              <li className="flex items-center gap-2">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No parking"}
              </li>
              <li className="flex items-center gap-2">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Not furnished"}
              </li>
            </ul>
            {(!currentUser || (currentUser && listing.userRef !== currentUser._id)) && !contact && (
                <button onClick={() =>setContact(true)} className="text-white bg-slate-700  text-center p-3 rounded-lg hover:opacity-85">
                Contact Agent
            </button>
            )}
            {contact &&
                <Contact listing={listing}/>
            }
            
          </div>
        </div>
      )}
    </main>
  )
}