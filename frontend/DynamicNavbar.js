import React from "react";
import { Box, Card } from "@material-ui/core";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import BasicBreadcrumbs from "../../components/common/breadcrumb";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const DynamicNavbar = (props) => {
  return (
    <>
      <Box className="navbar-main-container cv6_box" id={props.navId}>
        <Card className="dynamic-navbar-box">
          <div className="dynamic-content-box-1">
            <div className="dynamic-navbar-title dynamicNavbarTag">
              {props.tag}
            </div>

            <div className="breadcrumbs_custome">
              <BasicBreadcrumbs />
            </div>
          </div>
          {props.btnDisplay == 1 && (
            <>
              <div style={{ display: "flex" }}>
                <a
                  style={{ cursor: "pointer", padding: "5px" }}
                  onClick={props.isModalFileShow}
                >
                  <AttachFileIcon />
                </a>
                <a
                  style={{ cursor: "pointer", padding: "5px" }}
                  onClick={props.isModalShow}
                >
                  <PersonAddIcon />
                </a>
              </div>
            </>
          )}
        </Card>
      </Box>
    </>
  );
};

export default DynamicNavbar;
