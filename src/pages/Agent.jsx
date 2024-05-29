import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

const Agent = () => {
  const [agent, setAgent] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listingsError, setListingsError] = useState('');
  const { agentId } = useParams();

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`/api/user/${agentId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch agent details');
        setAgent(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchListings = async () => {
      try {
        const response = await fetch(`/api/user/listings/${agentId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch listings');
        if (data.length === 0) {
          setListingsError('No listings found for this agent.');
          return;
        }
        setListings(data);
      } catch (err) {
        setListingsError(err.message);
      }
    };

    fetchAgent().then(() => {
      fetchListings().finally(() => setLoading(false));
    });
  }, [agentId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4">
      {agent && (
        <>
          <h1 className="text-2xl font-bold text-center my-4">{agent.username}</h1>
          <div className="text-center">
            <img src={agent.avatar} alt={agent.username} className="w-32 h-32 rounded-full mx-auto" />
            <p className="text-gray-600">{agent.email}</p>
          </div>
        </>
      )}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-center">Listings by {agent?.username}</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {listings.length > 0 ? (
            listings.map((listing) => <ListingItem key={listing._id} listing={listing} />)
          ) : (
            <p>{listingsError}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agent;