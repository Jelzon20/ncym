import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  Label,
  Select,
  TextInput,
  Radio,
  Datepicker,
  Alert,
  Toast,
  FileInput,
  Spinner,
  Progress,
  Modal
} from "flowbite-react";
import {
  registerFailure,
  registerStart,
  registerSuccess,
} from "../redux/register/registerSlice";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  } from "../redux/user/userSlice";
  import { HiCheck, HiX } from 'react-icons/hi';  
import moment from "moment/moment.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function Registration() {
  const [formData, setFormData] = useState({});
  const [updateFormData, setUpdateFormData] = useState({});
  const {
    error: errorMessage,
    currentRegister,
  } = useSelector((state) => state.register);
  const { currentUser, loading } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);

  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentFileUrl, setPaymentFileUrl] = useState(null);
  const [paymentFileUploadProgress, setPaymentFileUploadProgress] = useState(null);
  const [paymentFileUploadError, setPaymentFileUploadError] = useState(null);
  const [paymentFileUploading, setPaymentFileUploading] = useState(false);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleWaiverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFileUrl(URL.createObjectURL(file));
    }
  };

  const handlePaymentFileChange = (e) => {
    const paymentFile = e.target.files[0];
    if (paymentFile) {
      setPaymentFile(file);
      setPaymentFileUrl(URL.createObjectURL(paymentFile));
    }
  };

  useEffect(() => {
    if (file) {
      uploadWaiverFile();
    }
  }, [file]);

  useEffect(() => {
    if (paymentFile) {
      uploadPaymentFile();
    }
  }, [paymentFile]);

  const uploadWaiverFile = async () => {
    setFileUploading(true);
    setFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `/files/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setFileUploadError(
          "Could not upload file (File must be less than 2MB)"
        );
        setFileUploadProgress(null);
        setFile(null);
        setFileUrl(null);
        setFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileUrl(downloadURL);
          setFormData({ ...formData, waiver: downloadURL });
          setFileUploading(false);
        });
      }
    );
  };

  const uploadPaymentFile = async () => {
    setPaymentFileUploading(true);
    setPaymentFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + paymentFile.name;
    const storageRef = ref(storage, `/files/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, paymentFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setPaymentFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setFileUploadError(
          "Could not upload file (File must be less than 2MB)"
        );
        setPaymentFileUploadProgress(null);
        setPaymentFile(null);
        setPaymentFileUrl(null);
        setPaymentFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPaymentFileUrl(downloadURL);
          setFormData({ ...formData, proofOfPayment: downloadURL });
          setPaymentFileUploading(false);
        });
      }
    );
  };

  useEffect(() => {
    setFormData({ ...formData, userId: currentUser._id });
    setUpdateFormData({ ...updateFormData, isRegistered: true });
  }, [currentUser]);

  useEffect(() => {
    console.log(currentUser.isRegistered)

    if(currentUser.isRegistered) {
        navigate('/dashboard?tab=profile');
    }
    
  }, [currentUser]);

  const handleDateChange = (date) => {
    setFormData({ ...formData, birthday: date.value });
  };

  const handleArrivalChange = (date) => {
    setFormData({ ...formData, arrivalDate: date.value });
  };

  const handleDepartureChange = (date) => {
    setFormData({ ...formData, departureDate: date.value });
  };



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.dioceseOrOrg ||
      !formData.parishOrLocalUnit ||
      !formData.emerContactPerson ||
      !formData.emerContactNumber ||
      !formData.emerRelation ||
      !formData.title ||
      !formData.nickname ||
      !formData.lastName ||
      !formData.firstName ||
      !formData.birthday ||
      !formData.contactNumber ||
      !formData.shirtSize ||
      !formData.roleInMinistry ||
      !formData.address ||
      !formData.allergy ||
      !formData.medication ||
      !formData.diet ||
      !formData.disability ||
      !formData.arrivalDate ||
      !formData.arrivalTime ||
      !formData.carrierOutOfPalo ||
      !formData.carrierToPalo ||
      !formData.departureDate || 
      !formData.departureTime
    ) {
      setOpenConfirmModal(false);
      dispatch(registerFailure("Please fill all the fields"));
      return;
      
    }
    console.log(formData);

    // navigate("/dashboard?tab=profile");

    try {
      dispatch(registerStart());
      const res = await fetch("/api/reg/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      const data = await res.json();
      if (data.success === false) {
        setOpenConfirmModal(false);
        dispatch(registerFailure(data.message));
        return;
      }

      if (res.ok) {
        dispatch(registerSuccess(data));
      }

      try {
        dispatch(updateStart());
        const updRes = await fetch(`/api/user/update/${currentUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateFormData),
        });
        const data = await updRes.json();
        if (data.success === false) {
          setOpenConfirmModal(false);
          dispatch(updateFailure(data.message));
          return;
        }
        dispatch(updateSuccess(data));
        navigate("/dashboard?tab=profile");
      } catch (error) {
        setOpenConfirmModal(false);
        dispatch(updateFailure(error.message));
        return;
      }
    } catch (error) {
      setOpenConfirmModal(false);
      dispatch(registerFailure(error.message));
      return;
    }
  };

  return (
    <form>
      <div className="max-w-max mx-auto grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
        <div className="mb-4 col-span-full xl:mb-2">
          {errorMessage && (
            <Toast color="error" className="mt-5 max-w-full bg-red-200">
              <div className="inline-flex shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                <HiX className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">{errorMessage}</div>
              <Toast.Toggle />
            </Toast>
            // <Alert className="max-w-full mt-5" color="failure">
            //   {errorMessage}
            // </Alert>
          )}
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
            Registration
          </h1>
        </div>
        {/* <!-- Right Content --> */}
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Origin
            </h3>
            <div className="mb-4">
              <Label
                htmlFor="settings-language"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                value="Diocese/Organization"
              />
              <Select
                id="dioceseOrOrg"
                onChange={handleChange}
                // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option value="">Select here</option>
                <option value="Diocese 1">Diocese 1</option>
                <option value="Organization 1">Organization 1</option>
              </Select>
            </div>
            <div className="mb-6">
              <Label
                htmlFor="parishOrLocalUnit"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                value="Parish/Local Unit"
              />
              <TextInput
                type="text"
                id="parishOrLocalUnit"
                onChange={handleChange}
                // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                // placeholder="Contact Person"
                required
              />
            </div>
          </div>
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="flow-root">
              <h3 className="text-xl font-semibold dark:text-white">
                Contact Person (In case of emergency)
              </h3>
              <div className="mb-4">
                <Label
                  htmlFor="settings-language"
                  className="block my-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Contact Person"
                />
                <TextInput
                  type="text"
                  id="emerContactPerson"
                  onChange={handleChange}
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  // placeholder="Contact Person"
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="settings-language"
                  className="block my-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Contact Number"
                />
                <TextInput
                  type="text"
                  id="emerContactNumber"
                  onChange={handleChange}
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  // placeholder="Contact Person"
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="settings-language"
                  className="block my-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Relation to you"
                />
                <TextInput
                  type="text"
                  id="emerRelation"
                  onChange={handleChange}
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  // placeholder="Contact Person"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Personal Details
            </h3>

            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Title"
                />
                <Select
                  id="title"
                  onChange={handleChange}
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="MR.">MR.</option>
                  <option value="MS.">MS.</option>
                  <option value="FR.">FR.</option>
                  <option value="BR.">BR.</option>
                  <option value="SR.">SR.</option>
                </Select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="nickname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Nickname"
                />
                <TextInput
                  type="text"
                  id="nickname"
                  onChange={handleChange}
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  // placeholder="Jel"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="firstName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="First Name"
                />
                <TextInput
                  type="text"
                  id="firstName"
                  onChange={handleChange}
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Juan"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="lastName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Last Name"
                />
                <TextInput
                  type="text"
                  id="lastName"
                  onChange={handleChange}
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Dela Cruz"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="birthday"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Birthday"
                />
                <Datepicker
                  id="birthday"
                  onSelectedDateChanged={(date) =>
                    handleDateChange({
                      value: moment(date).format("MM/DD/YYYY"),
                    })
                  }
                  // onSelectedDateChanged={handleDateChange}
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="contactNumber"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Contact Number"
                />
                <TextInput
                  type="number"
                  id="contactNumber"
                  onChange={handleChange}
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="e.g. 09951234567"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Complete Home Address"
                />
                <TextInput
                  type="text"
                  id="address"
                  onChange={handleChange}
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"

                  required
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="roleInMinistry"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Role In Ministry"
                />
                <TextInput
                  type="text"
                  id="roleInMinistry"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="shirtSize"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Shirt Size"
                />
                <Select
                  id="shirtSize"
                  onChange={handleChange}
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                </Select>
              </div>
            </div>
          </div>
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Travel Details
            </h3>

            <div className="grid grid-cols-9 gap-9">
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="CarrierToPalo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Carrier to Palo"
                />

                <Select
                  id="carrierToPalo"
                  onChange={handleChange}
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Airplane">Airplane</option>
                  <option value="Bus">Bus</option>
                </Select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="arrivalDate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Date of Arrival"
                />
                <Datepicker
                  id="arrivalDate"
                  onSelectedDateChanged={(date) =>
                    handleArrivalChange({
                      value: moment(date).format("MM/DD/YYYY"),
                    })
                  }
                  // onSelectedDateChanged={handleDateChange}
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="arrivalTime"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Estimated Time of Arrival"
                />
                <Select
                  id="arrivalTime"
                  onChange={handleChange}
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="12:00">00:00</option>
                  <option value="1:00">1:00</option>
                  <option value="2:00">2:00</option>
                  <option value="3:00">3:00</option>
                  <option value="4:00">4:00</option>
                  <option value="5:00">5:00</option>
                  <option value="6:00">6:00</option>
                  <option value="7:00">7:00</option>
                  <option value="8:00">8:00</option>
                  <option value="9:00">9:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                  <option value="22:00">22:00</option>
                  <option value="23:00">23:00</option>
                </Select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="carrierOutToPalo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Carrier out of Palo"
                />

                <Select
                  id="carrierOutOfPalo"
                  onChange={handleChange}
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Airplane">Airplane</option>
                  <option value="Bus">Bus</option>
                </Select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="departuredate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Date of Departure"
                />
                <Datepicker
                  id="departureDate"
                  onSelectedDateChanged={(date) =>
                    handleDepartureChange({
                      value: moment(date).format("MM/DD/YYYY"),
                    })
                  }
                  // onSelectedDateChanged={handleDateChange}
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="departureTime"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Estimated Time of Departure"
                />
                <Select
                  id="departureTime"
                  onChange={handleChange}
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="12:00">00:00</option>
                  <option value="1:00">1:00</option>
                  <option value="2:00">2:00</option>
                  <option value="3:00">3:00</option>
                  <option value="4:00">4:00</option>
                  <option value="5:00">5:00</option>
                  <option value="6:00">6:00</option>
                  <option value="7:00">7:00</option>
                  <option value="8:00">8:00</option>
                  <option value="9:00">9:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                  <option value="22:00">22:00</option>
                  <option value="23:00">23:00</option>
                </Select>
              </div>
            </div>
          </div>
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Health Declaration (Leave empty if none)
            </h3>

            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="allergy"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Allergy: Have you ever suffered from any allergy? (e.g. medicine, food, etc.)"
                />

                <TextInput
                  type="text"
                  id="allergy"
                  onChange={handleChange}
                  placeholder="If yes, please provide details"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="medication"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Are you on regular medication?"
                />
                <TextInput
                  type="text"
                  id="medication"
                  onChange={handleChange}
                  placeholder="If yes, please provide details"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="diet"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Do you have a special diet? (e.g. vegetarian, meat, fish, salt, etc.)"
                />
                <TextInput
                  type="text"
                  id="diet"
                  onChange={handleChange}
                  placeholder="If yes, please provide details"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="disability"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Are you a PWD who will require mobility assistance?"
                />

                <TextInput
                  type="text"
                  id="disability"
                  onChange={handleChange}
                  placeholder="If yes, please provide details"
                  required
                />
              </div>
            </div>
          </div>

          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Attachments (maximum of 3 MB)
            </h3>

            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="allergy"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Full Accomplished Autorization and Waiver Form"
                />

                <FileInput
                  id="waiver"
                  accept=".doc, .docx, .pdf"
                  onChange={handleWaiverFileChange}
                  required
                />
                {file ? (<Progress
                  progress={fileUploadProgress}
                  // progress={45}
                  progressLabelPosition="inside"
                  textLabel="Lode"
                  size="lg"
                  className="mt-4"
                  labelProgress
                />) : (<></>)}
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="medication"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Proof of Payment"
                />
                <FileInput
                  id="payment"
                  onChange={handlePaymentFileChange}
                  required
                />

                {paymentFile ? (<Progress
                  progress={paymentFileUploadProgress}
                  // progress={45}
                  progressLabelPosition="inside"
                  textLabel="Lode"
                  size="lg"
                  className="mt-4"
                  labelProgress
                />) : (<></>)}
              </div>
            </div>
            <div className="mt-10 flex items-center justify-center">
              <Button
                // type="submit"
                onClick={() => setOpenConfirmModal(true)}
                className="w-60 bg-indigo-950 dark:bg-indigo-950"
                //   disabled={loading}
              >
                Save all
              </Button>
              {/* <Button color="blue" className='w-60'>Save All</Button> */}
            </div>
            <Modal dismissible show={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
              <Modal.Header>Terms of Service</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  By submitting this registration form, you are confirming that the data provided is accurate and factual. Your commitment to providing correct information is appreciated and essential for us to serve you better. Rest assured, the data you share with us is handled with the utmost care and confidentiality. 
                  </p>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={handleSubmit}>I accept</Button>
                <Button color="gray" onClick={() => setOpenConfirmModal(false)}>
                  Decline
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </form>
  );
}
