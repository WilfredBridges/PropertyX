import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null)
  const [message, setMessage] = useState("Hi, I'm interested in this property")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [number, setNumber] = useState("")
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'number') {
      setNumber(value);
    } else if (name === 'message') {
      setMessage(value);
    }
  }



  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`)
        const data = await res.json()
        setLandlord(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchLandlord()
  }, [listing.userRef])

  {!landlord && <div>Loading...</div>}
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2  overflow-hidden lg:ml-2 lg:mr-2 mb-10 p-10 m-1 bg-white">
          <p className="text-center text-xl">
            Contact <span className="font-semibold">{landlord.username.charAt(0).toUpperCase() + landlord.username.slice(1)}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name}</span>
          </p>
          <div className="flex justify-center">
            <img src={landlord.avatar} alt="Agent profile picture" className="rounded-full w-32 h-32"/>
          </div>
          <label htmlFor="">Full Name</label>
          <input type="text" 
            name='name'
            id='name'
            value={name}
            onChange={onChange}
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg bg-slate-100 mb-5"
          />
          <label htmlFor="">Email</label>
          <input type="text"
            name="email"
            id="email"
            value={email}
            onChange={onChange}
            placeholder="Email Address"
            className="w-full border p-3 rounded-lg bg-slate-100 mb-5"
          />
          <label htmlFor="">Contact Number</label>
          <input type="text" 
            name='number'
            id='number'
            value={number}
            onChange={onChange}
            placeholder="Phone Number"
            className="w-full border p-3 rounded-lg bg-slate-100 mb-5"
          />
          <label htmlFor="">Message</label>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg bg-slate-100"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding: ${listing.name}&body=Name: ${name}%0D%0AEmail: ${email}%0D%0APhone: ${number}%0D%0A${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 w-40 mx-auto"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  )
}
