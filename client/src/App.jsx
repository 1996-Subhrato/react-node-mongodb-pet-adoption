import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import {createContext, useState, lazy, Suspense} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

// Public
const PublicLayout = lazy(() => import("./layouts/PublicLayout.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const MainAbout = lazy(() => import("./pages/MainAbout.jsx"));
const MainContact = lazy(() => import("./pages/MainContact.jsx"));

// Admin
const AdminLayout = lazy(() => import("./layouts/AdminLayout.jsx"));
const ManageAdmin = lazy(() => import("./pages/admin/ManageAdmin.jsx"));
const ViewAdmin = lazy(() => import("./pages/admin/ViewAdmin.jsx"));
const AdminSignIn = lazy(() => import("./pages/admin/AdminSignIn.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const ManageCategory = lazy(() => import("./pages/admin/ManageCategory.jsx"));
const ViewCategory = lazy(() => import("./pages/admin/ViewCategory.jsx"));
const ManageSubCategory = lazy(() => import("./pages/admin/ManageSubCategory.jsx"));
const ViewSubCategory = lazy(() => import("./pages/admin/ViewSubCategory.jsx"));
const ManagePets = lazy(() => import("./pages/admin/ManagePets.jsx"));
const ViewPets = lazy(() => import("./pages/admin/ViewPets.jsx"));
const PendingRequests = lazy(() => import("./pages/admin/PendingRequests.jsx"));
const Feedback = lazy(() => import("./pages/admin/Feedback.jsx"));
const RequestDonationAdmin = lazy(() => import("./pages/admin/RequestDonationAdmin.jsx"));
const ViewUsers = lazy(() => import("./pages/admin/ViewUsers.jsx"));

const AdminChangePassword = lazy(() => import("./pages/admin/AdminChangePassword.jsx"));

const AdminForgetPassword = lazy(() => import("./pages/admin/AdminForgetPassword.jsx"));
const AdminVerifyOTP = lazy(() => import("./pages/admin/AdminVerifyOTP.jsx"));
const AdminResetPassword = lazy(() => import("./pages/admin/AdminResetPassword.jsx"));

// User
const UserLayout = lazy(() => import("./layouts/UserLayout.jsx"));
const UserSignIn = lazy(() => import("./pages/user/UserSignIn.jsx"));
const ManageUser = lazy(() => import("./pages/user/ManageUser.jsx"));
const UserDashboard = lazy(() => import("./pages/user/UserDashboard.jsx"));
const UserChangePassword = lazy(() => import("./pages/user/UserChangePassword.jsx"));
const Adoption = lazy(() => import("./pages/user/Adoption.jsx"));
const MainAdoption = lazy(() => import("./pages/user/MainAdoption.jsx"));
const AdoptionForm = lazy(() => import("./pages/user/AdoptionForm.jsx"));
const RequestedPets = lazy(() => import("./pages/user/RequestedPets.jsx"));
const PetsGallery = lazy(() => import("./pages/user/PetsGallery.jsx"));
const RequestDonation = lazy(() => import("./pages/user/RequestDonation.jsx"));
const UserContactUs = lazy(() => import("./pages/user/UserContactUs.jsx"));
const MoneyDonation = lazy(() => import("./pages/user/MoneyDonation.jsx"));


const UserForgetPassword = lazy(() => import("./pages/user/UserForgetPassword.jsx"));
const UserVerifyOTP = lazy(() => import("./pages/user/UserVerifyOTP.jsx"));
const UserResetPassword = lazy(() => import("./pages/user/UserResetPassword.jsx"));


const About = lazy(() => import("./pages/user/About.jsx"));


// Preloader Component
const Preloader = () => {
    return (
        <div id="preloader">
            <div className="spinner">
                <div className="bounce1"></div>
            </div>
        </div>
    );
};

function App() {
    // const [count, setCount] = useState(null);

    return (
        <>
            <Suspense fallback={<Preloader/>}>
                <BrowserRouter>
                    {/* common routes */}
                    <Routes>
                        <Route path="/" element={<PublicLayout/>}>
                            <Route index element={<Home/>}/>
                            <Route path="/mainabout" element={<MainAbout/>}/>
                            <Route path="/maincontact" element={<MainContact/>}/>

                            {/* admin */}
                            <Route path="adminsignin" element={<AdminSignIn/>}/>
                            <Route path="adminforgetpassword" element={<AdminForgetPassword/>}/>
                            <Route path="adminverifyotp" element={<AdminVerifyOTP/>}/>
                            <Route path="adminresetpassword" element={<AdminResetPassword/>}/>

                            {/* user */}
                            <Route path="usersignin" element={<UserSignIn/>}/>
                            <Route path="manageuser" element={<ManageUser/>}/>
                            <Route path="userforgetpassword" element={<UserForgetPassword/>}/>
                            <Route path="userverifyotp" element={<UserVerifyOTP/>}/>
                            <Route path="userresetpassword" element={<UserResetPassword/>}/>
                        </Route>

                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminLayout/>}>
                            <Route path="manageadmin" element={<ManageAdmin/>}/>
                            <Route path="viewadmin" element={<ViewAdmin/>}/>
                            <Route path="admindashboard" element={<AdminDashboard/>}/>
                            <Route path="managecategory" element={<ManageCategory/>}/>
                            <Route path="viewcategory" element={<ViewCategory/>}/>
                            <Route path="managesubcategory" element={<ManageSubCategory/>}/>
                            <Route path="viewsubcategory" element={<ViewSubCategory/>}/>
                            <Route path="managepets" element={<ManagePets/>}/>
                            <Route path="viewpets" element={<ViewPets/>}/>
                            <Route
                                path="adminchangePassword"
                                element={<AdminChangePassword/>}
                            />
                            <Route path="pendingrequests" element={<PendingRequests/>}/>
                            <Route path="feedback" element={<Feedback/>}/>
                            <Route path="requestfordonationadmin" element={<RequestDonationAdmin/>}/>
                            <Route path="viewusers" element={<ViewUsers/>}/>

                        </Route>

                        <Route path="/user" element={<UserLayout/>}>
                            <Route path="userdashboard" element={<UserDashboard/>}/>
                            <Route path="userchangepassword" element={<UserChangePassword/>}/>
                            <Route path="about" element={<About/>}/>
                            <Route path="adoption-page" element={<Adoption/>}/>
                            <Route path="mainadoption/:id" element={<MainAdoption/>}/>
                            <Route path="adoptionform/:petId" element={<AdoptionForm/>}/>
                            <Route path="requestedpets" element={<RequestedPets/>}/>
                            <Route path="petsgallery" element={<PetsGallery/>}/>
                            <Route path="requestfordonation" element={<RequestDonation/>}/>
                            <Route path="user-contactus" element={<UserContactUs/>}/>
                            <Route path="money-donation" element={<MoneyDonation/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Suspense>
        </>
    );
}

export default App;
