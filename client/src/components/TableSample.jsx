import { Modal, Table, Button, Label, Pagination } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import QRCode from "react-qr-code";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [reg, setReg] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showProfModal, setShowProfModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [userIdToView, setUserIdToView] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page) => setCurrentPage(page);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);

          }
        
            setTotalPages(Math.ceil(data.totalUsers / 9) + 1)
         
          
        }
        console.log(users)
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);



  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
        const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
            setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
            setShowModal(false);
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.log(error.message);
    }
  };

  const handleViewUser = async (userId) => {
    
        try {
          const res = await fetch(`/api/reg/${userId}`);
          const data = await res.json();
          if (res.ok) {
            setReg(data);
          }
        } catch (error) {
          console.log(error.message);
        }
    
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>Profile</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Registered?</Table.HeadCell>
              <Table.HeadCell>Accepted</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className='divide-y' key={user._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.firstname}
                      className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                    />
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className='text-green-500' />
                    ) : (
                      <FaTimes className='text-red-500' />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {user.isRegistered ? (
                      <FaCheck className='  text-green-500' />
                    ) : (
                     
                      <FaTimes className=' text-red-500' /> 
                     
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {user.isAccepted ? (
                      <FaCheck className='text-green-500' />
                    ) : (
                      <div className='flex items-center'>
                      <FaTimes className=' text-red-500' /> 
                      <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className='pl-4 font-medium text-green-500 hover:underline cursor-pointer'
                    >
                      Accept
                    </span>
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                  <span
                      onClick={() => {
                        setShowProfModal(true);
                        setUserIdToDelete(user._id);
                        handleViewUser(user._id)
                      }}
                      className='pr-4 font-medium text-green-500 hover:underline cursor-pointer'
                    >
                      View
                    </span>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToView(user._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          
          <div className="flex overflow-x-auto sm:justify-center">
            <Pagination currentPage={currentPage} totalPages={100} onPageChange={onPageChange} showIcons />
           
          </div>

          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
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
      </Modal>

      <Modal
        show={showProfModal}
        onClose={() => setShowProfModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
              <div className='text-center' id="print-content" >
                {/* <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' /> */}
                <h3 className='text-lg dark:text-gray-400'>
                  NCYM 2024
                </h3>
                <h4>
                  Palo, Leyte
                </h4>
                <h1 className="mt-5 p-2">Hi, I'm</h1>
                <div className="grid place-items-center border max-w-full h-16 ">
                  <h1 className="text-4xl">{reg && reg.nickname}</h1>
                </div>
                <h1 className="p-2">Abuyog, Leyte</h1>
                <div className='mt-8 flex w-full justify-between '>
                  <div className="flex flex-col items-start">
                    <div>
                      <Label
                        className="mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                        value={`Diocese/Org: ` + (reg && reg.dioceseOrOrg)}
                      />
                    </div>
                    <div>
                      <Label
                        className="mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                        value={`Parish/Local Unit: ` + (reg && reg.parishOrLocalUnit)}
                      />
                    </div>  
                    <div>
                      <Label
                        className="mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                        value={`Contact Number: ` + (reg && reg.contactNumber)}
                      />
                    </div>
                  </div>

                  <div>
                    <QRCode size={120} value={userIdToView} className="self-center" />
                  </div>
                </div>
                <div className='mt-8 flex justify-center gap-4 no-print'>
                  <Button gradientDuoTone="purpleToPink">
                    Accept
                  </Button>
                  <Button color='gray' onClick={() => setShowProfModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </Modal.Body>
      </Modal>
    </div>
  );
}