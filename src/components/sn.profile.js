import { Grid, TextField } from "@material-ui/core";
import React, { useState } from "react";


export default function SnProfile(props) {
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [ispublic, setIspublic] = useState(false);

    const handleChange = (evt)=> {
        console.log(evt.target);
    }

    return (
        <div className="container-fluid register-container">
            <Grid container spacing={1} direction="row">

            <Grid item xs={12} sm={10}>
                <TextField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  aria-setter={setFirstName}
                  fullWidth
                  value={firstName}
                  autoComplete="off"
                  helperText={
                    "First Name"
                  }
                  onChange={handleChange}
                />
              </Grid>
              
            </Grid>
        </div>
    );
}