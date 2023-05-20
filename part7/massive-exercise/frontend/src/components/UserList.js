import { Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const UserList = ({ users }) => {
  return (
    <>
      <Typography variant='h4'>Users</Typography>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>blogs created</TableCell>
            </TableRow>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default UserList
