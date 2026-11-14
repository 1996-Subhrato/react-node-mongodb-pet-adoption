// import { ToastContainer } from 'react-toastify';
import {useState, useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import Footer from "../components/Footer";
import UserNavbar from "../components/UserNavbar";
import {ToastContainer} from 'react-toastify';
import {utilityFunctions} from "../utils/module";

function UserLayout() {
    const [render, setRender] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (utilityFunctions.checkCookieExists("userAuthToken")) {
            setRender(true);
        } else {
            navigate("/usersignin");
        }
    }, []);

    return (
        <>
            {render ? (
                <>
                    <UserNavbar/>
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
            ) : null}
        </>
    );
}

export default UserLayout;