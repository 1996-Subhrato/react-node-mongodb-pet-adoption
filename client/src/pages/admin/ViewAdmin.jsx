import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";
// import { FaTrash } from "react-icons/fa";
// import { CiEdit } from "react-icons/ci";
// import Modal from "react-bootstrap/Modal";
// import EditForm from "./users/EditForm";
// import { userContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Server_URL } from "../../utils/config";
import {utilityFunctions} from "../../utils/module"

function ViewAdmin() {
  const navigate = useNavigate();
  

  const [admin, setAdmin] = useState([]);

  async function getAdminData() {
    try {
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "admin-registration";
      const response = await axios.get(url,{
        headers: {
          Authorization:token ? `Bearer ${token}` :""
        }
      });
      console.log(response.data);
      const { error, message } = response.data;
      console.log(error, message);
      
      if(error && message === "Please SignIn First!!"){
        alert(message);
        
          navigate("/adminsignin")
      }
      else if (error) {
        alert(message);
      } else {
        const { result } = response.data;
        setAdmin(result);
      }
    } catch (error) {
      console.log(error.message);
    }
  }


 

  

  

  async function deleteAdmin(id) {
    try {
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "admin-registration/" + id;
      const res = await axios.delete(url,{
        headers: {
          Authorization:`Bearer ${token}`
      }
      });
        console.log(res.data)
      const { error, message } = res.data;
      if (error) {
        // alert(message);
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
      });
      } else {
        // alert(message);
        toast.success(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
      });
        getAdminData();
      }
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    // setFocus('FullName')
    getAdminData();
  }, []);

  return (
    <>
    <br />
      <div className="container">
      <h3 style={{textAlign:'center'}}>Added Admins</h3>
      <table className="table" style={{ backgroundColor: '#FDCA40' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile number</th>
              <th>category</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admin.map((value, index) => {
              return (
                <tr key={index}>
                  <td>{value.fullName}</td>
                  <td>{value.email}</td>
                  <td>{value.mobile}</td>
                  <td>{value.userRole}</td>
                  <td>{value.address}</td>
                  <td>
                    {
                      <button
                        type="button"
                        onClick={() => deleteAdmin(value._id)}
                        className="btn btn-danger btn-sm me-5"
                      >
                        Delete <FaTrashAlt />
                      </button>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
    </>
  );
}

export default ViewAdmin;
