import React from "react";
import { Card, Row } from "antd";

function Cards({
  currentBalance,
  income,
  expenses,
  showExpenseModal,
  showIncomeModal,
  cardStyle,
  reset,
}) {
  return (
    <Row
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "space-between",
      }}
    >
      <Card variant={true} style={cardStyle}>
        <h2>Current Balance</h2>
        <p>₹{currentBalance}</p>
        <div 
          className="btn btn-blue" 
          onClick={reset}
        >
          Reset Balance
        </div>
      </Card>

      <Card variant={true} style={cardStyle}>
        <h2>Total Income</h2>
        <p>₹{income}</p>
        <div
          className="btn btn-blue"
          onClick={showIncomeModal}
        >
          Add Income
        </div>
      </Card>

      <Card variant={true} style={cardStyle}>
        <h2>Total Expenses</h2>
        <p>₹{expenses}</p>
        <div className="btn btn-blue" onClick={showExpenseModal}>
          Add Expense
        </div>
      </Card>
    </Row>
  );
}

export default Cards;
