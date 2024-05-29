import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ListingItem from "../components/ListingItem"

const Agent = () => {
  const [agent, setAgent] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [listingsError, setListingsError] = useState("")
  const { agentId } = useParams()

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`/api/user/${agentId}`)
        const data = await response.json()
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch agent details")
        setAgent(data)
      } catch (err) {
        setError(err.message)
      }
    }

    const fetchListings = async () => {
      try {
        const response = await fetch(`/api/user/listings/${agentId}`)
        const data = await response.json()
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch listings")
        if (data.length === 0) {
          setListingsError("No listings found for this agent.")
          return
        }
        setListings(data)
      } catch (err) {
        setListingsError(err.message)
      }
    }

    fetchAgent().then(() => {
      fetchListings().finally(() => setLoading(false))
    })
  }, [agentId])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="container mx-auto px-4">
      {agent && (
        <>
        <div className="flex items-center flex-col lg:flex-row justify-center gap-8 py-12 text-wrap">
        <img
              src={agent.avatar}
              alt={agent.username}
              className="w-full lg:w-64 h-auto lg:h-96 rounded-lg object-cover"
            />
            <div className="text-center lg:text-left mt-4 lg:mt-0">
              <h1 className="text-5xl font-bold mb-4">{agent.username}</h1>
              <h4 className="text-2xl mb-4">{agent.role}</h4>
              <p className="text-lg mb-2">
                <span className="font-bold">Cell:</span> {agent.cellNumber}
              </p>
              <p className="text-lg">{agent.email}</p>
            </div>
        </div>
        <hr className="my-8 border-gray-300" />
        <div className="">
          <h2 className="text-2xl font-bold mb-4 ">About {agent.username}</h2>
          <h6 className="text-lg font-bold mb-2">Overview</h6>
          <p className="text-lg w-80vw mx-auto">
             {agent.about}
          </p>
          <h6 className="text-lg font-bold mt-4 mb-2">Qualifications</h6>
          <p className="text-lg w-80vw mx-auto">{agent.qualifications}</p>
        </div>
        <hr className="my-8 border-gray-300"/>
      </>
      )}
      <div className="mt-6">
        <h2 className="text-2xl font-bold my-8">
          Listings by {agent?.username}
        </h2>
        <div className="flex flex-wrap my-8 gap-4">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))
          ) : (
            <p>{listingsError}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Agent
