import { FaSearch } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"

export default function Header() {
  const { currentUser } = useSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set("searchTerm", searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get("searchTerm")
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [location.search])


  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 md:p-6">
        <Link to="/">
          <h1 className="text-white text-md md:text-2xl lg:text-4xl font-bold flex flex-wrap">
            <span className="text-violet-500">Property</span>
            <span className="text-violet-700">X</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className="bg-slate-100 rounded-lg p-2 md:p-3 flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-0 outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600 text-xl cursor-pointer" />
          </button>
          
        </form>
        <ul className="flex space-x-4">
          <Link to="/">
            <li className="text-slate-600 hover:underline hover:shadow-md hidden sm:block">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="text-slate-600 hover:underline hover:shadow-md hidden sm:block">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profile picture"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <li className="text-slate-600 hover:underline hover:shadow-md">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  )
}
