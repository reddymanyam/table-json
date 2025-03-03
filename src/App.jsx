import React from "react";
import { Container, Typography } from "@mui/material";
import DataTable from "./components/DataTable";

function App() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        JSON-Driven Table
      </Typography>
      <DataTable />
    </Container>
  );
}

export default App;
