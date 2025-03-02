import React from "react";
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";
import moment from "moment";

const EditTransactionModal = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Edit Transaction"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: initialValues.name,
          amount: initialValues.amount,
          date: moment(initialValues.date, "YYYY-MM-DD"),
          tag: initialValues.tag,
        }}
        onFinish={(values) => {
          // Format the date before submitting
          values.date = values.date.format("YYYY-MM-DD");
          values.amount = parseFloat(values.amount);
          onSubmit(values);
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please input the amount!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select the date!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Tag"
          name="tag"
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select>
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="office">Office</Select.Option>
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
            {/* Add more options as needed */}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Transaction
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTransactionModal;
