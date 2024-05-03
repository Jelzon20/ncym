import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Modal,
  Table,
  Button,
  Label,
  Pagination,
  Alert,
  TextInput,
  Toast,
  Spinner,
  Select,
  Tabs,
} from "flowbite-react";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DownloadBtn from "./DownloadBtn";
import DebouncedInput from "./DebouncedInput.jsx";
import { SearchIcon } from "../Icons/icons";
import { FaCheck, FaInfo, FaTimes } from "react-icons/fa";
import {
  HiOutlineExclamationCircle,
  HiCheck,
  HiOutlineChatAlt2,
  HiDatabase,
} from "react-icons/hi";
import QRCode from "react-qr-code";
import { Toaster, toast } from "sonner";
import {
  updateOtherUserStart,
  updateOtherUserSuccess,
  updateOtherUserFailure,
} from "../redux/user/userSlice";

import moment from "moment/moment.js";

export default function DashWorkshops() {
  const { currentUser } = useSelector((state) => state.user);
  const [participants, setParticipants] = useState([]);
  const [data] = useState(() => [...participants]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [issueBasedWorkshops, setIssueBasedWorkshops] = useState([]);
  const [capacityBasedWorkshops, setCapacityBasedWorkshops] = useState([]);
  const [workshop, setWorkshop] = useState('');
  const [fileNameDate, setFileNameDate] = useState('');
  const columnHelper = createColumnHelper();

  
  const columns = [
    columnHelper.accessor(participants => participants.dioceseOrOrg , {
      cell: (info) => <span className='mr-10'>{info.getValue()}</span>,
      header: "Diocese",
    }),
    columnHelper.accessor(participants => participants.parishOrLocalUnit , {
      cell: (info) => <span className='mr-10'>{info.getValue()}</span>,
      header: "Parish",
    }),
    columnHelper.accessor(participants => participants.firstName , {
      cell: (info) => <span className='mr-10'>{info.getValue()}</span>,
      header: "First Name",
    }),
    columnHelper.accessor(participants => participants.lastName , {
        cell: (info) => <span className='mr-10'>{info.getValue()}</span>,
        header: "Last Name",
      }),
  ];


  

  useEffect(() => {
    const fetchUsers = async () => {
      const cbWorkshop = [];
      const ibWorkshop = [];
      try {
        const res = await fetch(`/api/workshop/getWorkshops`);
        const data = await res.json();
        if (res.ok) {
          const workshops = data.workshops;
          for (let x in workshops) {
            if (workshops[x].workshopType === "CAPACITY-BASED") {
              cbWorkshop.push(workshops[x]);
            } else {
              ibWorkshop.push(workshops[x]);
            }
          }
          setCapacityBasedWorkshops(cbWorkshop);
          setIssueBasedWorkshops(ibWorkshop);
        }
      } catch (error) {
        toast.error(data.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleChange = async (e) => {
    // setWorkshop( e.target.name );
    const workshopId = e.target.value;
    if(!workshopId){
        toast.error("Please select a workshop");
        setParticipants([]);
    } else {
        try {
            const res = await fetch(`/api/workshop/getParticipants/${workshopId}`);
            const data = await res.json();
            if (res.ok) {
              setWorkshop(data.participants[0].title);
              setParticipants(data.participants[0].user_details)
            }
          } catch (error) {
            toast.error(data.message);
          }
    }
    
  };
  const handleCapacityChange = async (e) => {
    // setWorkshop( e.target.name );
    const workshopId = e.target.value;
    if(!workshopId){
        toast.error("Please select a workshop");
        setParticipants([]);
    } else {
        try {
            const res = await fetch(`/api/workshop/getParticipants/${workshopId}`);
            const data = await res.json();
            if (res.ok) {
              setWorkshop(data.participants[0].title);
              setParticipants(data.participants[0].user_details)
            }
          } catch (error) {
            toast.error(data.message);
          }
    }
    
  };

  const table = useReactTable({
    data: participants,
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
  }, [participants]);

  return (
    <section className="bg-gradient-to-r from-red-800 via-orange-600 to-yellow-400 dark:bg-gray-900 w-full">
    <div className="px-4 py-8 mx-auto">
        <Toaster richColors position="top-center" expand={true} />
        <Tabs
          aria-label="Tabs with icons"
          style="underline"
          className="bg-white px-4 py-8 mx-auto rounded-2xl border-none"
          onActiveTabChange={() => {setParticipants([]), document.getElementById("capacity").value = "", document.getElementById("issue").value = ""}}
        >
          <Tabs.Item active title="Issue-Based" icon={HiOutlineChatAlt2}>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label value="Select Workshop" />
              </div>

              <Select id="issue" onChange={handleChange} required>
              <option value="">Select Workshop</option>
                {issueBasedWorkshops.map((option) => (
                  <option value={option._id}>{option.title}</option>
                ))}
              </Select>
            </div>
            <div className="p-2 max-w-full mx-auto text-white fill-gray-400">
                <div className="flex justify-between mb-2">
                <div className="w-full flex items-center gap-1">
                    <SearchIcon />
                    <DebouncedInput
                    value={globalFilter ?? ""}
                    onChange={(value) => setGlobalFilter(String(value))}
                    className="p-2 bg-transparent outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-indigo-500 text-gray-900 dark:text-white"
                    placeholder="Search all columns..."
                    />
                    
                </div>
                <DownloadBtn
                    data={data}
                    fileName={fileNameDate +  " - " + workshop + " - participants"}
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
          </Tabs.Item>
          <Tabs.Item title="Capacity-Based" icon={HiDatabase}>
          <div className="max-w-md">
              <div className="mb-2 block">
                <Label  value="Select Workshop" />
              </div>

              <Select id="capacity" onChange={handleCapacityChange} required>
              <option value="">Select Workshop</option>
                {capacityBasedWorkshops.map((option) => (
                  <option value={option._id}>{option.title}</option>
                ))}
              </Select>
            </div>
            <div className="p-2 max-w-full mx-auto text-white fill-gray-400">
                <div className="flex justify-between mb-2">
                <div className="w-full flex items-center gap-1">
                    <SearchIcon />
                    <DebouncedInput
                    value={globalFilter ?? ""}
                    onChange={(value) => setGlobalFilter(String(value))}
                    className="p-2 bg-transparent outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-indigo-500 text-gray-900 dark:text-white"
                    placeholder="Search all columns..."
                    />
                    
                </div>
                <DownloadBtn
                    data={data}
                    fileName={fileNameDate +  " - " + workshop + " - participants"}
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
          </Tabs.Item>
        </Tabs>
      </div>
  </section>
  );
}
