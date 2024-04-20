import React from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Modal, Table, Button, Label, Pagination, Alert, TextInput, Toast, Spinner } from 'flowbite-react';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import DownloadBtn from "./DownloadBtn";
import DebouncedInput from "./DebouncedInput.jsx";
import { SearchIcon } from "../Icons/icons";
import { FaCheck, FaInfo, FaTimes, } from 'react-icons/fa';
import { HiOutlineExclamationCircle, HiCheck } from 'react-icons/hi';
import QRCode from "react-qr-code";
import { Toaster, toast } from 'sonner'
import {
  updateOtherUserStart,
  updateOtherUserSuccess,
  updateOtherUserFailure
} from "../redux/user/userSlice";

import moment from "moment/moment.js";



export default function Tanstack() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [toExport, setToExport] = useState([]);
  const [reg, setReg] = useState([]);
  const [data] = useState(() => [...users]);
  const [globalFilter, setGlobalFilter] = useState("");
  const dispatch = useDispatch();
  // const [updateFormData, setUpdateFormData] = useState({});


  const [showModal, setShowModal] = useState(false);
  const [showProfModal, setShowProfModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [userIdToView, setUserIdToView] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const columnHelper = createColumnHelper();
  const [show, setShow] = useState(true);
  const [fileNameDate, setFileNameDate] = useState('');

  const columns = [

    columnHelper.accessor(users => users.user.profilePicture, {

      cell: (info) => (
        <img
          src={info?.getValue()}
          alt="..."
          className="mr-10 rounded-full w-10 h-10 object-cover"
        />
      ),
      header: "Profile",
    }),
    columnHelper.accessor(users => users.user.email, {
      cell: (info) => <span className='mr-10'>{info.getValue()}</span>,
      header: "Email",
    }),
    columnHelper.accessor(users => users.dioceseOrOrg, {
      cell: (info) => <span className='mr-10'>{info.getValue()}</span>,
      header: "Diocese",
    }),
    columnHelper.accessor(users => users.parishOrLocalUnit, {
      cell: (info) => <span className='mr-10'>{info.getValue()}</span>,
      header: "Parish",
    }),
    columnHelper.accessor("firstName", {
      cell: (info) => <span className='mr-10'>{info.getValue()}</span>,
      header: "First Name",
    }),
    columnHelper.accessor("lastName", {
      cell: (info) => <span className='mr-10'>{info.getValue()}</span>,
      header: "Last Name",
    }),
    columnHelper.accessor(users => users.user.isAdmin, {
      cell: (info) => (
        (info.getValue() === true) ? (
          <FaCheck className='text-green-500 mr-10' />
        ) : (
          <FaTimes className='text-red-500 mr-10' />
        )
      ),
      header: "Admin",
    }),
    columnHelper.accessor(users => users.user.isAccepted, {
      cell: (info) => (
        (info.getValue() === true) ? (
          <FaCheck className='text-green-500 mr-10' />
        ) : (
          <FaTimes className='text-red-500 mr-10' />
        )

      ),
      header: "Accepted",
    }),
    columnHelper.accessor(users => users.user.isActive, {
      cell: (info) => (
        (info.getValue() === true) ? (
          <FaCheck className='text-green-500 mr-10' />
        ) : (
          <FaTimes className='text-red-500 mr-10' />
        )

      ),
      header: "Active",
    }),
    columnHelper.accessor("_id", {
      cell: (info) => (
        <>
          <span
            onClick={() => {
              setShowProfModal(true);
              setUserIdToView(info.getValue());
              handleViewUser(info.getValue())
            }}
            className='pr-4 font-medium text-green-500 hover:underline cursor-pointer'
          >
            View
          </span>
          {/* <span
                        onClick={() => {
                            setShowModal(true);
                            setUserIdToDelete(info.getValue());
                            
                        }}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                        Delete
                    </span> */}
        </>
      ),
      header: "Actions",
    }),



  ];


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/reg/getregs`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.regs);
        }
      } catch (error) {
        toast.error(data.message)
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const flattenArr = (ob) => {

    // The object which contains the
    // final result
    let fileToExport = [];

    for (const x in ob) {

      let user = ob[x];


      for (const i in user) {

        if ((typeof user[i]) === 'object' && !Array.isArray(user[i])) {
          // const temp = flattenObj(user[i]);
          Object.keys(user[i]).forEach(key => {
            const value = user[i][key];
            if (key == "_id") {
              key = "user_id";
            }
            user[key] = value;
          });

        }

      }
      fileToExport.push(user);
    }
    return fileToExport;
  }

  const rerender = async () => {
    try {
      const res = await fetch(`/api/reg/getregs`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.regs);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const table = useReactTable({
    data: users,
    columns,
    state: {
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // const handleDeleteUser = async () => {
  //     try {
  //         const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
  //             method: 'DELETE',
  //         });
  //         const data = await res.json();
  //         if (res.ok) {
  //             setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
  //             setShowModal(false);
  //         } else {
  //             toast.error(data.message)
  //         }
  //     } catch (error) {
  //       toast.error(error.message)
  //     }
  //   };

  const handleViewUser = async (regId) => {
    console.log(regId);
    try {
      const res = await fetch(`/api/reg/${regId}`);
      const data = await res.json();
      if (res.ok) {
        setReg(data);

      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  const handleUpdateUser = async (userId) => {

    try {
      dispatch(updateOtherUserStart());
      const updUser = await fetch(`/api/user/update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "isAccepted": true }),
      });
      const data = await updUser.json();
      if (data.success === false) {
        dispatch(updateOtherUserFailure(data.message));
      } else {
        dispatch(updateOtherUserSuccess(data));
        toast.success('User has been accepted');
        setShowProfModal(false)
        rerender();

      }

    } catch (error) {
      return dispatch(updateOtherUserFailure(error.message));
    }
  };

  useEffect(() => {
    const date = new Date();
    setFileNameDate(moment(date).format('MM/DD/YYYY'));
  }, [users]);

  const subStr = (str) => {
    return str.substring(str.indexOf("%2F") + 3, str.lastIndexOf("?alt"));
  };

  return (
    <div className="p-2 max-w-full mx-auto text-white fill-gray-400">
      <Toaster richColors position="top-center" expand={true} />

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
        <DownloadBtn data={flattenArr(users)} fileName={fileNameDate + " - users"} />
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
      {/* <Modal
        show={showModal}
        onClose={() => (
            setShowModal(false),
            setReg([])
        )}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}

      <Modal
        show={showProfModal}
        onClose={() => (setShowProfModal(false), setReg([]))}
        popup
        size='2xl'
      >
        <Modal.Header />
        <Modal.Body>
          {(reg === undefined || reg.length == 0) ? (<Spinner />) : (

            <div className='text-center' id="print-content" >
              <div className="flex items-center justify-center">

                <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" >

                  <img
                    src={reg && reg.user.profilePicture}
                    alt="user"
                    className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'
                  />
                </div>
              </div>
              <div className="p-4 mt-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <Label
                      htmlFor="title"
                      className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                      value="First Name"
                    />
                    <TextInput
                      type="text"
                      id="emerContactPerson"

                      defaultValue={
                        reg && reg.firstName
                      }
                      disabled
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <Label
                      htmlFor="title"
                      className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                      value="Last Name"
                    />
                    <TextInput
                      type="text"
                      id="emerContactNumber"

                      defaultValue={
                        reg && reg.lastName
                      }
                      disabled
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <Label
                      htmlFor="title"
                      className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                      value="Diocese/Organization"
                    />
                    <TextInput
                      type="text"
                      id="emerContactNumber"

                      defaultValue={
                        reg && reg.dioceseOrOrg
                      }
                      disabled
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <Label
                      htmlFor="title"
                      className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                      value="Parish/Local Unit"
                    />
                    <TextInput
                      type="text"
                      id="emerContactNumber"

                      defaultValue={
                        reg && reg.parishOrLocalUnit
                      }
                      disabled  
                    />
                  </div>
                </div>
              </div>



              <div className="grid place-items-center border max-w-full h-10 bg-indigo-950">

              </div>
              <div className='mt-8 flex w-full justify-between '>
                <div className="flex flex-col items-start">
                  <div>
                    <Label
                      className="mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                      value={`Address: ` + (reg && reg.address)}
                    />
                  </div>
                  <div>
                    <Label
                      className="mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                      value={`Birthday: ` + (reg && reg.birthday)}
                    />
                  </div>
                  <div>
                    <Label
                      className="mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                      value={`Contact Number: ` + (reg && reg.contactNumber)}
                    />
                  </div>
                  <div>
                    <Label
                      className="mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                      value={`Email: ` + (reg && reg.user.email)}
                    />
                  </div>
                  <div>
                    <Label
                      className="mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                      value={`Role in Ministry: ` + (reg && reg.roleInMinistry)}
                    />
                  </div>
                  <div>
                    <Label
                      className="mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                      value={"Waiver: "}
                    />
                    <a href = {reg && reg.waiver} className='text-sm text-blue-500' target='_blank'>{subStr(reg.waiver)}</a>
                  </div>
                  <div>
                    <Label
                      className="mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                      value={"Waiver: "}
                    />
                    <a href = {reg && reg.proofOfPayment} className='text-sm text-blue-500' target='_blank'>{subStr(reg.proofOfPayment)}</a>
                  </div>
                </div>

                <div>
                  <QRCode size={120} value={reg && reg.user._id} className="self-center" />
                </div>
              </div>
              <div className='mt-8 flex justify-center gap-4 no-print'>
                {(reg && !reg.user.isAccepted) ? (<Button className='bg-indigo-950' onClick={() => handleUpdateUser(reg.user._id)}>
                  Accept
                </Button>) : (<></>)}


                <Button color='gray' onClick={() => setShowProfModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
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
  );
}
