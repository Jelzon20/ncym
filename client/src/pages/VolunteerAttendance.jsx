import React, { useEffect, useState} from 'react'
import { Label, Select } from "flowbite-react";


export default function HomeVolunteer() {
    const [sessions, setSessions] = useState([]);
    const [formData, setFormData] = useState([]);
    useEffect(  () => {
        async function getSessions() {
            try {
                const res = await fetch('/api/session/getSessions', {
                  method: 'GET',
                });
                const data = await res.json();
                
                if (res.ok) {
                    setSessions(data.sessions);
                  }
            
              } catch (error) {
                console.log(error.message);
              }
        }
        getSessions();
       
    })

    const handleChange = async (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
        
      };
  return (
    <section id="hero" className=" dark:bg-gray-900 min-h-screen max-w-full bg-gradient-to-r from-red-800 via-orange-600 to-yellow-400">
      {/* bg-hero bg-gradient-to-r from-orange-500 to-yellow-500 bg-gradient-to-r from-orange-400 via-indigo-600 to-yellow-300*/}
      {/* <div className="flex flex-col items-center justify-center py-8 px-4 text-center mx-auto max-w-screen-xl lg:py-16 lg:px-12"> */}

      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-0 lg:grid-cols-12">
      <div className="w-max bg-white">
      <div className="mb-2 block">
        <Label htmlFor="countries" value="Select session" />
      </div>
      <Select id="session" onChange={handleChange} required>
              <option value="">Select Workshop</option>
                {sessions.map((s) => (
                  <option key={s._id} value={s._id}>{s.title}</option>
                ))}
              </Select>
    </div>
      </div>

      
    </section>
  )
}
