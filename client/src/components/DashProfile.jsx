import {
  Alert,
  Button,
  Modal,
  ModalBody,
  TextInput,
  Label,
  Select,
  Datepicker,
  FileInput,
  Progress,
  Toast,
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
  updateRegFailure,
} from "../redux/register/registerSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle, HiX, HiCheck } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment/moment.js";
import { Toaster, toast } from "sonner";

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
  const [paymentFileUploadProgress, setPaymentFileUploadProgress] =
    useState(null);
  const [paymentFileUploadError, setPaymentFileUploadError] = useState(null);
  const [paymentFileUploading, setPaymentFileUploading] = useState(false);

  const [showModal, setShowModal] = useState(true);
  const [formData, setFormData] = useState({});
  const [profileFormData, setProfileFormData] = useState({});

  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const filePickerRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser.isRegistered) {
      navigate("/dashboard?tab=profile");
      window.location.hash = "#dashProf";
    } else {
      navigate("/registration");
    }
  }, [currentUser]);

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
        toast.error("Could not upload file (File must be less than 2MB)");
        setFileUploadProgress(null);
        setFile(null);
        setFileUrl(null);
        setFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileUrl(downloadURL);
          setProfileFormData({ ...formData, waiver: downloadURL });
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
        toast.error("Could not upload file (File must be less than 2MB)");
        setPaymentFileUploadProgress(null);
        setPaymentFile(null);
        setPaymentFileUrl(null);
        setPaymentFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPaymentFileUrl(downloadURL);
          setProfileFormData({ ...formData, proofOfPayment: downloadURL });
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
        toast.error("Could not upload file (File must be less than 2MB)");
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

    if (Object.keys(formData).length === 0) {
      setOpenConfirmModal(false);
      toast.error("No changes made in sign in info");
      return;
    }
    if (imageFileUploading) {
      setOpenConfirmModal(false);
      toast.error("Please wait for image to upload");
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
        toast.error(data.message);
      } else {
        dispatch(updateSuccess(data));
        toast.success("User's sign in details updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleProfileUpdateSubmit = async (e) => {
    e.preventDefault();

    if (fileUploading || paymentFileUploading) {
      setOpenConfirmModal(false);
      toast.error("Please wait for files to upload");
      return;
    }

    if (Object.keys(profileFormData).length === 0) {
      setOpenConfirmModal(false);
      toast.error("No changes made in profile");
      return;
    } else {
      setOpenConfirmModal(true);
    }
  };

  const confirmSubmit = async () => {
    try {
      dispatch(updateRegStart());
      const res = await fetch(
        `/api/reg/update/${currentRegister._id}/${currentUser._id}/${currentUser.isAdmin}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileFormData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateRegFailure(data.message));
        toast.error(data.message);
        setOpenConfirmModal(false);
      } else {
        dispatch(updateRegSuccess(data));
        toast.success("User profile updated successfully");
        setOpenConfirmModal(false);
      }
    } catch (error) {
      dispatch(updateRegFailure(error.message));
      toast.error(error.message);
      setOpenConfirmModal(false);
    }
  };
  const subStr = (str) => {
    return str.substring(str.indexOf("%2F") + 3, str.lastIndexOf("?alt"));
  };
  return (
    <div
      id="dashProf"
      className="max-w-max mx-auto grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 bg-gradient-to-r from-red-800 via-orange-600 to-yellow-400 dark:bg-gray-900"
    >
      <div className="mb-4 col-span-full xl:mb-2">
        <Toaster richColors position="top-center" expand={true} />
        {currentUser && !currentUser.isAccepted && currentUser.isRegistered ? (
          <span>
            <Toast color="error" className="mt-5 max-w-full mb-5 bg-green-200">
              <div className="inline-flex shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                <HiCheck className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal text-green-700">
                Thank you for filling-out registration form ka-lakbay! The
                administrator will review your account.
              </div>
              <Toast.Toggle />
            </Toast>
          </span>
        ) : (
          <></>
        )}

        <h1 className="text-xl font-semibold text-white sm:text-3xl dark:text-white">
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
                className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
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
                type="submit"
                className="w-60 font-semibold bg-indigo-950 dark:bg-orange-500"
              >
                Update User Sign In
              </Button>
            </div>
          </form>

          <div className="mt-5 flex flex-col items-center justify-center">
            <QRCode
              value={currentUser && currentUser._id}
              className="mt-5 p-5 self-center"
            />
            <span className="text-indigo-950 italic dark:text-white">
              Present this QR to record attendance.
            </span>
          </div>

          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size="md"
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiCheck className="mx-auto mb-4 h-14 w-14 text-gray-600 dark:text-gray-600" />
                <h3 className="mb-5 text-lg font-normal text-gray-600 dark:text-gray-600">
                  Thank you for filling-out registration form. The administrator
                  will now be able to review your account. Kindly update your
                  profile photo for better identification.
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    className="bg-indigo-950 dark:bg-orange-500"
                    onClick={() => setShowModal(false)}
                  >
                    {"Okay"}
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold dark:text-white">
            Workshops
          </h3>
          {currentUser.issue_based ? (
            <div className="mb-4">
              <Label
                htmlFor="email"
                className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                value="Capacity-Based"
              />
              <TextInput
                type="text"
                defaultValue={currentUser && currentUser.issue_based.title}
                id="capacity_based"
                disabled
              />
            </div>
          ) : (
            <p> No enrolled issue-based workshop</p>
          )}
          {currentUser.capacity_based ? (
            <div className="mb-6">
              <Label
                htmlFor="password"
                className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                value="Issue-Based"
              />
              <TextInput
                type="text"
                value={currentUser && currentUser.capacity_based.title}
                id="password"
                disabled
              />
            </div>
          ) : (
            <p> No enrolled capacity-based workshop</p>
          )}
          <div className="mt-10 flex items-center justify-center">
            <Button
              onClick={(e) => {
                navigate("/workshops");
              }}
              className="w-60 font-semibold bg-indigo-950 dark:bg-orange-500"
            >
              View Workshops
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
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.dioceseOrOrg}
                  disabled={currentUser.isAccepted}
                  required
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
                  <option value="Archdiocese of Cebu">
                    Archdiocese of Cebu
                  </option>
                  <option value="Archdiocese of Cotabato">
                    Archdiocese of Cotabato
                  </option>
                  <option value="Archdiocese of Davao">
                    Archdiocese of Davao
                  </option>
                  <option value="Archdiocese of Jaro">
                    Archdiocese of Jaro
                  </option>
                  <option value="Archdiocese of Lingayen-Dagupan">
                    Archdiocese of Lingayen-Dagupan
                  </option>
                  <option value="Archdiocese of Lipa">
                    Archdiocese of Lipa
                  </option>
                  <option value="Archdiocese of Manila">
                    Archdiocese of Manila
                  </option>
                  <option value="Archdiocese of Nueva Segovia">
                    Archdiocese of Nueva Segovia
                  </option>
                  <option value="Archdiocese of Ozamis ">
                    Archdiocese of Ozamis{" "}
                  </option>
                  <option value="Archdiocese of Palo">
                    Archdiocese of Palo
                  </option>
                  <option value="Archdiocese of San Fernando ">
                    Archdiocese of San Fernando{" "}
                  </option>
                  <option value="Archdiocese of Tuguegarao">
                    Archdiocese of Tuguegarao
                  </option>
                  <option value="Archdiocese of Zamboanga">
                    Archdiocese of Zamboanga
                  </option>
                  <option value="Canossian Youth in the Philippines">
                    Canossian Youth in the Philippines
                  </option>
                  <option value="Carmel Youth Philippines">
                    Carmel Youth Philippines
                  </option>
                  <option value="Carmelite Missionaries Youth">
                    Carmelite Missionaries Youth
                  </option>
                  <option value="CFC- Singles for Christ">
                    CFC- Singles for Christ
                  </option>
                  <option value="CFC-Youth for Christ">
                    CFC-Youth for Christ
                  </option>
                  <option value="Chiro Youth Movement">
                    Chiro Youth Movement
                  </option>
                  <option value="Christian Life Community in the Philippines">
                    Christian Life Community in the Philippines
                  </option>
                  <option value="Christ's Youth in Action">
                    Christ's Youth in Action
                  </option>
                  <option value="Columbian Squires">Columbian Squires</option>
                  <option value="Daughters of St. Paul">
                    Daughters of St. Paul
                  </option>
                  <option value="Diocese of Alaminos">
                    Diocese of Alaminos
                  </option>
                  <option value="Diocese of Antipolo">
                    Diocese of Antipolo
                  </option>
                  <option value="Diocese of Bacolod">Diocese of Bacolod</option>
                  <option value="Diocese of Baguio">Diocese of Baguio</option>
                  <option value="Diocese of Balanga">Diocese of Balanga</option>
                  <option value="Diocese of Bangued">Diocese of Bangued</option>
                  <option value="Diocese of Bayombong">
                    Diocese of Bayombong
                  </option>
                  <option value="Diocese of Boac">Diocese of Boac</option>
                  <option value="Diocese of Borongan">
                    Diocese of Borongan
                  </option>
                  <option value="Diocese of Butuan">Diocese of Butuan</option>
                  <option value="Diocese of Cabanatuan">
                    Diocese of Cabanatuan
                  </option>
                  <option value="Diocese of Calbayog">
                    Diocese of Calbayog
                  </option>
                  <option value="Diocese of Catarman">
                    Diocese of Catarman
                  </option>
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
                  <option value="Diocese of Kalookan">
                    Diocese of Kalookan
                  </option>
                  <option value="Diocese of Kidapawan">
                    Diocese of Kidapawan
                  </option>
                  <option value="Diocese of Laoag">Diocese of Laoag</option>
                  <option value="Diocese of Legazpi">Diocese of Legazpi</option>
                  <option value="Diocese of Libmanan">
                    Diocese of Libmanan
                  </option>
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
                  <option value="Diocese of Pagadian">
                    Diocese of Pagadian
                  </option>
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
                  <option value="Diocese of Sorsogon">
                    Diocese of Sorsogon
                  </option>
                  <option value="Diocese of Surigao">Diocese of Surigao</option>
                  <option value="Diocese of Tagbilaran ">
                    Diocese of Tagbilaran{" "}
                  </option>
                  <option value="Diocese of Tagum">Diocese of Tagum</option>
                  <option value="Diocese of Talibon">Diocese of Talibon</option>
                  <option value="Diocese of Tandag">Diocese of Tandag</option>
                  <option value="Diocese of Tarlac">Diocese of Tarlac</option>
                  <option value="Diocese of Urdaneta">
                    Diocese of Urdaneta
                  </option>
                  <option value="Diocese of Virac">Diocese of Virac</option>
                  <option value="ELIM Singles">ELIM Singles</option>
                  <option value="ELIM Youth">ELIM Youth</option>
                  <option value="Eucharistic Youth Movement">
                    Eucharistic Youth Movement
                  </option>
                  <option value="Filipino - Chinese Catholic Youth">
                    Filipino - Chinese Catholic Youth
                  </option>
                  <option value="Immaculate Conception Academy-Greenhills">
                    Immaculate Conception Academy-Greenhills
                  </option>
                  <option value="IT Youth">IT Youth</option>
                  <option value="Joseph Marello Youth">
                    Joseph Marello Youth
                  </option>
                  <option value="Mary Help of Christians Crusade">
                    Mary Help of Christians Crusade
                  </option>
                  <option value="Military Ordinariate of the Philippines">
                    Military Ordinariate of the Philippines
                  </option>
                  <option value="Missionary Families of Christ - Singles">
                    Missionary Families of Christ - Singles
                  </option>
                  <option value="Missionary Families of Christ - Youth">
                    Missionary Families of Christ - Youth
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
                  <option value="Prelature of Marawi">
                    Prelature of Marawi
                  </option>
                  <option value="Recollect Augustinian Youth">
                    Recollect Augustinian Youth
                  </option>
                  <option value="Redemptorist Youth Ministry">
                    Redemptorist Youth Ministry
                  </option>
                  <option value="Salesian Youth Movement">
                    Salesian Youth Movement
                  </option>
                  <option value="Singles for Christ">Singles for Christ</option>
                  <option value="Student Catholic Action of the Philippines">
                    Student Catholic Action of the Philippines
                  </option>
                  <option value="The Lord's Flock">The Lord's Flock</option>
                  <option value="Young Franciscan Advocates">
                    Young Franciscan Advocates
                  </option>
                  <option value="Youth for Christ">Youth for Christ</option>
                  <option value="Youth for Mary and Christ">
                    Youth for Mary and Christ
                  </option>
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
                  defaultValue={
                    currentRegister && currentRegister.parishOrLocalUnit
                  }
                  required
                  disabled={currentUser.isAccepted}
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
                  disabled={currentUser.isAccepted}
                  required
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
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  value="Nickname"
                />
                <TextInput
                  type="text"
                  id="nickname"
                  onChange={handleProfileChange}
                  defaultValue={currentRegister && currentRegister.nickname}
                  disabled={currentUser.isAccepted}
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
                  placeholder="Juan"
                  disabled={currentUser.isAccepted}
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <div>
                  <Label
                    htmlFor="middleName"
                    className=" mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    value="Middle Name"
                  />
                </div>
                <TextInput
                  type="text"
                  id="middleName"
                  defaultValue={currentRegister && currentRegister.middleName}
                  disabled={currentUser.isAccepted}
                  onChange={handleChange}
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
                  placeholder="Juan"
                  disabled={currentUser.isAccepted}
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
                  disabled={currentUser.isAccepted}
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
                  placeholder="e.g. 09951234567"
                  disabled={currentUser.isAccepted}
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
                  placeholder="e.g. California"
                  disabled={currentUser.isAccepted}
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
                  disabled={currentUser.isAccepted}
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
                  disabled={currentUser.isAccepted}
                  required
                >
                  <option value="">Select here</option>
                  <option value="X-Small">X-Small</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="X-Large">X-Large</option>
                  <option value="2X-Large">2X-Large</option>
                  <option value="3X-Large">3X-Large</option>
                  <option value="4X-Large">4X-Large</option>
                  <option value="5X-Large">5X-Large</option>
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
                  disabled={currentUser.isAccepted}
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
                  disabled={currentUser.isAccepted}
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
                  disabled={currentUser.isAccepted}
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
                  defaultValue={
                    currentRegister && currentRegister.carrierToPalo
                  }
                  onChange={handleProfileChange}
                  disabled={currentUser.isAccepted}
                  required
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
                  defaultDate={
                    new Date(currentRegister && currentRegister.arrivalDate)
                  }
                  onSelectedDateChanged={(date) =>
                    handleArrivalChange({
                      value: moment(date).format("MM/DD/YYYY"),
                    })
                  }
                  // onSelectedDateChanged={handleDateChange}
                  disabled={currentUser.isAccepted}
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
                  defaultValue={currentRegister && currentRegister.arrivalTime}
                  onChange={handleProfileChange}
                  disabled={currentUser.isAccepted}
                  required
                >
                  <option value="">Select here</option>
                  <option value="12:00 AM">12:00 AM</option>
                  <option value="1:00 AM">1:00 AM</option>
                  <option value="2:00 AM">2:00 AM</option>
                  <option value="3:00 AM">3:00 AM</option>
                  <option value="4:00 AM">4:00 AM</option>
                  <option value="5:00 AM">5:00 AM</option>
                  <option value="6:00 AM">6:00 AM</option>
                  <option value="7:00 AM">7:00 AM</option>
                  <option value="8:00 AM">8:00 AM</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 AM">12:00 AM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                  <option value="8:00 PM">8:00 PM</option>
                  <option value="9:00 PM">9:00 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                  <option value="11:00 PM">11:00 PM</option>
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
                  defaultValue={
                    currentRegister && currentRegister.carrierOutOfPalo
                  }
                  onChange={handleProfileChange}
                  disabled={currentUser.isAccepted}
                  required
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
                  defaultDate={
                    new Date(currentRegister && currentRegister.departureDate)
                  }
                  onSelectedDateChanged={(date) =>
                    handleDepartureChange({
                      value: moment(date).format("MM/DD/YYYY"),
                    })
                  }
                  disabled={currentUser.isAccepted}
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
                  defaultValue={
                    currentRegister && currentRegister.departureTime
                  }
                  onChange={handleProfileChange}
                  disabled={currentUser.isAccepted}
                  required
                >
                  <option value="">Select here</option>
                  <option value="12:00 AM">12:00 AM</option>
                  <option value="1:00 AM">1:00 AM</option>
                  <option value="2:00 AM">2:00 AM</option>
                  <option value="3:00 AM">3:00 AM</option>
                  <option value="4:00 AM">4:00 AM</option>
                  <option value="5:00 AM">5:00 AM</option>
                  <option value="6:00 AM">6:00 AM</option>
                  <option value="7:00 AM">7:00 AM</option>
                  <option value="8:00 AM">8:00 AM</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 AM">12:00 AM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                  <option value="8:00 PM">8:00 PM</option>
                  <option value="9:00 PM">9:00 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                  <option value="11:00 PM">11:00 PM</option>
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
                  disabled={currentUser.isAccepted}
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
                  disabled={currentUser.isAccepted}
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
                  disabled={currentUser.isAccepted}
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
                  disabled={currentUser.isAccepted}
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
                {!file ? (
                  <li className="truncate">
                    {currentRegister && subStr(currentRegister.waiver)}
                  </li>
                ) : (
                  <></>
                )}
                <Label
                  htmlFor="allergy"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Full Accomplished Autorization and Waiver Form"
                />
                {/* <span>{currentRegister && currentRegister.waiver}</span> */}

                <FileInput
                  id="waiver"
                  accept=".doc, .docx, .pdf"
                  onChange={handleWaiverFileChange}
                  disabled={currentUser.isAccepted}
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
                {!paymentFile ? (
                  <li className="truncate">
                    {currentRegister && subStr(currentRegister.proofOfPayment)}
                  </li>
                ) : (
                  <></>
                )}
                <Label
                  htmlFor="medication"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  value="Proof of Payment"
                />
                <FileInput
                  id="payment"
                  accept="image/*"
                  onChange={handlePaymentFileChange}
                  disabled={currentUser.isAccepted}
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
              {!currentUser.isAccepted ? (
                <Button
                  type="submit"
                  className="w-60 bg-indigo-950 dark:bg-orange-500"
                >
                  Update Registration
                </Button>
              ) : (
                <span className="text-red-500">
                  {" "}
                  Registration form cannot be resubmitted once the user is
                  accepted.
                </span>
              )}
            </div>
            <Modal
              dismissible
              show={openConfirmModal}
              onClose={() => setOpenConfirmModal(false)}
            >
              <Modal.Header>Terms of Service</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <p className="text-base leading-relaxed text-gray-600 dark:text-gray-600">
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
                <Button
                  onClick={confirmSubmit}
                  className="bg-indigo-950 dark:bg-indigo-950"
                >
                  I accept
                </Button>
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
