import React from "react";
import { Link } from "react-router-dom";

const AgentCard = ({ agent }) => {
  return (
    <Link to={`/agents/${agent._id}`} className="relative block group h-full">
      <div className="relative overflow-hidden bg-black rounded-lg shadow-md h-full flex flex-col">
        <img
          src={agent.avatar}
          alt={agent.username}
          className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-white text-2xl font-bold">{agent.username}</h3>
          <p className="text-white text-sm">{agent.role}</p>
          
  
        </div>
      </div>
    </Link>
  );
};

export default AgentCard;