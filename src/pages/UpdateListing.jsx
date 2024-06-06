import { useState, useRef, useEffect } from "react" 
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { app } from "../firebase"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Loader } from "@googlemaps/js-api-loader"
import { useParams } from "react-router-dom"

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const params = useParams();
  const [files, setFiles] = useState([])
  const addressInputRef = useRef(null)
  const [formData, setFormData] = useState({
    imageUrls: [],
    videoUrl: "",
    name: "",
    description: "",
    address: "",
    city: "",
    subburb: "",
    long: "",
    lat: "",
    type: "rent",
    propertyType: "",
    propertySize: 0,
    buildingSize: 0,
    bedrooms: 1,
    bathrooms: 1,
    reception: 1,
    garages: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    sold: false,
    parking: false,
    furnished: false,
    pool: false,
    aircon: false,
    balcony: false,
    misc: [],
  })
  const [imageUploadError, setImageUploadError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("property-details")

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData({ ...formData, ...data });
    };
    fetchListing();
  }, [params.listingId]);

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 21) {
      setUploading(true)
      setImageUploadError(false)
      const promises = []

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]))
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          })
          setImageUploadError(false)
          setUploading(false)
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)")
          setUploading(false)
        })
    } else {
      setImageUploadError("You can only upload 20 images per listing")
      setUploading(false)
    }
  }

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        }
      )
    })
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    })
  }

  // Update the handling of the misc property in the handleChange function
const handleChange = (e) => {
  const { id, value, checked, type } = e.target;
  const isCheckbox = type === 'checkbox';
  if (id === "misc") {
      setFormData({
          ...formData,
          misc: value.split(",").map((item) => item),
      });
  } else {
      setFormData({
          ...formData,
          [id]: isCheckbox ? checked : value,
          videoUrl: id === "videoUrl" ? value : formData.videoUrl
      });
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image")
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price")
      setLoading(true)
      setError(false)
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
          videoUrl: formData.videoUrl,
        }),
      })
      const data = await res.json()
      setLoading(false)
      if (data.success === false) {
        setError(data.message)
      }
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["places"],
  })

  loader.load().then(() => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      addressInputRef.current
    )
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (!place.geometry) {
        console.error("Autocomplete's returned place contains no geometry")
        return
      }
      const location = place.geometry.location
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: place.formatted_address,
        long: location.lng().toString(),
        lat: location.lat().toString(),
        subburb: place.address_components.find((component) =>
          component.types.includes("locality")
        ).long_name,
        city: place.address_components.find((component) =>
          component.types.includes("postal_town")
        ).long_name,
      }))
    })
  })

  return (
    <main>
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      
        <div className="flex justify-center">
          <div className="flex space-x-4">
            <button
              onClick={() => handleTabClick("property-details")}
              className={`${
                activeTab === "property-details" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              } py-2 px-4 rounded mr-2`}
            >
              Description
            </button>
            <button
              onClick={() => handleTabClick("property-description")}
              className={`${
                activeTab === "property-description" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              } py-2 px-4 rounded mr-2`}
            >
              Features
            </button>
            <button
              onClick={() => handleTabClick("property-media")}
              className={`${
                activeTab === "property-media" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              } py-2 px-4 rounded mr-2`}
            >
              Media
            </button>
            <button
              onClick={() => handleTabClick("property-location")}
              className={`${
                activeTab === "property-location" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              } py-2 px-4 rounded mr-2`}
            >
              Price
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
        <div className="flex justify-center p-4 w-full lg:w-3/4 mx-auto">
          {activeTab === "property-details" && (
            <div className="flex flex-col gap-4 flex-1">
              <input
                type="text"
                placeholder="Title"
                className="border p-3 rounded-lg"
                id="name"
                maxLength="62"
                minLength="10"
                required
                onChange={handleChange}
                value={formData.name}
              />
              <select
                placeholder=""
                className="border p-3 rounded-lg"
                id="propertyType"
                required
                onChange={handleChange}
                value={formData.propertyType}
              >
                <option value="">Select Property Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment/Flat</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Vacant Land</option>
                <option value="other">Other</option>
              </select>

              <textarea
                type="text"
                placeholder="Description"
                className="border p-3 rounded-lg h-48"
                id="description"
                required
                onChange={handleChange}
                value={formData.description}
              />
              <input
                type="text"
                placeholder="Address"
                className="border p-3 rounded-lg"
                id="address"
                required
                onChange={handleChange}
                value={formData.address}
                ref={addressInputRef}
              />
              <input
                type="text"
                placeholder="Suburb"
                className="border p-3 rounded-lg"
                id="subburb"
                required
                onChange={handleChange}
                value={formData.subburb}
              />
              <input
                type="text"
                placeholder="City"
                className="border p-3 rounded-lg"
                id="city"
                required
                onChange={handleChange}
                value={formData.city}
              />

              <div className="flex gap-6">
                <input
                  type="string"
                  placeholder="Longitude"
                  className="border p-3 rounded-lg"
                  id="long"
                  required
                  onChange={handleChange}
                  value={formData.long}
                />
                <input
                  type="string"
                  placeholder="Latitude"
                  className="border p-3 rounded-lg"
                  id="lat"
                  required
                  onChange={handleChange}
                  value={formData.lat}
                />
              </div>
            </div>
          )}

{activeTab === "property-description" && (
  <div>
    <div className="flex flex-wrap gap-6 justify-center items-center p-5">
    <div>
      <input
        type="number"
        className="p-3 border border-gray-300 rounded-md"
        id="propertySize"
        onChange={handleChange}
        value={formData.propertySize}
      />
      <p>Property Size (sqm)</p>
    </div>
    <div>
      <input
        type="number"
        className="p-3 border border-gray-300 rounded-md"
        id="buildingSize"
        onChange={handleChange}
        value={formData.buildingSize}
      />
      <p>Building Size(sqm)</p>
    </div>
    </div>
    <div className="flex flex-wrap gap-6 justify-center items-center p-5">
      <div className="flex items-center gap-2">
        <input
          type="number"
          id="bedrooms"
          min="1"
          max="10"
          required
          className="p-3 border border-gray-300 rounded-lg"
          onChange={handleChange}
          value={formData.bedrooms}
        />
        <p>Beds</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          id="bathrooms"
          min="1"
          max="10"
          required
          className="p-3 border border-gray-300 rounded-lg"
          onChange={handleChange}
          value={formData.bathrooms}
        />
        <p>Baths</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          id="reception"
          min="1"
          max="10"
          required
          className="p-3 border border-gray-300 rounded-lg"
          onChange={handleChange}
          value={formData.reception}
        />
        <p>Reception Rooms</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          id="garages"
          min="1"
          max="10"
          required
          className="p-3 border border-gray-300 rounded-lg"
          onChange={handleChange}
          value={formData.garages}
        />
        <p>Garages</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-6 justify-center p-5">
      
      <div className="flex gap-2">
        <input
          type="checkbox"
          id="parking"
          className="w-5"
          onChange={handleChange}
          checked={formData.parking}
        />
        <span>Parking spot</span>
      </div>
      <div className="flex gap-2">
        <input
          type="checkbox"
          id="furnished"
          className="w-5"
          onChange={handleChange}
          checked={formData.furnished}
        />
        <span>Furnished</span>
      </div>
      <div className="flex gap-2">
        <input
          type="checkbox"
          id="aircon"
          className="w-5"
          onChange={handleChange}
          checked={formData.aircon}
        />
        <span>Aircon</span>
      </div>
      <div className="flex gap-2">
        <input
          type="checkbox"
          id="balcony"
          className="w-5"
          onChange={handleChange}
          checked={formData.balcony}
        />
        <span>Balcony</span>
      </div>
      <div className="flex gap-2">
        <input
          type="checkbox"
          id="pool"
          className="w-5"
          onChange={handleChange}
          checked={formData.pool}
        />
        <span>Pool</span>
      </div>
      
  </div>
  <div className="flex flex-wrap gap-6 justify-center items-center p-5">
    <div>
      <p className="text-lg font-semibold">Other Features:</p>
      <input
        type="text"
        className="p-3 border border-gray-300 rounded-md"
        id="misc"
        onChange={handleChange}
        value={formData.misc}
        placeholder="Enter features here"
      />
    </div>
    <div>
      <p className="text-sm text-gray-400">(use , to separate)</p>
    </div>
  </div>
  <div className="flex flex-col gap-3 p-5">
    {formData.misc.map((feature, index) => (
      <div key={index}>
        <p>- {feature}</p>
      </div>
    ))}
  </div>
</div>
     

  

)}

{activeTab === "property-media" && (
  <div className="flex flex-col flex-1 gap-4">
    <p className="font-semibold">
      Images:
      <span className="font-normal text-gray-600 ml-2">
        The first image will be the cover (max 20)
      </span>
    </p>
    <div className="flex gap-4">
      <input
        onChange={(e) => setFiles(e.target.files)}
        className="p-3 border border-gray-300 rounded w-full"
        type="file"
        id="images"
        accept="image/*"
        multiple
      />
      <button
        type="button"
        disabled={uploading}
        onClick={handleImageSubmit}
        className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
    <p className="text-red-700 text-sm">
      {imageUploadError && imageUploadError}
    </p>
    <div className="grid grid-cols-2 gap-4">
      {formData.imageUrls.map((url, index) => (
        <div key={index} className="relative">
          <img
            src={url}
            alt={`Uploaded Image ${index + 1}`}
            className="w-full h-auto rounded-lg"
          />
          <button
            onClick={() => handleRemoveImage(index)}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg"
          >
            <span>X</span>
          </button>
        </div>
      ))}
    </div>
    <div className="">
      <p>
        <span className="font-semibold">Video:</span> Copy your Youtube
        video link and paste it here.
        <input
          type="text"
          id="videoUrl"
          className="p-3 border border-gray-300 rounded w-full"
          onChange={handleChange}
          value={formData.videoUrl}
          placeholder="Youtube URL"
        />
      </p>
    </div>
  </div>
)}

{activeTab === "property-location" && (
  <div>
    <div className="flex justify-center gap-4 p-5">
    <div className="flex gap-2">
        <input
          type="checkbox"
          id="sale"
          className="w-5"
          onChange={handleChange}
          checked={formData.type === "sale"}
        />
        <span>For sale</span>
      </div>
      <div className="flex gap-2">
        <input
          type="checkbox"
          id="rent"
          className="w-5"
          onChange={handleChange}
          checked={formData.type === "rent"}
        />
        <span>For rent</span>
      </div>
      <div className="flex gap-2">
        <input
          type="checkbox"
          id="offer"
          className="w-5"
          onChange={handleChange}
          checked={formData.offer}
        />
              <span>Offer</span>
    </div>
    </div>
    <div className="flex gap-4 p-5">
    <div className="flex items-center gap-2">
      <input
        type="number"
        id="regularPrice"
        min="50"
        max="10000000"
        required
        className="p-3 border border-gray-300 rounded-lg"
        onChange={handleChange}
        value={formData.regularPrice}
      />
      <div className="flex flex-col items-center">
        <p>Regular price</p>
        {formData.type === "rent" && (
          <span className="text-xs">(R / month)</span>
        )}
      </div>
      
    </div>
    {formData.offer && (
      <div className="flex items-center gap-2">
        <input
          type="number"
          id="discountPrice"
          min="0"
          max="10000000"
          required
          className="p-3 border border-gray-300 rounded-lg"
          onChange={handleChange}
          value={formData.discountPrice}
        />
        <div className="flex flex-col items-center">
          <p>Discounted price</p>
          {formData.type === "rent" && (
            <span className="text-xs">(R / month)</span>
          )}
        </div>
        
        
      </div>
      
      
    )}
    </div>
    <div className="p-5 flex justify-center gap-4 bg-slate-200 border rounded-lg">
      <span className="font-semibold text-lg">Mark as Sold</span>
      <input type="checkbox" 
      id="sold"
      onChange={handleChange}
      checked={formData.sold}
      className="p-3 border border-red-600 rounded-lg w-5"
      
      /> 
    </div>

  </div>
)}
        </div>
        <div className="flex flex-col justify-center mt-5 lg:items-center">
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white  rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mb-5"
          >
            {loading ? "Updating..." : "Update listing"}
          </button>
          {error && <p className="text-red-700 text-sm text-center">{error}</p>}
        </div>
      </form>
    </main>
  )
}
