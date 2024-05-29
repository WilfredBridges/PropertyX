import React from "react";
import { Link } from "react-router-dom";

const AgentCard = ({ agent }) => {
  return (
    <Link to={`/agents/${agent._id}`}>
    <div className="bg-white shadow-md rounded-lg p-4 m-4">
      <img src={agent.avatar} alt={agent.username} className="w-32 h-32 rounded-full mx-auto" />
      <h3 className="text-center text-xl font-semibold mt-2">{agent.username}</h3>
      <p className="text-center text-gray-600">{agent.email}</p>
    </div>
    </Link>
  );
};

export default AgentCard;