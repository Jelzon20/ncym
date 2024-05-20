import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Card, Button, Modal } from "flowbite-react";
import { HiOutlineChatAlt2, HiDatabase } from "react-icons/hi";
import  ViewIssueBasedModal  from '../components/ViewIssueBasedModal';
import ViewCapacityBasedModal from '../components/ViewCapacityBasedModal';
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import webLogo from "../assets/webLogo.png";

export default function WorkshopSub() {
  const { currentUser } = useSelector((state) => state.user);

  const [issueBasedWorkshops, setIssueBasedWorkshops] = useState([]);
  const [capacityBasedWorkshops, setCapacityBasedWorkshops] = useState([]);

  const [issueViewWorkshop, setIssueViewWorkshop] = useState([]);
  const [capacityViewWorkshop, setCapacityViewWorkshop] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [openCapacityModal, setOpenCapacityModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {

    if (currentUser.isAccepted && currentUser.isRegistered) {
      navigate("/workshops");
    } else if (currentUser.isRegistered) {
      navigate("/dashboard?tab=profile");
    } else {
      navigate("/registration");
    }
  }, [currentUser]);

  useEffect(() => {
      const fetchWorkshops = async () => {
        const cbWorkshop = [];
        const ibWorkshop = [];
      
        try {
          
          const res = await fetch(`/api/workshop/getWorkshops`);
          const data = await res.json();
          if (res.ok) {
            const workshops = data.workshops;
            for(let x in workshops){
              if(workshops[x].workshopType === "CAPACITY-BASED") {
                cbWorkshop.push(workshops[x]);
              } else {
                ibWorkshop.push(workshops[x]);
              }
            }

            setCapacityBasedWorkshops(cbWorkshop);
            setIssueBasedWorkshops(ibWorkshop);
          }

        } catch (error) {
          toast.error(data.message)
        }
      };
      if (currentUser.isRegistered) {
          fetchWorkshops();
      }
    }, []);

  const handleClose = () => {
      setIssueViewWorkshop([]);
      setOpenModal(false);
      rerender();
  };

  const handleOpen = async (issueBased) => {
    setIssueViewWorkshop(issueBased);
    setOpenModal(true);
  };

  const handleCapacityClose = () => {
    setCapacityViewWorkshop([]);
    setOpenCapacityModal(false);
    rerender();
};

const handleCapacityOpen = async (capacityBased) => {
  setCapacityViewWorkshop(capacityBased);
  setOpenCapacityModal(true);
};

  const rerender = async () => {
    const cbWorkshop = [];
    const ibWorkshop = [];
    try {
      const res = await fetch(`/api/workshop/getWorkshops`);
      const data = await res.json();
      if (res.ok) {
        const workshops = data.workshops;
        for(let x in workshops){
          if(workshops[x].workshopType === "CAPACITY-BASED") {
            cbWorkshop.push(workshops[x]);
          } else {
            ibWorkshop.push(workshops[x]);
          }
        }
        setCapacityBasedWorkshops(cbWorkshop);
        setIssueBasedWorkshops(ibWorkshop);
      }
    } catch (error) {
      toast.error(data.message)
    }
  }


  return (
    <section className="min-h-screen max-w-full bg-gradient-to-r from-red-800 via-orange-600 to-yellow-400">
      <div className="grid grid-col max-w-screen-xl px-4 py-8 mx-auto">
      <Toaster richColors position="top-center" expand={true} />
        <Tabs
          aria-label="Tabs with icons"
          style="underline"
          className="bg-white px-4 py-8 mx-auto rounded-2xl border-none"
        >
          <Tabs.Item active title="Issue-Based" icon={HiOutlineChatAlt2}>
            <div className="flex flex-wrap gap-4">
          {issueBasedWorkshops.map((issueWorkshop) => (
          <Card className="max-w-sm" key={issueWorkshop._id}
          imgSrc={webLogo}>
             <span className="text-sm font-normal tracking-tight text-gray-900 dark:text-white">
               {issueWorkshop && issueWorkshop.workshopCategory} 
             </span>
            
             <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
             {issueWorkshop && issueWorkshop.title} 
             </h5>
             <span className="text-md font-bold tracking-tight text-gray-900 dark:text-white">
             {issueWorkshop && issueWorkshop.wCode}
             </span>  
             <span className="font-normal line-clamp-5 text-gray-700 dark:text-gray-400" >
             {issueWorkshop && issueWorkshop.description}
             </span>
            
            <Button onClick={(e) => handleOpen(issueWorkshop)} className="bg-indigo-950 dark:bg-orange-500">
            
              
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
           </div>
           
           
          </Tabs.Item>
          <Tabs.Item title="Capacity-Based" icon={HiDatabase}>
          <div className="flex flex-wrap gap-4">
          {capacityBasedWorkshops.map((capacityWorkshop) => (
          <Card className="max-w-sm" key={capacityWorkshop._id} imgSrc={webLogo}>
            
             <span className="text-sm font-normal tracking-tight text-gray-900 dark:text-white">
               {capacityWorkshop && capacityWorkshop.workshopCategory}
             </span>
             <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
               {capacityWorkshop && capacityWorkshop.title} 
             </h5>
             <span className="text-md font-bold tracking-tight text-gray-900 dark:text-white">
             {capacityWorkshop && capacityWorkshop.wCode}
             </span>  
             
             <span className="font-normal line-clamp-5 text-gray-700 dark:text-gray-400" >
             {capacityWorkshop && capacityWorkshop.description}
             </span>
            
            <Button onClick={(e) => handleCapacityOpen(capacityWorkshop)} className="bg-indigo-950 dark:bg-orange-500">
            
              
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
           </div>
          </Tabs.Item>
          
        </Tabs>
        <ViewIssueBasedModal isOpen={openModal} onClose={handleClose} workshop={issueViewWorkshop}/>
        <ViewCapacityBasedModal isOpen={openCapacityModal} onClose={handleCapacityClose} capacityWorkshop={capacityViewWorkshop}/>
      </div>
    </section>
  );
}
