import React from 'react';
import TableComponent from '../components/Table';

const UserTablePage: React.FC = () => {
  const columns = [
    { id: 'email', label: 'User Email' },
    { id: 'role', label: 'User Role' },
    { id: 'status', label: 'Status', align: 'center' },
  ];

  const data = [
    { email: 'user1@example.com', role: 'Admin', status: 'Active' },
    { email: 'user2@example.com', role: 'User', status: 'Inactive' },
    { email: 'user3@example.com', role: 'Manager', status: 'Active' },
  ];

  return (
    <div
      style={{
        width: '100%',
        padding: '20px',
      }}
    >
      <h1>User Table</h1>
      <TableComponent columns={columns} data={data} />
    </div>
  );
};

export default UserTablePage;
