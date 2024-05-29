import React, { useEffect, useState } from "react";
import AgentCard from "../components/AgentCard";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/user/");
        const data = await response.json();
        setAgents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) return <p>Loading agents...</p>;
  if (error) return <p>Error loading agents: {error}</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-4 text-gray-800">Meet Our Expert Agents</h1>
      <p className="text-center text-lg text-gray-600 mb-8">
        Our team of dedicated and experienced agents is here to help you find your dream property. With a wealth of knowledge and a passion for real estate, our agents are committed to providing exceptional service and guidance every step of the way.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {agents.map((agent) => (
          <div key={agent._id} className="h-full">
            <AgentCard agent={agent} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentList;