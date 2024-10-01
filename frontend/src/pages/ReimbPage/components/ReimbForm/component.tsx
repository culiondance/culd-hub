import { Form, Input, InputNumber, Select, Upload, Button, Modal, FormInstance } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { useAuthMutation, useAuthQuery } from "../../../../services/graphql";
import FileUploadBox from "../FileUploadBox";
import { Show } from "../../../../types/types";
import React, { useContext, useState } from "react";
import { gql, useMutation} from "@apollo/client";
import { Dayjs } from "dayjs";

const SUBMIT_REIMB = gql`
    mutation SubmitReimb($amount: Float!, $show:ID!){
        submitReimb(show:$show,amount:$amount, files:none){
            reimb{
                id
            }
        }
    }
`;

const MY_SHOWS = gql`
  {
    myShows{
	    id
	    name
	    date
    }
  }
`;


const SubmitButton = ({form}:{form:FormInstance}) => {
  const [submittable, setSubmittable] = React.useState<boolean>(false);

  // Watch all values
  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}/>
  );
};

function get_shows(SetOptions){
    useAuthQuery(MY_SHOWS, {
        onCompleted: (query) => {
            const options = query.myShows.map(
              show => <Select.Option value={show.id} key={show.id}>{show.name}</Select.Option>
            );
          SetOptions(options);
        }
    })
}


type FieldType = {
  Amount?: number;
  Show?: number;
  Description?: string;
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

  const [form]:[FormInstance] = Form.useForm();


  const [shows, SetShows] = useState([]);
  get_shows(SetShows)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  type FormValues = {
    show: number,
    amount: number,
    files: string[],
    description:string,
  };

  const [submitForm] = useAuthMutation(SUBMIT_REIMB, {});

  function submit_form(values:FormValues) {
      //const vars = {show:values.show.id, amount:values.amount};
      const vars = {show:values.show, amount:values.amount};
      console.log(values);
      submitForm({variables: vars});
      //setIsModalOpen(false);
  }

  const [files, setFiles] = useState<FileList>(null);

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
          onFinish={submit_form}
          {...formItemLayout}
        >
          <Form.Item<FieldType> name="Show" label="show" rules={[{required: true}]}>
            <Select placeholder="Select a show">{shows}</Select>
          </Form.Item>
          <Form.Item<FieldType> name="Amount" label="amount" rules={[{required: true}]}>
            <InputNumber />
          </Form.Item>
          <Form.Item<FieldType> name="Description" label="description" rules={[{required: true}]}>
            <Input.TextArea />
          </Form.Item>
	<Form.Item
        name="receipts"
	label = "Receipts"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <FileUploadBox setFiles = {setFiles}></FileUploadBox>
      </Form.Item>
          <Form.Item >
            <SubmitButton form={form}/>
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
};

export default ReimbForm;
