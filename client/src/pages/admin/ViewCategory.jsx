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

function ViewCategory() {
  const navigate = useNavigate();
  

  const [category, setCategory] = useState([]);

  async function getCategoryData() {
    try {
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "manage-category";
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
        setCategory(result);
      }
    } catch (error) {
      console.log(error.message);
    }
  }


 

  // const navigate = useNavigate();

  

  async function deleteCategory(id) {
    try {
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "manage-category/" + id;
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
        getCategoryData();
      }
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    // setFocus('FullName')
    getCategoryData();
  }, []);

  return (
    <>
    <br />
      <div className="container">
      <h3 style={{textAlign:'center'}}>Added Categories</h3>
      <table className="table" style={{ backgroundColor: '#FDCA40' }}>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {category.map((value, index) => {
              return (
                <tr key={index}>
                  <td>{value.categoryName}</td>
                  <td>{value.description}</td>
                  <td>
                    {
                      <button
                        type="button"
                        onClick={() => deleteCategory(value._id)}
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

export default ViewCategory;
