import React, { useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table"; 
import { Box, Chip, Avatar, TextField } from "@mui/material";
import { debounce } from "lodash";
import schema from "../data/tableSchema.json";
import tableData from "../data/tableData.json";

const DataTable = () => {
  const [data, setData] = useState(tableData);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [nameFilter, setNameFilter] = useState("");

  // Debounced Name Filter
  const handleNameFilterChange = debounce((value) => {
    setNameFilter(value.toLowerCase());
  }, 300);

  const columns = useMemo(() => {
    return schema.columns.map((col) => {
      if (col.type === "avatar") {
        return {
          accessorKey: "name",
          header: col.header,
          Cell: ({ row }) => (
            <Box display="flex" alignItems="center">
              <Avatar src={row.original.avatar} alt={row.original.name} />
              <Box ml={1}>{row.original.name}</Box>
            </Box>
          ),
        };
      }
      if (col.type === "badge") {
        return {
          accessorKey: col.accessorKey,
          header: col.header,
          Cell: ({ row }) => (
            <Chip label={row.original[col.accessorKey]} color="primary" />
          ),
        };
      }
      if (col.type === "chips") {
        return {
          accessorKey: col.accessorKey,
          header: col.header,
          Cell: ({ row }) => (
            <Box>
              {row.original[col.accessorKey].map((team) => (
                <Chip key={team} label={team} sx={{ marginRight: "4px" }} />
              ))}
            </Box>
          ),
        };
      }
      return col;
    });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(nameFilter) &&
        (selectedRoles.length === 0 || selectedRoles.includes(item.role))
    );
  }, [data, nameFilter, selectedRoles]);

  return (
    <Box>
      <TextField
        label="Filter by Name"
        variant="outlined"
        size="small"
        onChange={(e) => handleNameFilterChange(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <MaterialReactTable
        columns={columns}
        data={filteredData}
        enableSorting
        enableRowSelection
        enablePagination
        initialState={{ pagination: { pageSize: 5 } }}
      />
    </Box>
  );
};

export default DataTable;
