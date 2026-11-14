import {Outlet} from "react-router-dom";
// import { useState, useEffect } from "react";
// import { utilityFunctions } from "../utils/module";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {ToastContainer} from 'react-toastify';

function PublicLayout() {
    // const [token, setToken] = useState(utilityFunctions.checkCookieExists('userAuthToken'));
    return (
        <>
            <Navbar/>
            <Outlet/>
            <hr/>
            <Footer/>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    )
}

export default PublicLayout;