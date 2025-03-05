import React, { useEffect, useState } from "react";
import { Card, Row, Modal, Button} from "antd";
import { Line, Pie } from "@ant-design/plots";
import TransactionSearch from "../components/TransactionSearch";
import AddIncomeModal from "../components/Modals/AddIncome";
import AddExpenseModal from "../components/Modals/AddExpense";
import Cards from "../components/Cards";
import NoTransactions from "../components/NoTransactions";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import Loader from "../components/Loader/Loader.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { unparse } from "papaparse";
import Header from "../components/header.jsx";
import '../App.css';
import { doc, updateDoc, deleteDoc} from "firebase/firestore";
import EditTransactionModal from "../components/Modals/EditTransaction";

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const navigate = useNavigate();

  const processChartData = (transactions) => {
    const spendingData = {};
  
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  
    let runningBalance = 0;
    const balanceData = [];
  
    sortedTransactions.forEach((transaction) => {
      if (transaction.type === "income") {
        runningBalance += transaction.amount;
      } else {
        runningBalance -= transaction.amount;

        if (spendingData[transaction.tag]) {
          spendingData[transaction.tag] += transaction.amount;
        } else {
          spendingData[transaction.tag] = transaction.amount;
        }
      }
  
      balanceData.push({
        date: transaction.date, 
        balance: runningBalance,
      });
    });
  
    const spendingDataArray = Object.keys(spendingData).map((key) => ({
      category: key,
      value: spendingData[key],
    }));
  
    return { balanceData, spendingDataArray };
  };

  const { balanceData, spendingDataArray } = processChartData(transactions);

  const deleteTransaction = async (transactionId) => {
    if (!user || !user.uid) {
      toast.error("User is not authenticated");
      return;
    }

    try {
      // Delete the transaction from Firestore
      const transactionRef = doc(db, `users/${user.uid}/transactions`, transactionId);
      await deleteDoc(transactionRef);

      // Remove the transaction from the state
      const updatedTransactions = transactions.filter(transaction => transaction.id !== transactionId);
      setTransactions(updatedTransactions);

      toast.success("Transaction Deleted!");
    } catch (e) {
      console.error("Error deleting document: ", e);
      toast.error("Couldn't delete the transaction.");
    }
  };

  const updateTransaction = async (updatedValues) => {
    if (!user || !user.uid) {
      toast.error("User is not authenticated");
      return;
    }

    try {
      // Update in Firestore
      const transactionRef = doc(db, `users/${user.uid}/transactions`, selectedTransaction.id);
      await updateDoc(transactionRef, updatedValues);

      // Update the transaction in the local state
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === selectedTransaction.id
            ? { ...transaction, ...updatedValues }
            : transaction
        )
      );

      toast.success("Transaction updated successfully!");
      setIsEditModalVisible(false);
    } catch (e) {
      console.error("Error updating transaction: ", e);
      toast.error("Failed to update transaction");
    }
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsActionModalVisible(true);
  };

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    setTransactions([...transactions, newTransaction]);
    setIsExpenseModalVisible(false);
    setIsIncomeModalVisible(false);
    addTransaction(newTransaction);
    calculateBalance();
  };

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };


  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  async function addTransaction(transaction, many) {

    if (!user || !user.uid) {
      toast.error("User is not authenticated");
      return;
    }
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) {
        toast.success("Transaction Added!");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) {
        toast.error("Couldn't add transaction");
      }
    }
  }

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      try {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        let transactionsArray = [];
        querySnapshot.forEach((doc) => {
          transactionsArray.push({ ...doc.data(), id: doc.id });
        });
        setTransactions(transactionsArray);
        toast.success("Transactions Fetched!");
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Error fetching transactions.");
      }
    }
    setLoading(false);
  }

  const balanceConfig = {
    data: balanceData,
    xField: "date",
    yField: "balance",

    xAxis: {
      type: "timeCat", 
      tickCount: 5,
    },
  };

  const spendingConfig = {
    data: spendingDataArray,
    angleField: "value",
    colorField: "category",
  };

  async function reset() {
    if (!user || !user.uid) {
      toast.error("User is not authenticated");
      return;
    }
  
    try {
      const transactionsRef = collection(db, `users/${user.uid}/transactions`);
      const querySnapshot = await getDocs(transactionsRef);
  
      const batchPromises = querySnapshot.docs.map(async (docRef) => {
        const transactionDoc = doc(db, `users/${user.uid}/transactions`, docRef.id);
        return deleteDoc(transactionDoc);
      });
  
      await Promise.all(batchPromises); 
  
      setTransactions([]); // Clear the local transactions state
      setCurrentBalance(0);
      setIncome(0);
      setExpenses(0);
  
      toast.success("All transactions deleted!");
    } catch (error) {
      console.error("Error deleting transactions:", error);
      toast.error("Failed to delete transactions.");
    }
  }
  
  

  const cardStyle = {
    boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
    margin: "2rem",
    borderRadius: "0.5rem",
    minWidth: "400px",
    flex: 1,
  };

  function exportToCsv() {
    const csv = unparse(transactions, {
      fields: ["name", "type", "date", "amount", "tag"],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  return (
    <div>
      <Header />
      <div className="dashboard-container">
        {loading ? (
          <Loader />
        ) : (
          <>
            <Cards
              currentBalance={currentBalance}
              income={income}
              expenses={expenses}
              showExpenseModal={showExpenseModal}
              showIncomeModal={showIncomeModal}
              cardStyle={cardStyle}
              reset={reset}
            />

            <AddExpenseModal
              isExpenseModalVisible={isExpenseModalVisible}
              handleExpenseCancel={handleExpenseCancel}
              onFinish={onFinish}
            />
            <AddIncomeModal
              isIncomeModalVisible={isIncomeModalVisible}
              handleIncomeCancel={handleIncomeCancel}
              onFinish={onFinish}
            />
            {transactions.length === 0 ? (
              <NoTransactions />
            ) : (
              <>
                <Row gutter={16}>
                  <Card variant={true} style={cardStyle}>
                    <h2>Financial Statistics</h2>
                    <Line {...balanceConfig} />;
                  </Card>

                  <Card variant={true} style={{ ...cardStyle, flex: 0.45 }}>
                    <h2>Total Spending</h2>
                    {spendingDataArray.length == 0 ? (
                      <div className="flex justify-center align-middle mt-[15rem] font-[woff2] text-lg">
                        <p>Seems like you haven't spent anything till now...</p>
                      </div>
                      
                    ) : (
                      <Pie {...{ ...spendingConfig, data: spendingDataArray }} />
                    )}
                  </Card>
                </Row>
              </>
            )}
            <div id="transaction-history">
              <TransactionSearch
                transactions={transactions}
                exportToCsv={exportToCsv}
                fetchTransactions={fetchTransactions}
                addTransaction={addTransaction}
                onTransactionClick={handleTransactionClick}
              />
            </div>

            {isActionModalVisible && (
              <Modal
                title="Choose an Action"
                open={isActionModalVisible}
                onCancel={() => setIsActionModalVisible(false)}
                footer={[
                  <Button key="edit" type="primary" onClick={() => {
                    setIsActionModalVisible(false);
                    setIsEditModalVisible(true);
                  }}>
                    Edit
                  </Button>,
                  <Button key="delete" danger onClick={async () => {
                    await deleteTransaction(selectedTransaction.id);
                    setIsActionModalVisible(false);
                  }}>
                    Delete
                  </Button>,
                ]}
              >
                <p>What would you like to do with this transaction?</p>
              </Modal>
            )}

            {isEditModalVisible && selectedTransaction && (
              <EditTransactionModal
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                onSubmit={updateTransaction}
                initialValues={selectedTransaction}
              />
            )}
            
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
