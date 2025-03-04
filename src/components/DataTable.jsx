import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Chip, Avatar, TextField, MenuItem, Select, Checkbox } from "@mui/material";
import { debounce } from "lodash";
import tableData from '../data/tableData.json'

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "working":
      return "success";
    case "on leave":
      return "warning";
    case "inactive":
      return "error";
    default:
      return "default";
  }
};

const getTeamColor = (team) => {
  const colorMap = {
    "Design": "primary",
    "Product": "secondary",
    "Development": "info"
  };
  return colorMap[team] || "default";
};

const DataTable = () => {
  const data = tableData;
  
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [selectedRows, setSelectedRows] = useState({});

  const debouncedSetNameFilter = useMemo(() => debounce((value) => {
    setNameFilter(value);
  }, 500), []);

  useEffect(() => {
    setFilteredData(() => {
      let filtered = [...data]; 

      if (nameFilter) {
        filtered = filtered.filter((row) =>
          row.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      if (roleFilter.length > 0) {
        filtered = filtered.filter((row) => roleFilter.includes(row.role));
      }

      return filtered; 
    });
  }, [nameFilter, roleFilter, data]);

  const uniqueRoles = useMemo(() => {
    return [...new Set(data.map((item) => item.role))];
  }, [data]);

  const handleRowSelection = (rowId) => {
    setSelectedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        Cell: ({ row }) => (
          <Box display="flex" alignItems="center">
            <Checkbox 
              checked={!!selectedRows[row.original.id]} 
              onChange={() => handleRowSelection(row.original.id)}
            />
            <Avatar src={row.original.avatar} alt={row.original.name} sx={{ marginLeft: 1 }} />
            <Box ml={1}>
              <div>{row.original.name}</div>
              <div style={{ fontSize: "12px", color: "gray" }}>
                {row.original.username}
              </div>
            </Box>
          </Box>
        ),
        Filter: () => (
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search Name"
            onChange={(e) => debouncedSetNameFilter(e.target.value)}
            fullWidth
          />
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => (
          <Chip label={row.original.status} color={getStatusColor(row.original.status)} />
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        Filter: () => (
          <Select
            multiple
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            displayEmpty
            fullWidth
            size="small"
            renderValue={(selected) => selected.length === 0 ? "Select Role" : selected.join(", ")}
          >
            {uniqueRoles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "teams",
        header: "Teams",
        Cell: ({ row }) => (
          <Box display="flex" gap={1} flexWrap="wrap">
            {row.original.teams.map((team) => (
              <Chip key={team} label={team} color={getTeamColor(team)} size="small" />
            ))}
          </Box>
        ),
      },
      {
        accessorKey: "age",
        header: "Age",
        enableSorting: true,
        sortingFn: "basic",
      },
    ],
    [roleFilter, uniqueRoles, selectedRows]
  );

  return (
      <MaterialReactTable
        columns={columns}
        data={filteredData}
        enableSorting
        enableColumnFilters
        enablePagination
        initialState={{
          pagination: { pageSize: 10, pageIndex: 0 },
        }}
      />
  );
};

export default DataTable;
