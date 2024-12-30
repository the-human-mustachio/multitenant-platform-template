import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Input,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import Fuse from "fuse.js";

interface Column {
  field: string;
  headerName: string;
  sortable?: boolean;
}

interface DynamicTableProps {
  columns: Column[];
  data: Record<string, any>[];
  title?: string;
}

const highlightMatch = (
  text: string,
  matches: { indices: [number, number][] } | undefined
) => {
  if (!matches) return text;

  const textStr = String(text);
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.indices.forEach(([start, end]) => {
    parts.push(textStr.slice(lastIndex, start));
    parts.push(
      <span key={`${start}-${end}`} style={{ backgroundColor: "yellow" }}>
        {textStr.slice(start, end + 1)}
      </span>
    );
    lastIndex = end + 1;
  });

  parts.push(textStr.slice(lastIndex)); // Add the remainder of the text
  return <>{parts}</>;
};

const DynamicTable: React.FC<DynamicTableProps> = ({
  columns,
  data,
  title,
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Fuse.js setup for fuzzy search
  const fuse = new Fuse(data, {
    keys: columns.map((col) => col.field), // Searchable fields
    threshold: 0.3, // Fuzzy matching sensitivity
    includeMatches: true, // Include match details (indices)
  });

  // Handle search logic based on the search term
  let searchResults;
  if (searchTerm) {
    searchResults = fuse.search(searchTerm); // Fuzzy search across all fields
  } else {
    searchResults = data.map((item) => ({ item }));
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {title && (
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          {title}
        </Typography>
      )}
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <Input
          placeholder="Search"
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          sx={{
            flex: 1,
            marginRight: 1,
            maxWidth: 300, // Limit width to prevent overflow
            // padding: "10px", // Add padding to match TextField height

            borderRadius: 1, // Rounded corners
          }}
        />
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 650, width: "100%" }} aria-label="dynamic table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>{column.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.length > 0 ? (
              searchResults
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(({ item, matches }, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => {
                      const match = matches?.find(
                        (match) => match.key === column.field
                      );
                      return (
                        <TableCell key={column.field}>
                          {match
                            ? highlightMatch(item[column.field], match)
                            : item[column.field]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={searchResults.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default DynamicTable;
