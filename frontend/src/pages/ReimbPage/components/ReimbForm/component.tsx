import { Form, Input, Select, Upload } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { QueryResult, useAuthQuery } from "../../../../services/graphql";
import { Show } from "../../../../types/types";
import React, { useContext, useState } from "react";
import { gql } from "@apollo/client";
import { Dayjs } from "dayjs";

const NEW_REIMB = gql`
{
    mutation ($member: member!, $amount: amount!, $date: date!, $receipts: [Upload!]!) {
        CreateReimbursement(member:$member, amount:$amount, date:$date, receipts: uploadFiles(files: $receipts) {
            success
        })
    }
}
`;

const MY_SHOWS = gql`
  {
    myShows
  }
`;

function return_shows() {
  const [shows, setShows] = useState(null);
  useAuthQuery(MY_SHOWS, {
    onCompleted: (shows: Show[]) => {
      const options = shows.map((show) => {
        return <Select value={show}>{show.name}</Select>;
      });
      setShows(options);
    },
  });
  return shows;
}

function submitForm(values) {
    // other fields in the form are umm
    //

}

const ReimbForm = () => {
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const [form] = Form.useForm();
  const options = return_shows();

  return (
    <Form form={form} name="SubmitReimb" onFinish={submitForm}>
      <Form.Item name="show">
        <Select placeholder="Select a show you attended">{options}</Select>
      </Form.Item>
      <Form.Item name="amount"></Form.Item>

      <Form.Item
        name="receipts"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        noStyle
      >
        <Upload.Dragger name="files">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload.
          </p>
        </Upload.Dragger>
      </Form.Item>
    </Form>
  );
};

export default ReimbForm;
