import { Form, Input, InputNumber, Select, Upload, Button, Modal } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { QueryResult, useAuthQuery } from "../../../../services/graphql";

import {GET_SHOWS_QUERY} from "../../../ShowsPage/context/ShowsTableContext/queries"
import { Show } from "../../../../types/types";
import React, { useContext, useState } from "react";
import { gql } from "@apollo/client";
import { Dayjs } from "dayjs";

/*
const NEW_REIMB = gql`
{
    mutation ($member: member!, $amount: amount!, $date: date!, $receipts: [Upload!]!) {
        CreateReimbursement(member:$member, amount:$amount, date:$date, receipts: uploadFiles(files: $receipts) {
            success
        })
    }
}
`;

*/
const MY_SHOWS = gql`
  {
    myShows{
	    id
	    name
	    date
    }
  }
`;


function get_shows(){
    const [options, SetOptions] = useState([]);
    useAuthQuery(GET_SHOWS_QUERY, {
        onCompleted: ({myShows: shows}) => {
          SetOptions(shows.map(
              (show:Show) => {
                  return (<Select.Option value={show} key={show.id}>{show.name}</Select.Option>)
              }
          ));
        }
    })
    return options; 
}

type FieldType = {
  amount?: number;
  show?: number;
  description?: string;
};

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const ReimbForm = () => {
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const [form] = Form.useForm();

  const shows = get_shows();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function submitForm(values) {
    setIsModalOpen(false);
  }
  /*
*/
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Submit Reimbursement
      </Button>
      <Modal
        title="Submit Reimbursement"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
	centered={true}
      >
        <Form
          form={form}
          name="SubmitReimb"
          onFinish={submitForm}
          {...formItemLayout}
        >
          <Form.Item<FieldType> name="show" label="Show">
            <Select placeholder="Select a show you attended">{shows}</Select>
          </Form.Item>
          <Form.Item<FieldType> name="amount" label="Amount">
            <InputNumber />
          </Form.Item>
          <Form.Item<FieldType> name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
	<Form.Item
        name="receipts"
	label = "Receipts"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload.Dragger name="files">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Upload.Dragger>
      </Form.Item>
          <Form.Item >
            <Button type="primary" onClick={submitForm}>
              Submit
            </Button>
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
};

export default ReimbForm;
