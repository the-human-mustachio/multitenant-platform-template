import React from "react";
import { Box } from "@mui/material";
import DynamicTable from "../components/DynamicTableComponent";

const columns = [
  { field: "id", headerName: "ID", sortable: true },
  { field: "name", headerName: "Name", sortable: true },
  { field: "age", headerName: "Age", sortable: true },
  { field: "email", headerName: "Email", sortable: false },
];

const data = [
  { id: 1, name: "John Doe", age: 28, email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", age: 34, email: "jane.smith@example.com" },
  { id: 3, name: "Samuel Green", age: 22, email: "samuel.green@example.com" },
  { id: 4, name: "Alice Johnson", age: 29, email: "alice.johnson@example.com" },
];

const HomePage: React.FC = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "auto 1fr", // Header takes auto height; table takes remaining space
        gap: 2,
        width: "100%", // Full viewport width
        height: "100vh", // Full viewport height
        padding: 2, // Optional padding
      }}
    >
      <Box component="header">
        <h1>Protected Information Home Page</h1>
      </Box>
      <Box
        component="main"
        sx={{
          width: "100%",
          overflow: "auto", // Ensures table scrolls if it overflows the container
        }}
      >
        <DynamicTable columns={columns} data={data} title="User Table" />
      </Box>
    </Box>
  );
};

export default HomePage;
