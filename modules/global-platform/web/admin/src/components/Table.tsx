import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

interface TableComponentProps {
  columns: Column[];
  data: Record<string, any>[];
}

const TableComponent: React.FC<TableComponentProps> = ({ columns, data }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        width: '100%',        // Full width on all devices
        overflowX: 'auto',    // Allow horizontal scrolling for mobile
        margin: 'auto',       // Center the table container
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="responsive table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} align={column.align || 'left'}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'}>
                  {row[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
