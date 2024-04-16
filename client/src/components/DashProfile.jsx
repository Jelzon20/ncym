import {
  Alert,
  Button,
  Modal,
  ModalBody,
  TextInput,
  Label,
  Select,
  Datepicker,
  FileInput
} from "flowbite-react";
import QRCode from "react-qr-code";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import {
  updateRegStart,
  updateRegSuccess,
  updateRegFailure
} from "../redux/register/registerSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";


export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const {
    loading: regLoading,
    error: errorMessage,
    currentRegister,
  } = useSelector((state) => state.register);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

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


  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateRegistrationSuccess, setUpdateRegistrationSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateRegistrationError, setUpdateRegistrationError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileFormData, setProfileFormData] = useState({});

  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const filePickerRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

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
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDateChange = (date) => {
    setProfileFormData({ ...profileFormData, birthday: date.value });
  };

  const handleProfileChange = (e) => {
    setProfileFormData({ ...profileFormData, [e.target.id]: e.target.value });
  };

  const handleSignInUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setOpenConfirmModal(false);
      setUpdateUserError("No changes made in sign in info");
      return;
    }
    if (imageFileUploading) {
      setOpenConfirmModal(false);
      setUpdateUserError("Please wait for image to upload");
      return;
    }

    console.log(formData);
    // try {
    //   dispatch(updateStart());
    //   const res = await fetch(`/api/user/update/${currentUser._id}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });
    //   const data = await res.json();
    //   if (!res.ok) {
    //     dispatch(updateFailure(data.message));
    //     setUpdateUserError(data.message);
    //   } else {
    //     dispatch(updateSuccess(data));
    //     setUpdateUserSuccess("User's sign in details updated successfully");
    //   }
    // } catch (error) {
    //   dispatch(updateFailure(error.message));
    //   setUpdateUserError(error.message);
    // }
  };



  const handleProfileUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateRegistrationError(null);
    setUpdateRegistrationSuccess(null);
    if (Object.keys(profileFormData).length === 0) {
      setOpenConfirmModal(false);
      setUpdateRegistrationError("No changes made in profile");
      return;
    }

    if (fileUploading || paymentFileUploading) {
      setOpenConfirmModal(false);
      setUpdateUserError("Please wait for files to upload");
      return;
    }
    console.log(profileFormData);
    // try {
    //   dispatch(updateRegStart());
    //   const res = await fetch(`/api/reg/update/${currentRegister._id}/${currentUser._id}/${currentUser.isAdmin}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(profileFormData),
    //   });
    //   const data = await res.json();
    //   if (!res.ok) {
    //     dispatch(updateRegFailure(data.message));
    //     setUpdateRegistrationError(data.message);
    //   } else {
    //     dispatch(updateRegSuccess(data));
    //     setUpdateRegistrationSuccess("User's sign in details updated successfully");
    //   }

    // } catch (error) {
    //   dispatch(updateRegFailure(error.message));
    //   setUpdateRegistrationError(error.message);
    // }
  }

  // const handleDeleteUser = async () => {
  //   setShowModal(false);
  //   try {
  //     dispatch(deleteUserStart());
  //     const res = await fetch(`/api/user/delete/${currentUser._id}`, {
  //       method: "DELETE",
  //     });
  //     const data = await res.json();
  //     if (!res.ok) {
  //       dispatch(deleteUserFailure(data.message));
  //     } else {
  //       dispatch(deleteUserSuccess(data));
  //     }
  //   } catch (error) {
  //     dispatch(deleteUserFailure(error.message));
  //   }
  // };

  // const handleSignout = async () => {
  //   try {
  //     const res = await fetch("/api/user/signout", {
  //       method: "POST",
  //     });
  //     const data = await res.json();
  //     if (!res.ok) {
  //       console.log(data.message);
  //     } else {
  //       dispatch(signoutSuccess());
  //       navigate("/sign-in");
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  return (
    <div className="max-w-max mx-auto grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
      <div className="mb-4 col-span-full xl:mb-2">
        {errorMessage && (
          <Alert className="max-w-full mt-5" color="failure">
            {errorMessage}
          </Alert>
        )}
        {updateUserError && (
          <Alert color='failure' className='mt-5'>
            {updateUserError}
          </Alert>
        )}
        {updateUserSuccess && (
          <Alert color='success' className='mt-5'>
            {updateUserSuccess}
          </Alert>
        )}
        {updateRegistrationError && (
          <Alert color='failure' className='mt-5'>
            {updateRegistrationError}
          </Alert>
        )}
        {updateRegistrationSuccess && (
          <Alert color='success' className='mt-5'>
            {updateRegistrationSuccess}
          </Alert>
        )}
        <h1 className="text-xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
          User Settings
        </h1>
      </div>
      {/* <!-- Right Content --> */}
      <div className="col-span-full xl:col-auto">

        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">

          <form onSubmit={handleSignInUpdateSubmit}>
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Sign In info
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={filePickerRef}
              hidden
            />
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                onClick={() => filePickerRef.current.click()} >
                {imageFileUploadProgress && (
                  <CircularProgressbar
                    value={imageFileUploadProgress || 0}
                    text={`${imageFileUploadProgress}%`}
                    strokeWidth={5}
                    styles={{
                      root: {
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      },
                      path: {
                        stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100
                          })`,
                      },
                    }}
                  />
                )}
                <img
                  src={imageFileUrl || currentUser.profilePicture}
                  alt="user"
                  className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress &&
                    imageFileUploadProgress < 100 &&
                    "opacity-60"
                    }`}
                />
              </div>
            </div>

            {imageFileUploadError && (
              <Alert color="failure">{imageFileUploadError}</Alert>
            )}
            <div className="mb-4">
              <Label
                htmlFor="email"
                className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                value="Email"
              />
              <TextInput
                type="email"
                defaultValue={currentUser && currentUser.email}
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <Label
                htmlFor="password"
                className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                defaultValue="Password"
              />
              <TextInput
                type="password"
                value={currentUser && currentUser.password}
                id="password"
                placeholder="**********"
                onChange={handleChange}
              />
            </div>
            <div className="mt-10 flex items-center justify-center">
              <Button
               
                type="submit"
                className="w-60 font-semibold bg-indigo-950 dark:bg-indigo-950"

              //   disabled={loading}
              >
                Update Sign In
              </Button>
              {/* <Button color="blue" className='w-60'>Save All</Button> */}
            </div>
          </form>

          <div className="mt-5 flex flex-col items-center justify-center">
            <QRCode value={currentUser && currentUser._id} className="mt-5 p-5 self-center" />
            <span className="text-indigo-950 italic dark:text-white">
              Present this QR to record attendance.
            </span>
          </div>
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
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
                  <h1 className="text-4xl">Jel</h1>
                </div>
                <h1 className="p-2">Abuyog, Leyte</h1>
                <div className='mt-8 flex w-full justify-between '>
                  <div className="flex flex-col items-start">
                    <div>
                      <Label
                        className="mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                        value={`Diocese/Org: ` + (currentRegister && currentRegister.dioceseOrOrg)}
                      />
                    </div>
                    <div>
                      <Label
                        className="mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                        value={`Parish/Local Unit: ` + (currentRegister && currentRegister.dioceseOrOrg)}
                      />
                    </div>
                    <div>
                      <Label
                        className="mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                        value={`Contact Number: ` + (currentRegister && currentRegister.contactNumber)}
                      />
                    </div>
                  </div>

                  <div>
                    <QRCode size={120} value={currentUser && currentUser._id} className="self-center" />
                  </div>
                </div>
                <div className='mt-8 flex justify-center gap-4 no-print'>
                  <Button gradientDuoTone="purpleToPink" onClick={() => window.print()}>
                    Print
                  </Button>
                  <Button color='gray' onClick={() => setShowModal(false)}>
                    No, close
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
      <div className="col-span-2">
        <form>
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Origin
            </h3>

            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="title"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Diocese/Organization"
                />
                <Select
                  id="dioceseOrOrg"
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.dioceseOrOrg}
                // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Diocese 1">Diocese 1</option>
                  <option value="Organization 1">Organization 1</option>
                </Select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="title"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Parish/Local Unit"
                />
                <TextInput
                  type="text"
                  id="parishOrLocalUnit"
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.parishOrLocalUnit}
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  
                  required
                />
              </div>
            </div>
          </div>

          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Personal Details
            </h3>

            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="title"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Title"
                />
                <Select
                  id="title"
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.title}
                // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                </Select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="nickname"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Nickname"
                />
                <TextInput
                  type="text"
                  id="nickname"
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.nickname}
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="firstname"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="First name"
                />
                <TextInput
                  type="text"
                  id="firstName"
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.firstName}
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Juan"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="lastname"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Last name"
                />
                <TextInput
                  type="text"
                  id="lastName"
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.lastName}
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Juan"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="birthday"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Birthday"
                />
                <Datepicker
                  id="birthday"
                  defaultDate={
                    new Date(currentRegister && currentRegister.birthday)
                  }
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
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Contact Number"
                />
                <TextInput
                  type="number"
                  id="contactNumber"
                  onChange={handleProfileChange}
                  defaultValue={
                    currentRegister && currentRegister.contactNumber
                  }
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="e.g. 09951234567"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="address"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Address"
                />
                <TextInput
                  type="text"
                  id="address"
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.address}
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="e.g. California"
                  required
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="roleInMinistry"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Role In Ministry"
                />
                <TextInput
                  type="text"
                  id="roleInMinistry"
                  onChange={handleProfileChange}
                  defaultValue={
                    currentRegister && currentRegister.roleInMinistry
                  }
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="shirtSize"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Shirt Size"
                />
                <Select
                  id="shirtSize"
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.shirtSize}
                  required
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
              Contact Person (In case of emergency)
            </h3>

            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="title"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Contact Person"
                />
                <TextInput
                  type="text"
                  id="emerContactPerson"
                  onChange={handleProfileChange}
                  defaultValue={
                    currentRegister && currentRegister.emerContactPerson
                  }
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="title"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Contact Number"
                />
                <TextInput
                  type="text"
                  id="emerContactNumber"
                  onChange={handleProfileChange}
                  defaultValue={
                    currentRegister && currentRegister.emerContactNumber
                  }
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="title"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Relation to you"
                />
                <TextInput
                  type="text"
                  id="emerRelation"
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.emerRelation}
                  required
                />
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
                  onChange={handleProfileChange}
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
                  onChange={handleProfileChange}
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
                  onChange={handleProfileChange}
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
                  onChange={handleProfileChange}
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
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Allergy: Have you ever suffered from any allergy? (e.g. medicine, food, etc.)"
                />

                <TextInput
                  type="text"
                  id="allergy"
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.allergy}
                  placeholder="If yes, please provide details"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="medication"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Are you on regular medication?"
                />
                <TextInput
                  type="text"
                  id="medication"
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.medication}
                  placeholder="If yes, please provide details"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="diet"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Do you have a special diet? (e.g. vegetarian, meat, fish, salt, etc.)"
                />
                <TextInput
                  type="text"
                  id="diet"
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.diet}
                  placeholder="If yes, please provide details"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label
                  htmlFor="disability"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Are you a PWD who will require mobility assistance?"
                />

                <TextInput
                  type="text"
                  id="disability"
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.disability}
                  placeholder="If yes, please provide details"
                  required
                />
              </div>
            </div>
            {/* <div className="mt-10 flex items-center justify-center">
              <Button
                
                type="submit"
                className="w-60 font-semibold bg-indigo-950 dark:bg-indigo-950"
              //   disabled={loading}
              >
                Update Profile
              </Button>
            </div> */}
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
                Update Profile
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
                <Button onClick={handleProfileUpdateSubmit}>I accept</Button>
                <Button color="gray" onClick={() => setOpenConfirmModal(false)}>
                  Decline
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </form>
      </div>
    </div>
  );
}
