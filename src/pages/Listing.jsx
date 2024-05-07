import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore from "swiper"
import { useSelector } from "react-redux"
import { Navigation, FreeMode, Thumbs } from "swiper/modules"
import "swiper/css/bundle"
import {  FaBath, FaBed, FaCar, FaHouzz, FaSwimmingPool } from "react-icons/fa"
import { WiThermometer } from "react-icons/wi";
import Contact from "../components/Contact"
import { FaChair } from "react-icons/fa"

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation])
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [contact, setContact] = useState(false)
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
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
            style={{ '--swiper-navigation-color': '#000', '--swiper-pagination-color': '#000' }}
            loop={true}
            spaceBetween={10}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper2"
          >
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <img src={url} alt="Listing" className="w-full h-80 object-cover overflow-hidden" />
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
                <img src={url} alt="Thumbnail" className="sm:w-full sm:h-40 w-20 h-20 object-cover overflow-hidden" />
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
          </div>
          <div className="lg:w-1/3 mt-5">
            <Contact listing={listing} />
          </div>
        </div>
        </>
      )}
    </main>
  )
}
