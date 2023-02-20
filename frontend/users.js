import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";
import user from "../../assets/img/user.png";
import deleteIcon from "../../assets/img/delete1.png";
import editIcon from "../../assets/img/edit.png";
import dots from "../../assets/img/dots.png";
import ModalUser from "./modal/modal";
import ModalFile from "./modal/fileModal";
import CommonUserListComp from "../common components/user_list";
import { SwalConfirm } from "../common/common";
// import API from "../../utils/apiCalling";
import API from "../../utils/apiCallingAxios";

import { config } from "../../utils/apiUrl";
import DynamicNavbar from "../Navbars/DynamicNavbar";
import { useContext } from "react";
import { userStore } from "../Store/userProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getRole } from "../common/roles_management";

let UserData = [
  { id: 1, fullName: "Backend - Developer", isActive: true },
  { id: 2, fullName: "Full Stack Developer", isActive: true },
  { id: 3, fullName: "Frontend - Developer", isActive: false },
];

function UsersComp() {
  const userStoreDetails = useContext(userStore);
  const api = new API();
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [fileShow, setFileShow] = useState(false);
  const [values, setValues] = useState();
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [offset, setOffSet] = useState(0);
  const [Users, setUsers] = useState([]);
  const [editUserDetails, setEditUserDetails] = useState({});
  const [modalHeading, setModalHeading] = useState("");
  const [fileModalHeading, setFileModalHeading] = useState("");
  // const { data, isLoading, isSuccess } = useUserDashboard({ values });

  useEffect(() => {
    userStoreDetails.getUser(limit, offset, "");
  }, []);
  useEffect(() => {
    setTotalPage(userStoreDetails.users?.totalPages);
    setUsers(userStoreDetails.users?.response);
  }, [userStoreDetails]);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
    // getUser();
  }, [page]);

  const getUser = async () => {
    let result = await userStoreDetails.getUser(
      limit,
      offset,
      userStoreDetails.users?.searchData
    );
    if (result) {
      setTotalPage(result.totalPages);
      setUsers(result.response);
    }
  };
  const isModalShow = () => {
    setEditUserDetails({});
    setModalHeading("Add User");
    setShow(!show);
  };
  const isModalFile = () => {
    setEditUserDetails({});
    setFileModalHeading("Add File");
    setFileShow(!fileShow);
  };

  const handleChange = (event, value) => {
    setTimeout(() => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }, 10);
    setOffSet((value - 1) * 10);
    setPage(value);
  };

  const deleteFun = async (id) => {
    let isAction = await SwalConfirm("Are you sure to delete this User?");
    if (isAction) {
      const result = await api.delete(config.User, id);
      if (result && result.statusCode == 200) {
        // SwalAlert("Deleted Successfully?", "success");
        toast.success("Deleted Successfully");
        getUser();
      } else {
        toast.error("Something went wrong?");
        // SwalAlert("Something went wrong?", "info");
      }
    } else {
      toast.warn("Not deleted");
      // SwalAlert("Not deleted?", "info");
    }
  };
  const addUser = async (userDetails) => {
    const result = await api.post(config.User, userDetails);
    if (result && result.statusCode == 200) {
      setShow(false);
      toast.success("User created successfully");
      // SwalAlertTopEnd("success", "Successfuly edited");
      getUser();
    } else {
      toast.error("Unable to create user");
    }
  };
  const editFun = async (id) => {
    const result = await api.get(config.User + "/" + id);
    if (result && result.statusCode == 200) {
      setEditUserDetails(result.data);
      setModalHeading("Edit User");
      setShow(true);
    }
    // SwalAlertTopEnd("success", "Successfuly edited")
  };
  const editUser = async (userDetails) => {
    const result = await api.patch(config.User, userDetails._id, userDetails);
    if (result) {
      setShow(false);

      toast.success("Successfully updated user");
      setEditUserDetails({});
      getUser();
    }
  };
  return (
    <>
      <DynamicNavbar
        tag={"Users"}
        btnName={"Add Member"}
        btnName1={"Add File"}
        isModalFileShow={isModalFile}
        isModalShow={isModalShow}
        btnDisplay={1}
      />
      <div className="cv14">
        <CommonUserListComp
          Users={Users}
          user={user}
          dots={dots}
          deleteFun={deleteFun}
          deleteIcon={deleteIcon}
          editFun={editFun}
          editIcon={editIcon}
          totalPage={totalPage}
          page={page}
          handleChange={handleChange}
        />
        <ModalUser
          show={show}
          isModalShow={isModalShow}
          heading={modalHeading}
          addUser={addUser}
          editUserDetails={editUserDetails}
          editUser={editUser}
        />
        <ModalFile
          showFile={fileShow}
          isModalFile={isModalFile}
          heading={fileModalHeading}
          addUser={addUser}
          editUserDetails={editUserDetails}
          editUser={editUser}
        />
      </div>
      <ToastContainer />
    </>
  );
}

export default UsersComp;
