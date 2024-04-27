import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Card, Button, Modal } from "flowbite-react";
import { HiOutlineChatAlt2, HiDatabase } from "react-icons/hi";
import  ViewWorkshopModal  from '../components/ViewWorkshopModal';
import { Toaster, toast } from "sonner";

export default function WorkshopSub() {
  const { currentUser } = useSelector((state) => state.user);
  const [workshops, setWorkshops] = useState([]);
  const [dataViewWorkshop, setDataViewWorkshop] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
      const fetchWorkshops = async () => {
        try {
          const res = await fetch(`/api/workshop/getWorkshops`);
          const data = await res.json();
          if (res.ok) {
            setWorkshops(data.workshops);

          }
        } catch (error) {
          toast.error(data.message)
        }
      };
      if (currentUser.isRegistered) {
          fetchWorkshops();
      }
    }, [currentUser._id]);

    const handleClose = () => {
      setOpenModal(false);
      rerender();
  };

  const handleOpen = async (workshop) => {
    setDataViewWorkshop(workshop);
    setOpenModal(true);
  };

  const rerender = async () => {
    try {
      const res = await fetch(`/api/workshop/getWorkshops`);
      const data = await res.json();
      if (res.ok) {
        setWorkshops(data.workshops);

      }
    } catch (error) {
      toast.error(data.message)
    }
  }

  

  return (
    <section className="min-h-screen max-w-full bg-gradient-to-r from-red-800 via-orange-600 to-yellow-400">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto ">
      <Toaster richColors position="top-center" expand={true} />
        <Tabs
          aria-label="Tabs with icons"
          style="underline"
          className="bg-white px-4 py-8 mx-auto"
        >
          <Tabs.Item active title="Issue-Based" icon={HiOutlineChatAlt2}>
          {workshops && workshops.map((workshop) => (
          <Card className="max-w-sm" key={workshop._id}>
             <span className="text-sm font-normal tracking-tight text-gray-900 dark:text-white">
               {workshop && workshop.workshopCategory}
             </span>
             <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
               {workshop && workshop.title} 
             </h5>
             
             <span className="font-normal line-clamp-5 text-gray-700 dark:text-gray-400" >
             {workshop && workshop.description}
             </span>
            <Button onClick={(e) => handleOpen(workshop)}>
            
              
               Learn More
               <svg
                 className="-mr-1 ml-2 h-4 w-4"
                 fill="currentColor"
                 viewBox="0 0 20 20"
                 xmlns="http://www.w3.org/2000/svg"
               >
                 <path
                   fillRule="evenodd"
                   d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                   clipRule="evenodd"
                 />
               </svg>
             </Button>
           </Card>))}
            
           
          </Tabs.Item>
          <Tabs.Item title="Capacity-Based" icon={HiDatabase}>
            This is{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              Dashboard tab's associated content
            </span>
            . Clicking another tab will toggle the visibility of this one for
            the next. The tab JavaScript swaps classes to control the content
            visibility and styling.
          </Tabs.Item>
        </Tabs>
        <ViewWorkshopModal isOpen={openModal} onClose={handleClose} workshopId={dataViewWorkshop._id}/>
      </div>
    </section>
  );
}
