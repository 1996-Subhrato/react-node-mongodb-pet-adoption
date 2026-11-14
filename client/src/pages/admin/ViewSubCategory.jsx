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
import {utilityFunctions} from "../../utils/module";

function ViewSubCategory() {
  const navigate = useNavigate();
  

  const [subcategory, setsubCategory] = useState([]);

  async function getSubCategoryData() {
    try {
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "manage-subcategory";
      const response = await axios.get(url,{
        headers: {
          Authorization:token ? `Bearer ${token}` :""
        }
      }
    );
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
        setsubCategory(result);
      }
    } catch (error) {
      console.log(error.message);
    }
}


  async function deletesubcategory(id) {
    try {
      console.log(id);
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "manage-subcategory/" + id;
      const res = await axios.delete(url,{
        headers: {
          Authorization:token ? `Bearer ${token}` :""      
        }
      }
    );
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
        getSubCategoryData();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    // setFocus('FullName')
    getSubCategoryData();
  }, []);

  return (
    <>
    <br />
      <div className="container">
      <h3 style={{textAlign:'center'}} className="text-warning">All Breeds</h3>
      <table className="table" style={{ backgroundColor: '#FDCA40' }}>
          <thead>
            <tr>
              <th>Sub-Category Name</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subcategory.map((value, index) => {
              return (
                <tr key={index}>
                  <td>{value.subcategory}</td>
                  <td>{value.categoryName}</td>
                  <td>{value.subcategoryDescription}</td>
                  <td>
                  {
                      <button
                        type="button"
                        onClick={() => deletesubcategory(value._id)}
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

export default ViewSubCategory;