import {
  Alert,
  Button,
  Modal,
  ModalBody,
  TextInput,
  Label,
  Select,
  Datepicker,
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
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const {
    // loading,
    error: errorMessage,
    currentRegister,
  } = useSelector((state) => state.register);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileFormData, setProfileFormData] = useState({});
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

  const handleSignInUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's sign in details updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleProfileUpdateSubmit = async (e) => {
    e.preventDefault();
    console.log('submitted');
  }

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    // <div className='max-w-lg mx-auto p-3 w-full'>
    //   <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
    //   <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
    //     <input
    //       type='file'
    //       accept='image/*'
    //       onChange={handleImageChange}
    //       ref={filePickerRef}
    //       hidden
    //     />
    //     <div
    //       className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
    //       onClick={() => filePickerRef.current.click()}
    //     >
    //       {imageFileUploadProgress && (
    //         <CircularProgressbar
    //           value={imageFileUploadProgress || 0}
    //           text={`${imageFileUploadProgress}%`}
    //           strokeWidth={5}
    //           styles={{
    //             root: {
    //               width: '100%',
    //               height: '100%',
    //               position: 'absolute',
    //               top: 0,
    //               left: 0,
    //             },
    //             path: {
    //               stroke: `rgba(62, 152, 199, ${
    //                 imageFileUploadProgress / 100
    //               })`,
    //             },
    //           }}
    //         />
    //       )}
    //       <img
    //         src={imageFileUrl || currentUser.profilePicture}
    //         alt='user'
    //         className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
    //           imageFileUploadProgress &&
    //           imageFileUploadProgress < 100 &&
    //           'opacity-60'
    //         }`}
    //       />
    //     </div>
    //     {imageFileUploadError && (
    //       <Alert color='failure'>{imageFileUploadError}</Alert>
    //     )}
    //     <TextInput
    //       type='text'
    //       id='firstname'
    //       placeholder='firstname'
    //       defaultValue={currentUser.firstname}
    //       onChange={handleChange}
    //     />
    //     <TextInput
    //       type='text'
    //       id='lastname'
    //       placeholder='lastname'
    //       defaultValue={currentUser.lastname}
    //       onChange={handleChange}
    //     />
    //     <TextInput
    //       type='email'
    //       id='email'
    //       placeholder='email'
    //       defaultValue={currentUser.email}
    //       onChange={handleChange}
    //     />
    //     <TextInput
    //       type='password'
    //       id='password'
    //       placeholder='password'
    //       onChange={handleChange}
    //     />
    //     <Button
    //       type='submit'
    //       gradientDuoTone='purpleToBlue'
    //       outline
    //       disabled={loading || imageFileUploading}
    //     >
    //       {loading ? 'Loading...' : 'Update'}
    //     </Button>
    //     {currentUser.isAdmin && (
    //       <Link to={'/create-post'}>
    //         <Button
    //           type='button'
    //           gradientDuoTone='purpleToPink'
    //           className='w-full'
    //         >
    //           Create a post
    //         </Button>
    //       </Link>
    //     )}
    //   </form>
    //   <div className='text-red-500 flex justify-between mt-5'>
    //     <span onClick={() => setShowModal(true)} className='cursor-pointer'>
    //       Delete Account
    //     </span>
    //     <span onClick={handleSignout} className='cursor-pointer'>
    //       Sign Out
    //     </span>
    //   </div>
    //   {updateUserSuccess && (
    //     <Alert color='success' className='mt-5'>
    //       {updateUserSuccess}
    //     </Alert>
    //   )}
    //   {updateUserError && (
    //     <Alert color='failure' className='mt-5'>
    //       {updateUserError}
    //     </Alert>
    //   )}
    //   {error && (
    //     <Alert color='failure' className='mt-5'>
    //       {error}
    //     </Alert>
    //   )}
    //   <Modal
    //     show={showModal}
    //     onClose={() => setShowModal(false)}
    //     popup
    //     size='md'
    //   >
    //     <Modal.Header />
    //     <Modal.Body>
    //       <div className='text-center'>
    //         <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
    //         <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
    //           Are you sure you want to delete your account?
    //         </h3>
    //         <div className='flex justify-center gap-4'>
    //           <Button color='failure' onClick={handleDeleteUser}>
    //             Yes, I'm sure
    //           </Button>
    //           <Button color='gray' onClick={() => setShowModal(false)}>
    //             No, cancel
    //           </Button>
    //         </div>
    //       </div>
    //     </Modal.Body>
    //   </Modal>
    // </div>

    <div className="max-w-max mx-auto grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
      <div className="mb-4 col-span-full xl:mb-2">
        {errorMessage && (
          <Alert className="max-w-full mt-5" color="failure">
            {errorMessage}
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
              <div
                className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                onClick={() => filePickerRef.current.click()}
              >
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
                        stroke: `rgba(62, 152, 199, ${
                          imageFileUploadProgress / 100
                        })`,
                      },
                    }}
                  />
                )}
                <img
                  src={imageFileUrl || currentUser.profilePicture}
                  alt="user"
                  className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                    imageFileUploadProgress &&
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
                gradientDuoTone="purpleToPink"
                type="submit"
                className="w-60 font-semibold"
                //   disabled={loading}
              >
                Update Sign In
              </Button>
              {/* <Button color="blue" className='w-60'>Save All</Button> */}
            </div>
          </form>

          <div className="mt-5 flex flex-col items-center justify-center">
            <QRCode value={currentUser && currentUser._id} className="mt-5 p-5 self-center"/>
            <Button
                gradientDuoTone="purpleToPink"
                type="submit"
                className="w-60 font-semibold self-center"
                //   disabled={loading}
              >
                View ID
              </Button>
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <form onSubmit={handleProfileUpdateSubmit}>
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
                  onChange={handleChange}
                  defaultValue={currentRegister.dioceseOrOrg}
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
                <Select
                  id="parishOrLocalUnit"
                  onChange={handleChange}
                  defaultValue={currentRegister.parishOrLocalUnit}
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Parish 1">Parish 1</option>
                  <option value="Local Unit 1">Local Unit 1</option>
                </Select>
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  defaultValue={currentRegister && currentRegister.nickname}
                  // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Green"
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  defaultValue={currentRegister && currentRegister.emerRelation}
                  required
                />
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  defaultValue={currentRegister && currentRegister.disability}
                  placeholder="If yes, please provide details"
                  required
                />
              </div>
            </div>
            <div className="mt-10 flex items-center justify-center">
              <Button
                gradientDuoTone="purpleToPink"
                type="submit"
                className="w-60 font-semibold"
                //   disabled={loading}
              >
                Update Profile
              </Button>
              {/* <Button color="blue" className='w-60'>Save All</Button> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
