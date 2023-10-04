import React, { useEffect, useState } from "react";
import axios from "axios";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import HeaderSignOut from "../components/header/HeaderSignOut";

function FileManagement(props) {
  const [filesData, setFileData] = useState({
    isLoading: true,
    data: null,
  });

  const [newFileName, setNewFileName] = useState("");

  const getFiles = async () => {
    new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(
          "/get-files?filename=infosync-files.json"
        );

        resolve(data);
      } catch (error) {
        reject(error);
      }
    })
      .then((data) => {
        console.log(data);
        setFileData({
          isLoading: false,
          data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getFiles();
  }, []);

  const createNewFile = () => {
    console.log("value", newFileName);
    if (newFileName !== "") {
      setFileData({
        isLoading: true,
        data: null,
      });

      new Promise(async (resolve, reject) => {
        try {
          const { data } = await axios.get(
            `/make-new-file?filename=${newFileName}`
          );
          resolve(data);
        } catch (error) {
          reject(error);
        }
      })
        .then((data) => {
          console.log("newly created file", data);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("enter file name");
    }
  };

  return (
    <>
      <HeaderSignOut
        userEmail={props.userEmail}
        userRole={props.userRole}
        userJdesc={props.userJdesc}
      />
      <div className="set-right-container p-4">
        <Stack gap={1}>
          <Stack direction="row" gap={1}>
            <TextField
              label="File Name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              variant="outlined"
            />
            <Button variant="outlined" onClick={createNewFile}>
              <Stack direction="row" gap={0.2}>
                {/* <PostAddIcon /> */}
                <Typography>Create File</Typography>
              </Stack>
            </Button>
          </Stack>
          {filesData.isLoading && <LinearProgress />}
          {!filesData.isLoading && filesData.data && (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow sx={{ background: "#F5DFBB" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>FILE NAME</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      EXTRACTION{" "}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      EXTRACTION QA
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      DIMENTIONS
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      DIMENTIONS QA
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!filesData.isLoading &&
                    filesData.data &&
                    filesData.data.map((file, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Stack
                              width="fit-content"
                              direction="row"
                              gap={1}
                              border="1px solid #1976d2"
                              borderRadius="15px"
                              paddingX="10px"
                              paddingY="5px"
                              style={{ background: "#bbddff" }}
                            >
                              <ArticleIcon style={{ color: "#1976d2" }} />
                              <Typography color="#1976d2" fontWeight="bold">
                                {file.title}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {file.assignees.extraction || "-"}
                          </TableCell>
                          <TableCell>
                            {file.assignees.extractionQA || "-"}
                          </TableCell>
                          <TableCell>
                            {file.assignees.dimensions || "-"}
                          </TableCell>
                          <TableCell>
                            {file.assignees.dimensionsQA || "-"}
                          </TableCell>
                          <TableCell>{file.status || "-"}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </div>
    </>
  );
}

export default FileManagement;
