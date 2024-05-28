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
      <h1 className="text-2xl font-bold text-center my-4">Agents</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent._id} agent={agent} />
        ))}
      </div>
    </div>
  );
};

export default AgentList;