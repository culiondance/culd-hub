import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  InputNumber,
  Select,
  Alert,
} from "antd";
import { useMutation } from "@apollo/client";
import { SUBMIT_REIMBURSEMENT_MUTATION } from "../../../../graphql/mutations";
import { Show, User } from "../../../../types/types";
import { handleApolloError } from "../../../../services/graphql";

const { TextArea } = Input;

interface ReimbursementModalProps {
  show: Show;
  visible: boolean;
  onClose: () => void;
  user: User;
}

export const ReimbursementModal: React.FC<ReimbursementModalProps> = ({
  show,
  visible,
  onClose,
  user,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [submitReimbursement] = useMutation(SUBMIT_REIMBURSEMENT_MUTATION, {
    onCompleted: ({ submitReimbursement }) => {
      if (submitReimbursement.success) {
        message.success("Reimbursement request submitted!");
        form.resetFields();
        onClose();
      }
    },
    onError: handleApolloError(),
  });

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      await submitReimbursement({
        variables: {
          showId: show.id,
          receiptUrl: values.receiptUrl,
          paymentMethod: values.paymentMethod,
          amount: values.amount,
          notes: values.notes,
        },
      });
    } catch (err) {
      console.error(err);
      message.error("Failed to submit reimbursement.");
    }

    setLoading(false);
  };

  return (
    <Modal
      title={`Reimbursement Request – ${show.name}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="Receipt Instructions"
        description={
          <>
            Upload the picture of your receipt to the shared Google Drive.
            <br />
            Create a folder with <b>your first and last name</b>.
            <br />
            You will be using this folder for all future reimbursements.
            <br />
            <b> “Make sure the link viewing settings are correct”</b>.
            <br />
            Paste the link below.
          </>
        }
      />

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="receiptUrl"
          label="Receipt Google Drive Link"
          rules={[
            { required: true, message: "Please paste the receipt link" },
            { type: "url", message: "Please enter a valid URL" },
          ]}
        >
          <Input placeholder="https://drive.google.com/..." />
        </Form.Item>

        <Form.Item
          name="paymentMethod"
          label="Payment Method"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select payment method">
            <Select.Option value="venmo">
              Venmo (@{user.venmoUsername || "not set"})
            </Select.Option>
            <Select.Option value="zelle">
              Zelle ({user.zelleUsername || "not set"})
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount to Reimburse"
          rules={[{ required: true }]}
        >
          <InputNumber prefix="$" min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="notes" label="Notes (optional)">
          <TextArea rows={3} placeholder="Any additional info..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Submit Reimbursement
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
