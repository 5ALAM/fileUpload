import React, { useEffect, useState } from "react";
// import { Button } from "react-bootstrap";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import API from "../../../utils/apiCallingAxios";
import { config } from "../../../utils/apiUrl";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  AvForm,
  AvField,
  AvInput,
  AvGroup,
  Label,
} from "availity-reactstrap-validation";
import { validation } from "../../../utils/configCommon";
import { Typography } from "@material-ui/core";
import { constant } from "lodash";
import { display } from "@mui/system";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ModalFile(props) {
  const { showFile, isModalFile, heading, addUser, editUserDetails, editUser } =
    props;
  const api = new API();
  const [roles, setRoles] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [isError, setIsError] = useState([]);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "Admin@123",
    firstName: "",
    lastName: "",
    roleId: "",
    isActive: false,
  });

  const Api_url = "http://localhost:4000/fileUpload/";

  useEffect(() => {
    setUserDetails({});
    setUserDetails(editUserDetails);
    getRole();
  }, [editUserDetails, showFile]);

  const onChangeFun = (e, action) => {
    let value = e.target.value;
    if (action == "status") {
      value = e.target.checked;
    }
    setUserDetails({
      ...userDetails,
      [e.target.name]: value,
    });
  };

  const addUserFun = () => {
    var userData = { ...userDetails, password: "Admin@123" };
    addUser(userData);
  };
  const editUserFun = () => {
    editUser(userDetails);
  };
  const getRole = async () => {
    let result = await api.get(config.role);
    if (result && result.statusCode == 200) {
      setRoles(result.data);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log("ds", selectedFile);
    const notify = () =>
      toast.success("Added users succesfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

    fetch(Api_url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data?.data);
        setIsError(data?.data);
        if (data.data.length == 0) {
          isModalFile();
          notify();
        }
        // setIsError(data.data);
        // isModalFile;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  console.log(isError);
  return (
    <>
      <Modal show={showFile} onHide={isModalFile}>
        <Modal.Header closeButton className="user_card_header">
          <Modal.Title>{heading}</Modal.Title>
        </Modal.Header>
        <Form onValidSubmit={isModalFile}>
          <Modal.Body className="user_modal">
            <CloudUploadIcon />
            <Typography variant="h5">Drag&Drop Files Here</Typography>
            <p>or</p>
            {/* <Button>Upload a file</Button> */}
            <input
              type="file"
              style={{}}
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <div
              className="print error"
              style={{ display: "flex", marginTop: "10px", flexFlow: "column" }}
            >
              {isError.length > 0 &&
                isError?.map((err, index) => (
                  <b
                    className="errors"
                    key={index}
                    style={{ fontSize: "10px", color: "red" }}
                  >
                    row:{err?.row} column:{err?.column} message:{err?.message}
                  </b>
                ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn cv54" onClick={isModalFile}>
              Close
            </button>
            <button className="btn cv38" onClick={onSubmit}>
              Submit
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default ModalFile;
