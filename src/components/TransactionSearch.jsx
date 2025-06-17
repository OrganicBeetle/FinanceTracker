import React, { useRef, useState } from "react";
import { Input, Table, Select, Radio, DatePicker, Modal, Form, Button } from "antd";
import search from "../assets/search.svg";
import { parse } from "papaparse";
import { toast } from "react-toastify";
import "remixicon/fonts/remixicon.css";

const { Search } = Input;
const { Option } = Select;

const TransactionSearch = ({
  transactions,
  exportToCsv,
  addTransaction,
  fetchTransactions,
  onTransactionClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchDate, setSearchDate] = useState(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
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
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span
          style={{ cursor: "pointer", color: "#1890ff", fontSize: "18px" }}
        >
          <i className="ri-edit-line"></i>
        </span>
      ),
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const selectedDateString = searchDate ? searchDate.format("YYYY-MM-DD") : null;

    const searchMatch = searchTerm
      ? transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const tagSearchMatch = searchTag
      ? (String(transaction.tag || "").toLowerCase().includes(searchTag.toLowerCase()))
      : true;

    const dateMatch = selectedDateString
      ? transaction.date === selectedDateString
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

  const getRowClassName = (record) => {
    if (record.type === "income") {
      return "income-row";
    } else if (record.type === "expense") {
      return "expense-row";
    }
    return "";
  };

  return (
    <div style={{ width: "100%", padding: "0rem 2rem" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
        <div className="input-flex">
          <img src={search} width="16" alt="Search" />
          <input placeholder="Search by Name" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="input-flex">
          <img src={search} width="16" alt="Search" />
          <input placeholder="Search by Tag" onChange={(e) => setSearchTag(e.target.value)} />
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
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center w-full gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">My Transactions</h2>

          <Radio.Group
            className="input-radio flex-shrink-0"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", width: "25vw" }}>
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

        <Table
          columns={columns}
          dataSource={dataSource}
          onRow={(record) => ({
            onClick: () => onTransactionClick(record),
          })}
          rowClassName={getRowClassName}
        />
      </div>
    </div>
  );
};

export default TransactionSearch;
