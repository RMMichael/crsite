import {Container} from "@material-ui/core";
import {BrowseTable} from "./BrowseTable";
import React, { useState, useEffect } from "react";


function Home() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchAsync = async () => {
      try {
        const result = await fetch('/api/review_table');
        if (!result.ok) {
          throw new Error(result.text());
        }

        const data = await result.json();
        if (data.status !== 'ok') {
          console.table(data);
          throw new Error('status not ok');
        }

        setRows(data.result);
      } catch (e) {
        console.error(e);
      }
    };

    fetchAsync();
  }, []);

  rows.forEach(row => {
    row.name = `${row.dept} ${row.number} ${row.title}`;
  });

  return (
      <Container maxWidth={"lg"}>
        <BrowseTable rows={rows}/>
      </Container>
  );
}

export {Home};
