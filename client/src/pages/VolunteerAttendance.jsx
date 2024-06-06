import React, { useEffect, useState} from 'react'
import { Label, Select, Button, Modal, } from "flowbite-react";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Toaster, toast } from "sonner";
import DownloadBtn from "../components/DownloadBtn";
import DebouncedInput from "../components/DebouncedInput.jsx";
import { SearchIcon } from "../Icons/icons";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import moment from "moment/moment.js";


export default function HomeVolunteer() {
    const [sessions, setSessions] = useState([]);
    const [scanResult, setScanResult] = useState(null);
    const [session, setSession] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [attendeesArray, setAttendeesArray] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [data] = useState(() => [...attendance]);
    const [fileNameDate, setFileNameDate] = useState('');
    const columnHelper = createColumnHelper();
    const [globalFilter, setGlobalFilter] = useState("");


    const columns = [
      columnHelper.accessor(attendance => attendance.dioceseOrOrg , {
        cell: (info) => <span className='mr-10'>{info.getValue()}</span>,
        header: "Diocese",
      }),
      columnHelper.accessor(attendance => attendance.parishOrLocalUnit , {
        cell: (info) => <span className='mr-10'>{info.getValue()}</span>,
        header: "Parish",
      }),
      columnHelper.accessor(attendance => attendance.firstName , {
        cell: (info) => <span className='mr-10'>{info.getValue()}</span>,
        header: "First Name",
      }),
      columnHelper.accessor(attendance => attendance.lastName , {
          cell: (info) => <span className='mr-10'>{info.getValue()}</span>,
          header: "Last Name",
        }),
    ];
    useEffect(() => {
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
       
    },[])


    const handleSessionChange = async (e) => {
      // setWorkshop( e.target.name );
      const sessionId = e.target.value;
      setSession(sessionId)
      setScanResult(null)
    };

    useEffect(() => {
      
      if (session) {
        getAttendance();
      }
     }, [session]);

     const getAttendance = async () => {
      try {
        const res = await fetch(`/api/session/getAttendance/${session}`);
        const data = await res.json();
        if (res.ok) {
          setAttendeesArray(data.attendance[0].attendees);
          setAttendance(data.attendance[0].user_details);
          }
      } catch (error) {
        toast.error(error.message)
      }
    }

      useEffect(() => {
          const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
              width: 1200,
              height: 1200,
            },
            fps: 5,
          });
      
          let isScanning = true;
          scanner.render(success, error);
        
           async function success(result) {
            if (isScanning) {
              scanner.clear();
              setScanResult(result);

              isScanning = false; // Set isScanning to false to stop further scanning

              // checkDuplicate(result);
              if (attendeesArray) {
                const compareResult = attendeesArray.includes(result);
                  if(compareResult) {
                    toast.error('User is already recorded for this session.');
                    return;
                  } else {
                    try {
                      const res = await fetch(`/api/session/addAttendance`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({session: session, userId: result}),
                      });
                      const data = await res.json();
          
                      if (res.ok) {
                        toast.success(data.message);
                        setScanResult(null)
                        getAttendance();  
                        }else{
                          toast.error(data.message)
                          setScanResult(null)
                        }
                  
                    } catch (error) {
                      console.log(error.message);
                    }
                  }
              }
              
              
              
            }
          }
          function error(err) {
            console.warn(err);
          }
      });


      const table = useReactTable({
        data: attendance,
        columns,
        state: {
          globalFilter,
        },
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      });
    
      
      
      useEffect(() => {
        const date = new Date();
        setFileNameDate(moment(date).format('MM/DD/YYYY'));
      }, [attendance]);


  
    
  return (
   
    <section className="min-h-screen max-w-full bg-gradient-to-r  from-red-800 via-orange-600 to-yellow-400">
      <div className="flex flex-col md:flex-row max-w-screen-xl px-4 gap-6  py-8 mx-auto">
      <Toaster richColors position="top-center" expand={true} />
      <div className="w-sm flex flex-col md:flex-row gap-4 p-6 bg-white rounded-lg dark:bg-gray-800 ">
       

        
      <div className="max-w-md">
              <div className="mb-2 block">
                <Label value="Select Workshop" />
              </div>

              <Select id="session" onChange={handleSessionChange} required>
              <option value="">Select Session</option>
                {sessions.map((option) => (
                  <option key={option._id} value={option._id}>{option.title}</option>
                ))}
              </Select>
            </div>

        <div className='text-center'>
         <h1>QR Scanning Code</h1>
       {scanResult && (
        <div>
          <p>User ID: {scanResult}</p>
          
        </div>  
      )}
        <div className='text-center'>
          
          <div className='w-72 h-72' id="reader"></div>
          
        </div>
     

        </div>
      </div>

      <div className="w-full flex flex-col sm:w-3/5 md:flex-row gap-4 p-6 bg-white rounded-lg dark:bg-gray-800 hidden lg:block">
      <div className="p-2 w-full text-white fill-gray-400">
                <div className="flex justify-between mb-2">
                <div className="w-full flex items-center gap-1">
                    <SearchIcon />
                    <DebouncedInput
                    value={globalFilter ?? ""}
                    onChange={(value) => setGlobalFilter(String(value))}
                    className="p-2 bg-transparent outline-none border-b-2 w-2/5 focus:w-1/3 duration-300 border-indigo-500 text-gray-900 dark:text-white"
                    placeholder="Search all columns..."
                    />
                    
                </div>
                <DownloadBtn
                    data={attendance}
                    fileName={fileNameDate + " - " + attendance.title + " - participants"}
                />
                
                </div>
                <table className="border border-gray-700 w-full text-left">
            <thead className="bg-indigo-600">
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                    <th key={header.id} className="capitalize px-3.5 py-2">
                    {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                    )}
                    </th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody>


            {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, i) => (
                <tr
                    key={row.id}
                    className={`
                    ${i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                    `}
                >

                    {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3.5 py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                    ))}
                </tr>
                ))
            ) : (
                <tr className="text-center h-32 text-gray-900 dark:text-white">
                <td colSpan={12}>No Record Found!</td>
                </tr>
            )}
            </tbody>
        </table>
            </div>
      </div>



      
      
      


       
      </div>
      
    </section>
  )
}
