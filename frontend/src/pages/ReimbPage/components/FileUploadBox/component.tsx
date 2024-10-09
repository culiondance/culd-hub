
import React, { ChangeEvent, Dispatch, SetStateAction} from "react";

//import { InboxOutlined, UploadOutlined } from "@ant-design/icons";

const FileUploadBox = ({setFiles}:{setFiles:Dispatch<SetStateAction<FileList>>}) => {
        const updateUploads = (e: ChangeEvent<HTMLInputElement>) => {
            console.log("updating files");
          if (e.target.files) {
            setFiles(e.target.files);
          }
        };

        return(


        <input type="file" multiple onChange = {updateUploads}>
        </input>);
};


export default FileUploadBox;
