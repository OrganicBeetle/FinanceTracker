import React, { useRef, useState } from "react";
import { Input, Table, Select, Radio, DatePicker, Modal, Form, Button } from "antd";
import search from "../assets/search.svg";
import { parse } from "papaparse";
import { toast } from "react-toastify";
import moment from "moment";

const { Search } = Input;
const { Option } = Select;

const TransactionSearch = ({
  transactions,
  exportToCsv,
  addTransaction,
  fetchTransactions,
  //updateTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchDate, setSearchDate] = useState(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  //const [editingTransaction, setEditingTransaction] = useState(null);
  //const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const fileInput = useRef();

  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transaction of results.data) {
            const newTransaction = {
              ...transaction,
              amount: parseInt(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }

  // Function to open the modal with the selected transaction's data
  /*const onEdit = (transaction) => {
    setEditingTransaction(transaction);  // Set transaction to edit
    form.setFieldsValue({
      ...transaction,
      date: moment(transaction.date),  // Ensure date is in moment format
    });
    setIsEditModalVisible(true);  // Show modal
  };
  

  // Function to handle the update of the transaction
  const handleEditFinish = async (values) => {
    const updatedTransaction = {
      ...editingTransaction,
      ...values,
      date: moment(values.date).format("YYYY-MM-DD"),  // Format date
    };

    await updateTransaction(updatedTransaction);  // Update transaction in DB
    setIsEditModalVisible(false);  // Close modal
    fetchTransactions();  // Refresh transaction list
    toast.success("Transaction updated!");
  };*/

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
  ];


  const filteredTransactions = transactions.filter((transaction) => {
    const searchMatch = searchTerm
      ? transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const tagSearchMatch = searchTag
      ? transaction.tag.toLowerCase().includes(searchTag.toLowerCase())
      : true;
    const dateMatch = searchDate
      ? moment(transaction.date).isSame(searchDate, 'day')
      : true;
    const tagMatch = selectedTag ? transaction.tag === selectedTag : true;
    const typeMatch = typeFilter ? transaction.type === typeFilter : true;

    return searchMatch && tagSearchMatch && dateMatch && tagMatch && typeMatch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  const dataSource = sortedTransactions.map((transaction, index) => ({
    key: index,
    ...transaction,
  }));

  return (
    <div
      style={{
        width: "100%",
        padding: "0rem 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          /*justifyContent: "space-between",*/
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={search} width="16" alt="Search" />
          <input
            placeholder="Search by Name"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="input-flex">
          <img src={search} width="16" alt="Search" />
          <input
            placeholder="Search by Tag"
            onChange={(e) => setSearchTag(e.target.value)}
          />
        </div>

        <DatePicker
          placeholder="Search by Date"
          format="YYYY-MM-DD"
          onChange={(date) => setSearchDate(date)}
          style={{ width: 200 }}
        />

        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter by Type"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn" onClick={exportToCsv}>
              Export to CSV
            </button>
            <label htmlFor="file-csv" className="btn btn-blue">
              Import from CSV
            </label>
            <input
              onChange={importFromCsv}
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
            />
          </div>
        </div>

        <Table columns={columns} dataSource={dataSource} /*onRow={(record) => ({
          onClick: () => onEdit(record),
        })}*//>


      </div>
    </div>
  );
};

export default TransactionSearch;
