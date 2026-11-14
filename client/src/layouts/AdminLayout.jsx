// import { ToastContainer } from 'react-toastify';
import {useState, useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import Footer from "../components/Footer";
import AdminNavbar from "../components/AdminNavbar";
import {ToastContainer} from 'react-toastify';
import {utilityFunctions} from "../utils/module";

function AdminLayout() {
    const [render, setRender] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (utilityFunctions.checkCookieExists("adminAuthToken")) {
            setRender(true);
        } else {
            navigate("/adminsignin");
        }
    }, [navigate]);

    return (
        <>
            {render ? (
                <>
                    <AdminNavbar/>
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

export default AdminLayout;