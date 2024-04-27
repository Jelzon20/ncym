import React from 'react'
import { Button, Modal, Select } from "flowbite-react";
import {
    updateStart,
    updateSuccess,
    updateFailure,
  } from "../redux/user/userSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";

export default function ViewWorkshopModal({workshopId, isOpen, onClose}) {
  
  const { currentUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({});
    const [workshop, setWorkshop] = useState({});
    const [wCategory, setWCategory] = useState({});
    const [openModal, setOpenModal] = useState()

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchWorkshop = async () => {
          try {
            const res = await fetch(`/api/workshop/getWorkshop/${workshopId}`);
            const data = await res.json();
            if (res.ok) {
              setWorkshop(data);

              if(data.workshopCategory === "ISSUE-BASED") {
                setFormData({issue_based: data._id});
            } else{
                setFormData({capacity_based: data._id})
            }
            }
          } catch (error) {
            toast.error(data.message)
          }
        };
        if (currentUser.isRegistered) {
            fetchWorkshop();
        }

      }, [workshopId, isOpen]);

    

    const handleEnroll = async (data) => {
        try {
            dispatch(updateStart());
            const enroll = await fetch(`/api/user/enroll/${currentUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
              });
            const data = await enroll.json();
            if (data.success === false) {
              dispatch(updateFailure(data.message));
              toast.error(data.message)
            }
            dispatch(updateSuccess(data));
            toast.success("User has been enrolled");
            setTimeout(() => {
              onClose();
            }, 2000);
            
            
            
          } catch (error) {
           
            dispatch(updateFailure(error.message));
            toast.error(error.message)
          }
    }
  return (
    <Modal
        show={isOpen}
        onClose={onClose}
      >
        <Toaster richColors position="top-center" expand={true} />
        <Modal.Header>{workshop.workshopType} WORKSHOP</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 p-4">
            <p className='text-2xl font-bold'>{workshop.title}</p>
            <span className='text-md text-slate-500 font-normal'>{workshop.workshopCategory}</span>
            
            <p className="text-base leading-relaxed text-gray-800 dark:text-gray-400">
             {workshop.description}
            </p>

            <p className="text-base leading-relaxed text-red-500 dark:text-gray-400">
             Slots available: {workshop.slots}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {workshop.slots == 0 ? (<></>) :(<Button onClick={(e) => {handleEnroll(workshop)}}>Enroll</Button>)}
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
  )
}
