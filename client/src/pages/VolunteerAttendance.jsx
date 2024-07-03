import React, { useEffect, useState} from 'react'
import { Label, Select, Button, Modal, } from "flowbite-react";
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { Toaster, toast } from "sonner";
import DownloadBtn from "../components/DownloadBtn";
import DebouncedInput from "../components/DebouncedInput.jsx";
import {SearchIcon } from "../Icons/icons";
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
    const [sessionTitle, setSessionTitle] = useState('');
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


    
    


    const getAttendance = async () => {
      if(session) {
        try {
          const res = await fetch(`/api/session/getAttendance/${session}`);
          const data = await res.json();
          if (res.ok) {
            setAttendance(data.attendance[0].user_details);
            }
        } catch (error) {
          toast.error(error.message)
        }
      } else{
        toast.error("No Session set.");
      }
      
    }

    
useEffect(() => {
  if(session) {
    getAttendance();
  }
}, [session])

    

    const handleSessionChange = async (e) => {
      // setWorkshop( e.target.name );
      const sessionId = e.target.value;
      setSession(sessionId)
      setScanResult(null);
      setSessionTitle(e.target.options[e.target.selectedIndex].text);
      
      // getAttendance();
    };

    console.log('OUTSIDE LOG' + session)

    

      useEffect(() => {

        function renderCamera() {
          const scanner = new Html5QrcodeScanner('qrcodeId', {
            qrbox: {
              width: 1200,
              height: 1200,
            },
            fps: 5,
          });

          let shouldPauseVideo = true;
          let showPausedBanner = false;

          scanner.render(success, error);

           async function success(result) {
     
              // setScanResult(result);
  
              addAttendance(result);
        
              scanner.pause(shouldPauseVideo, showPausedBanner);
              // 
              setTimeout(() => {

                scanner.resume(shouldPauseVideo);

              }, 2000);
            
          }
        
          
          function error(err) {
            console.warn(err);
          }
        }
          

          if(session != '') {
            console.log("SESSION SET")
            renderCamera();
          } else {
            toast.error('Session ID is not set');
          }
          return () => {
                    // Anything in here is fired on component unmount.
                    console.log('UNMOUNT');
                };
            },[session]);

    //   useEffect(() => {
    //     // Anything in here is fired on component mount.
    //     if(!html5QrCode?.getState()){
    //         html5QrCode = new Html5Qrcode('qrcodeId');
    //         const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    //             /* handle success */
    //             console.log('USEEFFECT LOG' + session);
    //             // addAttendance(decodedText);
    //             console.log(decodedText);
                
    //         };
    //         const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.777778};

    //         // If you want to prefer back camera
    //         html5QrCode.start(
    //             { facingMode: "environment" },
    //             config,
    //             qrCodeSuccessCallback
    //         );
    //     }

    //     return () => {
    //         // Anything in here is fired on component unmount.
    //         console.log('UNMOUNT');
    //     };
    // }, []);

    

      const addAttendance = async (result) => {
        try {
          const res = await fetch(`/api/session/addAttendance`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({session: session, userId: result}),
          });
          const data = await res.json();

          if (res.ok) {
            toast.success(data.message);
            
            } else {
              toast.error(data.message)
              
            }

        } catch (error) {
          console.log(error.message);
        }
      }


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
      <div className="flex flex-col md:flex-row w-full px-4 gap-2 py-8 mx-auto justify-center">
      <Toaster richColors position="top-center" expand={true} />
      <div className="w-md flex flex-col md:flex-row gap-4 p-6 bg-white rounded-lg dark:bg-gray-800 ">
       

        
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
       {/* {scanResult ? (
        <div>
          <p>User ID: <b>{scanResult}</b></p>
        </div>  
      ) : (<div>
          
        <div className='w-80 h-80 mx-auto' id="reader"></div>
        
      </div>)} */}

        {/* <div className='w-80 h-80 mx-auto' id="reader"></div> */}
        <div  className='w-80 h-80 mx-auto' id='qrcodeId'></div>
     

        </div>
      </div>
      <div className="w-full flex-col sm:w-3/5 md:flex-row gap-4 p-6 bg-white rounded-lg dark:bg-gray-800 hidden lg:block">
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
                <Button className='download-btn hover:text-white mx-4' onClick={() => getAttendance()}> Refresh</Button>
                <DownloadBtn
                    data={attendance}
                    fileName={fileNameDate + " - " + sessionTitle + " - participants"}
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
        {/* pagination */}
      <div className="flex items-center justify-end mt-2 gap-2 text-gray-900 dark:text-white">
        <button
          onClick={() => {
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
          className="p-1 border border-gray-300 px-2 disabled:opacity-30"
        >
          {"<"}
        </button>
        <button
          onClick={() => {
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
          className="p-1 border dark:border-gray-300 px-2 disabled:opacity-30"
        >
          {">"}
        </button>

        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16 bg-transparent"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="p-2 bg-transparent"
        >
          {[10, 20, 30, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
            </div>
      </div>
      
      </div>
      
    </section>
  )
}
