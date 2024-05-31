import React, { useEffect, useState} from 'react'
import { Label, Select } from "flowbite-react";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Toaster, toast } from "sonner";


export default function HomeVolunteer() {
    const [sessions, setSessions] = useState([]);
    const [formData, setFormData] = useState([]);
    const [scanResult, setScanResult] = useState(null);
const [manualSerialNumber, setManualSerialNumber] = useState('');
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

      useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
          qrbox: {
            width: 500,
            height: 500,
          },
          fps: 5,
        });
    
        let isScanning = true;
    
        scanner.render(success, error);
    
        function success(result) {
          if (isScanning) {
            scanner.clear();
            setScanResult(result);
            isScanning = false; // Set isScanning to false to stop further scanning
          }
        }
    
        function error(err) {
          console.warn(err);
        }
      }, []);
    
  return (
   
    <section className="min-h-screen max-w-full bg-gradient-to-r  from-red-800 via-orange-600 to-yellow-400">
      <div className="flex max-w-screen-xl px-4 justify-center items-center py-8 mx-auto">
      <Toaster richColors position="top-center" expand={true} />
        

      <div class="w-sm flex flex-row gap-4 p-6 bg-white rounded-lg dark:bg-gray-800 ">
      <div className="mb-2 block">
        <Label htmlFor="countries" value="Select session" />
      
       <Select id="session" onChange={handleChange} required>
              <option value="">Select Workshop</option>
                {sessions.map((s) => (
                  <option key={s._id} value={s._id}>{s.title}</option>
                ))}
              </Select>
        </div>
        <div>
         <h1>QR Scanning Code</h1>
       {scanResult ? (
        <div>
          <p>Success: {scanResult}</p>
          <p>Serial Number: {scanResult}</p>
        </div>
      ) : (
        <div>
          <div id="reader"></div>
          
        </div>
      )}
        </div>
      </div>
      


       
      </div>
    </section>
  )
}
