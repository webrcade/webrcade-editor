import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectCategory(props) {
  const { feed, category, setCategory } = props;

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ marginBottom: 3, marginTop: .5, minWidth: 200 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={category}
          onChange={handleChange}
          autoWidth
          label="Category"
        >
          {            
            feed.categories ? feed.categories.map(cat => {
              return (
                <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
              )
            }) : null
          }
        </Select>
      </FormControl>
    </div>
  );
}