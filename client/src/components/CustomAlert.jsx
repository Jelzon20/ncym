import React from "react";
import { HiCheck, HiX, HiInformationCircle } from 'react-icons/hi';  
import {
  Alert,
} from "flowbite-react";

export default function CustomAlert({message, type}) {
  
  
  return (
    <Alert color={type} icon={type == "success" ? (HiInformationCircle) : (HiX)}>
      <span className="font-medium">{message}</span>
    </Alert>
  );
}
