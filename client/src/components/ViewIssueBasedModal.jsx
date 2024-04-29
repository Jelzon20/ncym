import React from 'react'
import { Button, Modal, Spinner } from "flowbite-react";
import {
    updateStart,
    updateSuccess,
    updateFailure,
  } from "../redux/user/userSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";

export default function ViewIssueBasedModal({workshop, isOpen, onClose}) {
  
  const { currentUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({});

    const dispatch = useDispatch();

    // useEffect(() => {
    //     const getWorkshopType = async () => {
    //       try {
    //           if(workshop.workshopType === "ISSUE-BASED") {
    //             setFormData();
    //         } else{
    //             setFormData({capacity_based: workshop._id})
    //         }
    //       } catch (error) {
    //         toast.error(error.message)
    //       }
    //     };
    //     if (currentUser.isRegistered && workshop.length != 0) {
    //       getWorkshopType();
    //     }
        
    //   }, [workshop]);

    const handleEnroll = async (data) => {
        try {
            dispatch(updateStart());
            const enroll = await fetch(`/api/user/enroll/${currentUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({issue_based: workshop._id}),
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
              // setWorkshop({});
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
        
        {workshop != undefined && workshop.length != 0 ? (<> 
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
          {workshop.slots <= 0 || currentUser.issue_based != null ? (<></>) :(<Button onClick={(e) => {handleEnroll(workshop)}}>Enroll</Button>)}
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer> </>) : (<> <Spinner aria-label="Extra large spinner example" size="xl" /> </>)}
        
      </Modal>
  )
}
