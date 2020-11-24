import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Tabs, Tab, InputAdornment, Typography } from '@material-ui/core';
import LockIcon from "@material-ui/icons/Lock";
import { Face, Fingerprint, PermIdentity } from '@material-ui/icons';
import styles from "./sn.login.styles";
import {
    mapStateToProps,
    matchDispatcherToProps,
} from "./sn.login.container";
import { connect } from "react-redux";
import { bsGetImportedSpacesObj } from '../../blockstack/blockstack-api';

class snLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seed: null,
            value: 1,
            isTemp: true
        }
    }

    componentDidMount() {
        if (this.props.showDesktopMenu === false) {
            this.props.setDesktopMenuState(true);
        }
        if (this.props.person) {
            this.props.history.push("/upload");
        }
    }

    componentDidUpdate() {
        if (this.props.person) {
            this.props.history.push("/upload");
        }
    }

    handleSeedChange = (evt) => {
        this.setState({
            seed: evt.target.value
        });
    }

    login = async () => {
        if (this.state.seed && this.state.seed.trim().length > 0) {

            const personObj = {
                username: this.state.seed,
                profile: {
                    decentralizedID: this.state.seed
                }
            }
            this.props.setLoaderDisplay(true);
            const userSession = { skydbseed: this.state.seed };
            this.props.setUserSession(userSession);
            this.props.setPersonGetOtherData(personObj);
            this.props.setImportedSpace(await bsGetImportedSpacesObj(userSession));
            this.props.setLoaderDisplay(false);
            this.props.history.push("/upload" + this.props.location.search);
        } else {
            console.log("no seed");
        }
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue });
    };

    render() {
        const { classes } = this.props;
        const { value } = this.state;
        return (
            <div style={{ paddingTop: 50 }}>
                <Grid
                    container
                    spacing={3}
                    className={`most_main_grid_auth ${classes.most_main_grid_auth}`}
                >
                    <Grid
                        item
                        lg={4}
                        md={5}
                        sm={7}
                        xs={12}
                        className={classes.main_grid_auth}
                    >
                        <Paper className={`${classes.paper} ${classes.MaintabsPaper}`}>
                            <Paper className={classes.tabsPaper}>
                                <Tabs
                                    value={value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab
                                        label="Sign up"
                                        className={classes.butn_tab1, "d-none"}
                                        active={true}
                                        style={{
                                            background: `${value == 0 ? "white" : "#F3F3F3"}`,
                                        }}
                                    />
                                    <Tab
                                        label="Login"
                                        className={classes.butn_tab1}
                                        style={{
                                            background: `${value == 1 ? "white" : "#F3F3F3"}`,
                                        }}
                                    />
                                </Tabs>
                            </Paper>
                            {/* container for input username or email */}
                            <Grid container spacing={3} className="inpt-mail-pass-main-grid">
                                {value === 0 ? (
                                    <Grid item lg={12} className={classes.mail_inpt_grid}>
                                        <div>
                                            <TextField
                                                className={`${classes.margin} ${classes.mail_textfield}`}
                                                id="input-with-icon-textfield"
                                                placeholder="Username or Email"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PermIdentity
                                                                style={{ content: "none", color: "lightGray" }}
                                                            />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            {/* password */}

                                            <TextField
                                                className={`${classes.margin} ${classes.password_textfield}`}
                                                id="input-with-icon-textfield"
                                                placeholder="Password"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment
                                                            position="start"
                                                            style={{ content: "none", color: "lightGray" }}
                                                        >
                                                            <LockIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </div>

                                        <Typography
                                            variant="span"
                                            className={classes.txt_span_frgt_pass}
                                        >
                                            Forgot Your Password?
                        </Typography>

                                        <Grid container spacing={3}>
                                            <Grid item xs={8} style={{ margin: "auto" }}>
                                                <Button
                                                    variant="contained"
                                                    className={classes.butn_login}
                                                    onClick={() => console.log("history.push dashboard")}
                                                >
                                                    Sign up
                            </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ) : (
                                        <Grid item lg={12} className={classes.mail_inpt_grid}>
                                            <div>
                                                <TextField
                                                    className={`${classes.margin} ${classes.mail_textfield}`}
                                                    id="input-with-icon-textfield"
                                                    placeholder="Seed"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PermIdentity style={{ color: "lightGray" }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    onChange={this.handleSeedChange}
                                                    required
                                                />

                                                {/* password */}

                                                <TextField
                                                    className={`${classes.margin} ${classes.password_textfield} d-none`}
                                                    id="input-with-icon-textfield"
                                                    placeholder="Password"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment
                                                                position="start"
                                                                style={{ content: "none", color: "lightGray" }}
                                                            >
                                                                <PermIdentity />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </div>

                                            <Typography
                                                variant="span"
                                                className={classes.txt_span_frgt_pass, "d-none"}
                                            >
                                                Forgot Your Password?
                        </Typography>

                                            <Grid container spacing={3}>
                                                <Grid item xs={8} style={{ margin: "auto" }}>
                                                    <Button
                                                        variant="contained"
                                                        className={classes.butn_login}
                                                        onClick={this.login}
                                                    >
                                                        Login
                            </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )}
                            </Grid>
                        </Paper>

                        <Grid container spacing={3}>
                            <Grid item xs={12} className={classes.description_auth}>
                                Registring to SkySpaces,you accept our{" "}
                                <span style={{ color: "#1DD65F", fontWeight: "600" }}>
                                    Terms of use
                    </span>{" "}
                    and <br />
                    our{" "}
                                <span style={{ color: "#1DD65F", fontWeight: "600" }}>
                                    Privacy policy
                    </span>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );

    }
}

export default withStyles(styles, { withTheme: true })
    (
        connect(mapStateToProps, matchDispatcherToProps)(snLogin)
    );