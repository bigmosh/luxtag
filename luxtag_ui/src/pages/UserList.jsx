import * as React from "react";
import {TableContainer,Table, Box,Typography,Stack,MenuItem, FormControl,Pagination,Select, TableRow, TableBody, TableCell, TableHead, Paper, TextField} from '@mui/material';
import { styled } from '@mui/material/styles';

import FileUpload  from "./FileUpload";
import axios from "axios";


function createData(student_name, program_name, serial_number ) {
  return { student_name, program_name, serial_number};
}

let paginate_filter = {
  pageLimit : 10,
  pageNumber: 1,
  search: '',
  sortBy: ''
};


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


async function getStudent (paginate_filter){
  const rows = [];
  let paginate_query = `?limit=${paginate_filter.pageLimit}&page=${paginate_filter.pageNumber}&search=${paginate_filter.search}&sortBy=${paginate_filter.sortBy}`;
  const url = `${process.env.REACT_APP_STUDENT_LIST_API_URL}${paginate_query}`;  

  const students_data = await axios({
    type : "get",
    url: url,
    headers: { 'Content-Type': 'application/json;'},
  });
  
  const students = students_data['data']['data'];
  
  students.forEach((item) => {
    rows.push(createData(item.student_name, item.program_name, item.serial_number));
  });  
  
  return {meta : students_data['data']['meta'], data : rows};
}

const student_data = await getStudent(paginate_filter);
const student_paginate = student_data.meta;
const students_rows = student_data.data;

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const UserList = () => {
  const [page, setPage] = React.useState(student_paginate.currentPage);
  const [totalPage, setTotalPage] = React.useState(student_paginate.totalPages);
  const [rows, setRows] = React.useState(students_rows);
  const [pageLimit, setPageLimit] = React.useState(student_paginate.itemsPerPage);

  const handlePageChange = async (event, newPage) => {
    setPage(newPage);
    // Set new paginate page for data fetch from backend
    paginate_filter.pageNumber = newPage;
    const student_data = await getStudent(paginate_filter);

    // Update new fetch student data rows
    setRows(student_data.data);
  };

  const handlePageLimitChange = async (event) => {
    const pageLimit = event.target.value;
    setPageLimit(pageLimit);
    // Set new paginate page limit for data fetch from backend
    paginate_filter.pageLimit = pageLimit;
    const student_data = await getStudent(paginate_filter);

    const paginate = student_data.meta;

    // Update new fetch student data rows
    setRows(student_data.data); 
    
    // Update new total paginated page
    setTotalPage(paginate.totalPages);

    // Update pagination current page
    setPage(paginate.currentPage);
  }

  const handleTableSearch = async (event) => {
    if (event.keyCode === 13) {
      const search = event.target.value;

      // Update paginate filter settings
      paginate_filter.pageLimit = pageLimit;
      paginate_filter.search = search;

      const student_data = await getStudent(paginate_filter);

      const paginate = student_data.meta;

      // Update new fetch student data rows
      setRows(student_data.data); 
      
      // Update new total paginated page
      setTotalPage(paginate.totalPages);

      // Update pagination current page
      setPage(paginate.currentPage);  
      
      // Set page limit
    setPageLimit(pageLimit);
    }
    
  }
  return (
    <Box>
      <Typography variant='h4'>User List</Typography>
      <Stack spacing={2} direction="row" sx={{marginTop : "10px"}}>
        <Item>
          <FormControl >
        <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={pageLimit}
        label="Page Limit"
        onChange={handlePageLimitChange}
      >
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={30}>30</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
        <MenuItem value={200}>200</MenuItem>        
        </Select> 
          </FormControl>           
        </Item>
        <Item>
          <FileUpload />
        </Item>
        <Item><TextField placeholder="Search...." sx={{width : "400px",height : "30px"}} onKeyUp={handleTableSearch}/></Item>
      </Stack>
    
  
    <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell align="right">Program Name</TableCell>
                <TableCell align="right">Serial Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.student_name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.student_name}
                  </TableCell>
                  <TableCell align="right">{row.program_name}</TableCell>
                  <TableCell align="right">{row.serial_number}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>         
        </TableContainer>
        <Stack sx={{margin : "20px"}}>
          <Pagination count={totalPage} page={page} defaultPage={student_paginate.currentPage} color="primary" onChange={handlePageChange} />
        </Stack>
    </Box>
  )
}

export default UserList