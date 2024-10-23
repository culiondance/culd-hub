
import React, { ChangeEvent, Dispatch, SetStateAction} from "react";

import { InboxOutlined, UploadOutlined} from "@ant-design/icons";


import { Upload } from 'antd';


const FileUploadBox = ({setFiles}:{setFiles:Dispatch<SetStateAction<FileList>>}) => {
        const updateUploads = (wrapped_files) => {
            const files:FileList = wrapped_files.map((obj) => (obj.originFileObj));
            
            console.log("updating files to ", files);
            setFiles(files);
        };

        

        const customUpload = (options) =>{
            //setFiles(options.file);
            null;
        }

        const props = {
            name: 'file',
            multiple: true,
            onChange(info){
                updateUploads(info.fileList)
            },
            action: window.location.hostname.toString(),
            customRequest: customUpload,
        }

        return(
        <Upload.Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined/>
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Upload.Dragger>
        )
};

/*
 *        <input type="file" multiple onChange = {updateUploads}>
        </input>);

 */


export default FileUploadBox;
