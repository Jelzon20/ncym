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

export default function ViewCapacityBasedModal({capacityWorkshop, isOpen, onClose}) {
  
  const { currentUser } = useSelector((state) => state.user);
    // const [formData, setFormData] = useState({});

    const dispatch = useDispatch();

    // useEffect(() => {
    //     const getWorkshopType = async () => {
    //       try {
    //           if(capacityWorkshop.workshopType === "ISSUE-BASED") {
    //             setFormData({issue_based: capacityWorkshop._id});
    //         } else{
    //             setFormData({capacity_based: capacityWorkshop._id})
    //         }
    //       } catch (error) {
    //         toast.error(error.message)
    //       }
    //     };
    //     if (currentUser.isRegistered && capacityWorkshop.length != 0) {
    //       getWorkshopType();
    //     }
        
    //   }, [capacityWorkshop]);

    const handleCapacityEnroll = async (data) => {
        try {
            dispatch(updateStart());
            const enroll = await fetch(`/api/user/enroll/${currentUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({capacity_based: capacityWorkshop._id}),
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
        
        {capacityWorkshop != undefined && capacityWorkshop.length != 0 ? (<> 
        <Modal.Header>{capacityWorkshop.workshopType} WORKSHOP</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 p-4">
            <p className='text-2xl font-bold'>{capacityWorkshop.title}</p>
            <span className='text-md text-slate-500 font-normal'>{capacityWorkshop.workshopCategory}</span>
            
            <p className="text-base leading-relaxed text-gray-800 dark:text-gray-400">
             {capacityWorkshop.description}
            </p>

            <p className="text-base leading-relaxed text-red-500 dark:text-gray-400">
             Slots available: {capacityWorkshop.slots}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {capacityWorkshop.slots <= 0 || currentUser.capacity_based != null ? (<></>) :(<Button onClick={(e) => {handleCapacityEnroll(capacityWorkshop)}}>Enroll</Button>)}
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer> </>) : (<> <Spinner aria-label="Extra large spinner example" size="xl" /> </>)}
        
      </Modal>
  )
}
