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
  Modal,
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
import { HiCheck, HiX, HiInformationCircle } from "react-icons/hi";
import moment from "moment/moment.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Toaster, toast } from "sonner";

export default function Registration() {
  const [formData, setFormData] = useState({});
  const [updateFormData, setUpdateFormData] = useState({});
  const { error, currentRegister } = useSelector((state) => state.register);
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

  const [showAlert, setShowAlert] = useState(false);

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
    console.log(paymentFile);
  };

  useEffect(() => {
    if (file) {
      uploadWaiverFile();
    }
  }, [file]);

  useEffect(() => {
    if (paymentFile) {
      uploadPaymentFile();
      console.log(paymentFile)
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
        toast.error("Could not upload file (File must be less than 2MB)");
        setFileUploadProgress(null);
        setFile(null);
        setFileUrl(null);
        setFileUploading(false);
        return;
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
        toast.error(error.message);
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

    if (currentUser.isRegistered) {
      navigate("/dashboard?tab=profile");
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
      // !formData.allergy ||
      // !formData.medication ||
      // !formData.diet ||
      // !formData.disability ||
      !formData.arrivalDate ||
      !formData.arrivalTime ||
      !formData.carrierOutOfPalo ||
      !formData.carrierToPalo ||
      !formData.departureDate ||
      !formData.departureTime ||
      !formData.waiver ||
      !formData.proofOfPayment
    ) {
      
      dispatch(registerFailure("Please fill all the required fields"));
      toast.error("Please fill all the required fields");
      // setOpenConfirmModal(false);
      return;
    } else {
      setOpenConfirmModal(true);

    }
    

    // navigate("/dashboard?tab=profile");

    
  };

  const confirmSubmit = async () => {
try {
      dispatch(registerStart());
      const res = await fetch("/api/reg/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setOpenConfirmModal(false);
        dispatch(registerFailure(data.message));
        toast.error(data.message)
      }

      if (res.ok) {
        dispatch(registerSuccess(data));
        toast.success('Successful regisration.')

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
            toast.error(data.message)
          }
          dispatch(updateSuccess(data));
          navigate("/dashboard?tab=profile");
        } catch (error) {
          setOpenConfirmModal(false);
          dispatch(updateFailure(error.message));
          toast.error(error.message)
        }
      }
    } catch (error) {
      setOpenConfirmModal(false);
      dispatch(registerFailure(error.message));
      toast.error(error.message)
    }
  } 

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-max mx-auto grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
        <div className="mb-4 col-span-full xl:mb-2">
          <Toaster richColors position="top-center" expand={true} />
          {/* {error && (
            <Alert color="failure" icon={HiInformationCircle}>
              <span className="font-medium">{error}</span>
            </Alert>
          )} */}

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
                htmlFor="dioceseOrOrg"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                value="Diocese/Organization"
              />
              <Select
                id="dioceseOrOrg"
                onChange={handleChange}
                required
                // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option value="">Select here</option>
                <option value="Apostolic Vicariate of Bontoc-Lagawe">
                  Apostolic Vicariate of Bontoc-Lagawe
                </option>
                <option value="Apostolic Vicariate of Calapan">
                  Apostolic Vicariate of Calapan
                </option>
                <option value="Apostolic Vicariate of Jolo">
                  Apostolic Vicariate of Jolo
                </option>
                <option value="Apostolic Vicariate of Puerto Princesa">
                  Apostolic Vicariate of Puerto Princesa
                </option>
                <option value="Apostolic Vicariate of San Jose">
                  Apostolic Vicariate of San Jose
                </option>
                <option value="Apostolic Vicariate of Tabuk">
                  Apostolic Vicariate of Tabuk
                </option>
                <option value="Apostolic Vicariate of Taytay">
                  Apostolic Vicariate of Taytay
                </option>
                <option value="Archdiocese of Caceres">
                  Archdiocese of Caceres
                </option>
                <option value="Archdiocese of Cagayan de Oro">
                  Archdiocese of Cagayan de Oro
                </option>
                <option value="Archdiocese of Capiz">
                  Archdiocese of Capiz
                </option>
                <option value="Archdiocese of Cebu">Archdiocese of Cebu</option>
                <option value="Archdiocese of Cotabato">
                  Archdiocese of Cotabato
                </option>
                <option value="Archdiocese of Davao">
                  Archdiocese of Davao
                </option>
                <option value="Archdiocese of Jaro">Archdiocese of Jaro</option>
                <option value="Archdiocese of Lingayen-Dagupan">
                  Archdiocese of Lingayen-Dagupan
                </option>
                <option value="Archdiocese of Lipa">Archdiocese of Lipa</option>
                <option value="Archdiocese of Manila">
                  Archdiocese of Manila
                </option>
                <option value="Archdiocese of Nueva Segovia">
                  Archdiocese of Nueva Segovia
                </option>
                <option value="Archdiocese of Ozamis ">
                  Archdiocese of Ozamis{" "}
                </option>
                <option value="Archdiocese of Palo">Archdiocese of Palo</option>
                <option value="Archdiocese of San Fernando ">
                  Archdiocese of San Fernando{" "}
                </option>
                <option value="Archdiocese of Tuguegarao">
                  Archdiocese of Tuguegarao
                </option>
                <option value="Archdiocese of Zamboanga">
                  Archdiocese of Zamboanga
                </option>
                <option value="Diocese of Alaminos">Diocese of Alaminos</option>
                <option value="Diocese of Antipolo">Diocese of Antipolo</option>
                <option value="Diocese of Bacolod">Diocese of Bacolod</option>
                <option value="Diocese of Baguio">Diocese of Baguio</option>
                <option value="Diocese of Balanga">Diocese of Balanga</option>
                <option value="Diocese of Bangued">Diocese of Bangued</option>
                <option value="Diocese of Bayombong">
                  Diocese of Bayombong
                </option>
                <option value="Diocese of Boac">Diocese of Boac</option>
                <option value="Diocese of Borongan">Diocese of Borongan</option>
                <option value="Diocese of Butuan">Diocese of Butuan</option>
                <option value="Diocese of Cabanatuan">
                  Diocese of Cabanatuan
                </option>
                <option value="Diocese of Calbayog">Diocese of Calbayog</option>
                <option value="Diocese of Catarman">Diocese of Catarman</option>
                <option value="Diocese of Cubao">Diocese of Cubao</option>
                <option value="Diocese of Daet">Diocese of Daet</option>
                <option value="Diocese of Digos">Diocese of Digos</option>
                <option value="Diocese of Dipolog">Diocese of Dipolog</option>
                <option value="Diocese of Dumaguete ">
                  Diocese of Dumaguete{" "}
                </option>
                <option value="Diocese of Gumaca">Diocese of Gumaca</option>
                <option value="Diocese of Iba">Diocese of Iba</option>
                <option value="Diocese of Ilagan">Diocese of Ilagan</option>
                <option value="Diocese of Iligan">Diocese of Iligan</option>
                <option value="Diocese of Imus">Diocese of Imus</option>
                <option value="Diocese of Ipil">Diocese of Ipil</option>
                <option value="Diocese of Kabankalan">
                  Diocese of Kabankalan
                </option>
                <option value="Diocese of Kalibo">Diocese of Kalibo</option>
                <option value="Diocese of Kalookan">Diocese of Kalookan</option>
                <option value="Diocese of Kidapawan">
                  Diocese of Kidapawan
                </option>
                <option value="Diocese of Laoag">Diocese of Laoag</option>
                <option value="Diocese of Legazpi">Diocese of Legazpi</option>
                <option value="Diocese of Libmanan">Diocese of Libmanan</option>
                <option value="Diocese of Lucena">Diocese of Lucena</option>
                <option value="Diocese of Maasin">Diocese of Maasin</option>
                <option value="Diocese of Malaybalay">
                  Diocese of Malaybalay
                </option>
                <option value="Diocese of Malolos">Diocese of Malolos</option>
                <option value="Diocese of Marbel">Diocese of Marbel</option>
                <option value="Diocese of Masbate">Diocese of Masbate</option>
                <option value="Diocese of Mati">Diocese of Mati</option>
                <option value="Diocese of Naval">Diocese of Naval</option>
                <option value="Diocese of Novaliches">
                  Diocese of Novaliches
                </option>
                <option value="Diocese of Pagadian">Diocese of Pagadian</option>
                <option value="Diocese of Parañaque">
                  Diocese of Parañaque
                </option>
                <option value="Diocese of Pasig">Diocese of Pasig</option>
                <option value="Diocese of Romblon">Diocese of Romblon</option>
                <option value="Diocese of San Carlos">
                  Diocese of San Carlos
                </option>
                <option value="Diocese of San Fernando (La Union)">
                  Diocese of San Fernando (La Union)
                </option>
                <option value="Diocese of San Jose (Nueva Ecija)">
                  Diocese of San Jose (Nueva Ecija)
                </option>
                <option value="Diocese of San Jose, Antique">
                  Diocese of San Jose, Antique
                </option>
                <option value="Diocese of San Pablo">
                  Diocese of San Pablo
                </option>
                <option value="Diocese of Sorsogon">Diocese of Sorsogon</option>
                <option value="Diocese of Surigao">Diocese of Surigao</option>
                <option value="Diocese of Tagbilaran ">
                  Diocese of Tagbilaran{" "}
                </option>
                <option value="Diocese of Tagum">Diocese of Tagum</option>
                <option value="Diocese of Talibon">Diocese of Talibon</option>
                <option value="Diocese of Tandag">Diocese of Tandag</option>
                <option value="Diocese of Tarlac">Diocese of Tarlac</option>
                <option value="Diocese of Urdaneta">Diocese of Urdaneta</option>
                <option value="Diocese of Virac">Diocese of Virac</option>
                <option value="Military Ordinariate of the Philippines">
                  Military Ordinariate of the Philippines
                </option>
                <option value="Prelature of Batanes">
                  Prelature of Batanes
                </option>
                <option value="Prelature of Infanta">
                  Prelature of Infanta
                </option>
                <option value="Prelature of Isabela">
                  Prelature of Isabela
                </option>
                <option value="Prelature of Marawi">Prelature of Marawi</option>
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
                  required
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="MR.">MR.</option>
                  <option value="MS.">MS.</option>
                  <option value="FR.">FR.</option>
                  <option value="BR.">BR.</option>
                  <option value="SR.">SR.</option>
                  <option value="REV.">REV.</option>
                  <option value="REV. MSGR.">REV. MSGR.</option>
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
                  required
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="X-Small">X-Small</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="X-Large">X-Large</option>
                  <option value="XX-Large">XX-Large</option>
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
                  required
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Airplane">Airplane</option>
                  <option value="Boat">Boat</option>
                  <option value="Public Bus">Public Bus</option>
                  <option value="Private Vehicle">Private Vehicle</option>
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
                  required
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="00:00">00:00</option>
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
                  required
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Airplane">Airplane</option>
                  <option value="Boat">Boat</option>
                  <option value="Public Bus">Public Bus</option>
                  <option value="Private Vehicle">Private Vehicle</option>
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
                  required
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="00:00">00:00</option>
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
                />
              </div>
            </div>
          </div>

          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Attachments (maximum of 2 MB)
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
                  accept=".doc, .docx, .pdf, image/*"
                  onChange={handleWaiverFileChange}
                  required
                />
                {file ? (
                  <Progress
                    progress={fileUploadProgress}
                    // progress={45}
                    progressLabelPosition="inside"
                    textLabel="Lode"
                    size="lg"
                    className="mt-4"
                    labelProgress
                  />
                ) : (
                  <></>
                )}
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="medication"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Proof of Payment"
                />
                <FileInput
                  id="payment"
                  accept="image/*"
                  onChange={handlePaymentFileChange}
                  required
                />

                {paymentFile ? (
                  <Progress
                    progress={paymentFileUploadProgress}
                    // progress={45}
                    progressLabelPosition="inside"
                    textLabel="Lode"
                    size="lg"
                    className="mt-4"
                    labelProgress
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="mt-10 flex items-center justify-center">
              <Button
                type="submit"
                // onClick={() => setOpenConfirmModal(true)}
                className="w-60 bg-indigo-950 dark:bg-indigo-950"
                //   disabled={loading}
              >
                Save all
              </Button>
              {/* <Button color="blue" className='w-60'>Save All</Button> */}
            </div>
            <Modal
              dismissible
              show={openConfirmModal}
              onClose={() => setOpenConfirmModal(false)}
            >
              <Modal.Header>Terms of Service</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    By submitting this registration form, you are confirming
                    that the data provided is accurate and factual. Your
                    commitment to providing correct information is appreciated
                    and essential for us to serve you better. Rest assured, the
                    data you share with us is handled with the utmost care and
                    confidentiality.
                  </p>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={confirmSubmit}>I accept</Button>
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
