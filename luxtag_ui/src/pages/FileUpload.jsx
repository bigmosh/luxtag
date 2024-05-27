import React, { Component } from "react";
import { DropzoneDialog } from "mui-file-dropzone";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/UploadFile";
import axios from "axios";

export default class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      files: [],
    };
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  async handleSave(files) {
    //Saving files to state for further use and closing Modal.
    this.setState({
      files: files,
      open: false,
    });

    const url = process.env.REACT_APP_UPLOAD_API_URL;
    
    const form = new FormData();
    form.append("files", files[0]);

    const response = await axios({
      method : 'post',
      url : url,
      data: form,
      headers: { 'Content-Type': 'multipart/form-data;'},
    });
    
    if (response.status === 201) {
      alert('File uploaded successfully');
    }else {
      alert('File upload failed');
    }

    window.location.reload(true);
  }

  handleOpen() {
    this.setState({
      open: true,
    });
  }


  render() {
    return (
      <div>
        <Button onClick={this.handleOpen.bind(this)} startIcon={<FileUploadIcon />}>Upload File</Button>
        <DropzoneDialog
          open={this.state.open}
          onSave={ this.handleSave.bind(this)}
          acceptedFiles={[".csv"]}
          showPreviews={true}
          maxFileSize={5000000}
          onClose={this.handleClose.bind(this)}
        />
      </div>
    );
  }
}