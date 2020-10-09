import React from "react";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import cliTruncate from "cli-truncate";
import SnInfoModal from "../modals/sn.info.modal";
import SnConfirmationModal from "../modals/sn.confirmation.modal";
import Snackbar from "@material-ui/core/Snackbar";
import RestoreIcon from '@material-ui/icons/Restore';
import TextField from "@material-ui/core/TextField";
import SettingsBackupRestoreOutlinedIcon from "@material-ui/icons/SettingsBackupRestoreOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import MuiAlert from "@material-ui/lab/Alert";
import { withStyles } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import moment from "moment";
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { SkynetClient, parseSkylink } from "skynet-js";
import {uploadData} from "../../skyhub/sn.api.skyhub"

import {
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Button,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import {
  mapStateToProps,
  matchDispatcherToProps,
} from "./sn.user-settings.container";
import { skylinkToUrl } from "../../sn.util";
import {
  bsGetUserSetting,
  bsSetUserSetting,
  bsSetPortalsList,
  bsGetBackupObjFile,
  retrieveBackupObj,
  restoreBackup
} from "../../blockstack/blockstack-api";
import { connect } from "react-redux";
import { DEFAULT_PORTAL, APP_BG_COLOR } from "../../sn.constants";

const tableIcons = {
  Add: React.forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: React.forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: React.forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: React.forwardRef((props, ref) => (
    <DeleteOutline {...props} ref={ref} />
  )),
  DetailPanel: React.forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: React.forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: React.forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: React.forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: React.forwardRef((props, ref) => (
    <FirstPage {...props} ref={ref} />
  )),
  LastPage: React.forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: React.forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  PreviousPage: React.forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: React.forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: React.forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: React.forwardRef((props, ref) => (
    <ArrowDownward {...props} ref={ref} />
  )),
  ThirdStateCheck: React.forwardRef((props, ref) => (
    <Remove {...props} ref={ref} />
  )),
  ViewColumn: React.forwardRef((props, ref) => (
    <ViewColumn {...props} ref={ref} />
  )),
};

const useStyles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

const MuiTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#4caf50",
    },
    secondary: {
      main: "#ff9100",
    },
    info: {
      main: "#4caf50",
    },
  },
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class SnUserSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saveAlertMsg: false,
      showConfModal: false,
      userSetting: null,
      showInfoModal: false,
      backupRowData: null,
      alertMessage: null,
      columns: [
        { title: "Portal Name", field: "name" },
        { title: "Portal URL", field: "url" },
        {
          title: "Portal Type",
          field: "type",
          lookup: { Public: "Public", Private: "Private" },
        },
        //   { title: 'Select Portal', field: 'selected', render: rowData => <Chip
        //   label="Clickable"
        //   onClick= {this.handlePortalChange}
        //   variant="outlined"
        // /> },
        //{ title: 'Portal Usage', field: 'usage', lookup: { 1: 'UPLOAD/DOWNLOAD', 2: 'UPLOAD',3: 'DOWNLOAD' }},
      ],
      selectedRow: null,
      backup: {
        data: [],
        columns: [
          {
            title: "Name",
            field: "name",
          },
          {
            title: "Skylink",
            field: "skylink",
            render: (rowData) => {
              return (
                <>
                  {/* {cliTruncate(rowData.skylink, 20, { position: "middle" })} */}
                  {rowData.skylink}
                  <Tooltip title="Copy Skylink to clipboard" arrow onClick={()=>this.copyToClipboard(rowData.skylink)}>
                    <FileCopyOutlinedIcon
                      className="cursor-pointer"
                      style={{ color: APP_BG_COLOR }}
                    />
                  </Tooltip>
                </>
              );
            },
            editable: "never",
          },
        ],
      },
    };
  }
  // Column is coming from state, Data is coming from Props.snPortalsList (in store)
  closeSaveAlertMsg = () => {
    this.setState({ 
      saveAlertMsg: false,
      alertMessage: null
    });
  };

  // handleNewProtal = async () => {
  //   this.props.setLoaderDisplay(true);
  //   await setUserSetting(this.props.userSession, this.state.userSetting);
  //   this.props.setUserSettingAction(this.state.userSetting);
  //   this.props.setLoaderDisplay(false);
  // };
  updatePortalData = async (updatedPortalsList) => {
    this.props.setLoaderDisplay(true);
    let updatedPortalsJsonObj = this.props.snPortalsList;
    updatedPortalsJsonObj.portals = updatedPortalsList;
    bsSetPortalsList(this.props.userSession, updatedPortalsJsonObj).then(
      (res) => {
        this.props.setLoaderDisplay(false);
        this.props.fetchPortalsListAction();
      }
    );
  };

  handlePortalURLChange = async (updatedPortalURL) => {
    const { userSetting } = this.state;
    userSetting.setting["portal"] = updatedPortalURL;
    this.setState({ userSetting });
    this.props.setLoaderDisplay(true);
    await bsSetUserSetting(this.props.userSession, this.state.userSetting);
    this.props.setUserSettingAction(this.state.userSetting);
    this.props.setLoaderDisplay(false);
  };

  handlePortalChange = (evt) => {
    console.log(evt.target.type);
    const { userSetting } = this.state;
    //const fieldName = evt.target.name;
    userSetting.setting["portal"] = evt.target.value;
    this.setState({ userSetting });
  };

  handleSave = async (opt) => {
    this.props.setLoaderDisplay(true);
    await bsSetUserSetting(this.props.userSession, this.state.userSetting);
    this.props.setUserSettingAction(this.state.userSetting);
    this.props.setLoaderDisplay(false);
    if (opt == null || !opt.hideAlert) {
      this.setState({ saveAlertMsg: true });
    }
  };

  componentDidMount() {
    this.props.setLoaderDisplay(true);
    this.loadUserSetting()
    .then(()=>this.props.setLoaderDisplay(false));
  }

  loadUserSetting = async()=> {
    const userSettingJsonObj = await bsGetUserSetting(this.props.userSession);
    this.props.fetchPortalsListAction();
    this.setState({
      userSetting: userSettingJsonObj,
      //data: this.props.snPortalsList ? this.props.snPortalsList.portals:[],
    });
  }

  createBackup = async (evt) => {
    this.props.setLoaderDisplay(true);
    const userSettingRes = await bsGetUserSetting(this.props.userSession);
    this.setState({ userSetting: userSettingRes });
    // if (!this.validateHnsConfig()) {
    //   this.props.setLoaderDisplay(false);
    //   this.setState({ showInfoModal: true });
    //   return;
    // }
    const portal = this.state.userSetting?.setting?.portal || DEFAULT_PORTAL;
    const backupFile = await bsGetBackupObjFile(this.props.userSession, portal);
    const uploadedContent = await new SkynetClient(portal).upload(backupFile);
    console.log("before HNS");
    const uploadRes = await uploadData("home.skapp",backupFile,false,{});
    console.log("After HNS");
    const timeStr = new Date().toString();
    const backupObj = {
      timestamp: timeStr,
      name: "Backup_" + moment(timeStr).format("MM/DD/YYYY h:mm a"),
      skylink: uploadedContent.skylink,
    };
    const userSetting = this.state.userSetting;
    const backupList = userSetting.setting.backupList || [];
    backupList.unshift(backupObj);
    userSetting.setting.backupList = backupList;
    this.setState({ userSetting });
    await bsSetUserSetting(this.props.userSession, userSetting);
    this.props.setLoaderDisplay(false);
  };

  copyToClipboard = (skylink) => {
    navigator.clipboard.writeText(skylink);
  };

  handleHnsChange = (evt) => {
    const fieldName = evt.target.name;
    let {
      userSetting: {
        setting: { hnsconfig },
      },
    } = this.state;
    hnsconfig = hnsconfig || {};
    hnsconfig[fieldName] = evt.target.value;
    const { userSetting } = this.state;
    userSetting.setting.hnsconfig = hnsconfig;
    this.setState({ userSetting });
  };

  handleHnsSave = async () => {
    /* 
    HNS Object:
      this.state.userSetting.setting.hnsconfig.domain
      this.state.userSetting.setting.hnsconfig.apikey
      this.state.userSetting.setting.hnsconfig.apisecret
      this.state.userSetting.setting.hnsconfig.hnsgateway
    */
    this.handleSave({ hideAlert: true });
  };

  validateHnsConfig = () => {
    const { userSetting } = this.state;
    return !(
      userSetting?.setting?.hnsconfig?.domain == null ||
      userSetting?.setting?.hnsconfig?.domain.trim() === "" ||
      userSetting?.setting?.hnsconfig?.apikey == null ||
      userSetting?.setting?.hnsconfig?.apikey.trim() === "" ||
      userSetting?.setting?.hnsconfig?.apisecret == null ||
      userSetting?.setting?.hnsconfig?.apisecret.trim() === "" ||
      userSetting?.setting?.hnsconfig?.hnsgateway == null ||
      userSetting?.setting?.hnsconfig?.hnsgateway.trim() === ""
    );
  };

  restoreBackup = async (rowData)=>{
    this.props.setLoaderDisplay(true);
    const skylink = rowData.skylink;
    const fileUrl = skylinkToUrl(skylink, this.state.userSetting);
    const backupObj = await retrieveBackupObj(this.props.userSession, fileUrl);
    try {
      await restoreBackup(this.props.userSession, backupObj);
    } catch(err){
      console.error("backup restored with error", err);
    }
    this.props.fetchSkyspaceList();
    this.props.fetchSkyspaceAppCount();
    await this.loadUserSetting();
    this.props.setLoaderDisplay(false);
    this.setState({
      saveAlertMsg: true,
      alertMessage: "Skyspace successfully restored with selected backup! Please re-login if changes do not reflect!"
    })
  }

  confirmRestoreBackup = (rowData)=>{
    this.setState({
      backupRowData: rowData,
      showConfModal: true
    });
  }

  render() {
    const { classes, snPortalsList } = this.props;
    let { userSetting, columns } = this.state;
    return (
      <MuiThemeProvider theme={MuiTheme}>
        <CssBaseline />
        <div className="container-fluid register-container">
          <Grid container spacing={1}>
            <Grid item xs={10} sm={10}>
              <div className="d-sm-flex align-items-center justify-content-between settings-header">
                Settings
              </div>
            </Grid>
            <Grid item xs={8} sm={8} className="select-grid">
              <FormControl className={classes.formControl}>
                <InputLabel id="portal-label">
                  Select a default Skynet portal
                </InputLabel>
                {userSetting != null && (
                  <Select
                    labelId="portal-label"
                    id="portalList"
                    fullWidth
                    name="portalList"
                    value={userSetting.setting.portal}
                    onChange={this.handlePortalChange}
                  >
                    {snPortalsList &&
                      snPortalsList.portals.map((obj, index) => (
                        <MenuItem key={index} value={obj.url}>
                          {obj.url}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                <FormHelperText></FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={2} sm={2}>
              <Button
                variant="contained"
                color="primary"
                className="btn-register-pg float-center"
                type="button"
                onClick={this.handleSave}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </Grid>
            <Grid item sx={12} sm={10}>
              <MaterialTable
                icons={tableIcons}
                title="Skynet Portals"
                columns={columns}
                data={(this.props.snPortalsList
                  ? this.props.snPortalsList.portals
                  : []
                ).filter((obj) => obj != null)}
                options={{
                  actionsColumnIndex: -1,
                }}
                editable={{
                  onRowAdd: (newData) =>{
                  console.log("row added");
                    return new Promise((resolve, reject) => {
                      setTimeout(() => {
                        this.updatePortalData([
                          ...snPortalsList.portals,
                          newData,
                        ]);
                        resolve();
                      }, 1000);
                    })},
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        const dataUpdate = [...snPortalsList.portals];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        this.updatePortalData([...dataUpdate]);
                        if (oldData.url === userSetting.setting["portal"]) {
                          this.handlePortalURLChange(newData.url);
                        }
                        resolve();
                      }, 1000);
                    }),
                  onRowDelete: (oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        if (oldData.url === userSetting.setting["portal"]) {
                          alert(
                            oldData.url +
                              " is default skynet portal for SkySpaces. Please change default portal and try. "
                          );
                        } else {
                          const dataDelete = [...snPortalsList.portals];
                          const index = oldData.tableData.id;
                          dataDelete.splice(index, 1);
                          this.updatePortalData([...dataDelete]);
                        }
                        resolve();
                      }, 1000);
                    }),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={10}>
              <Button
                variant="contained"
                color="primary"
                className="btn-register-pg float-center"
                type="button"
                onClick={this.createBackup}
                startIcon={<SettingsBackupRestoreOutlinedIcon />}
              >
                Create Backup
              </Button>
              {userSetting?.setting?.backupList && (
                <MaterialTable
                  icons={tableIcons}
                  title="Backups"
                  columns={this.state.backup.columns}
                  data={userSetting.setting.backupList.filter(
                    (obj) => obj != null
                  )}
                  actions={[
                    {
                      icon: ()=><RestoreIcon />,
                      tooltip: 'Restore Backup',
                      onClick: (evt, rowData)=> this.confirmRestoreBackup(rowData)
                    }
                  ]}
                  editable={{
                    onRowUpdate: (newData, oldData) => {
                      const dataUpdate = [...userSetting.setting.backupList];
                      const index = oldData.tableData.id;
                      dataUpdate[index] = newData;
                      userSetting.setting.backupList = dataUpdate;
                      this.setState({ userSetting });
                      return this.handleSave({ hideAlert: true });
                    },
                  }}
                  options={{
                    actionsColumnIndex: -1,
                  }}
                />
              )}
            </Grid>
            {userSetting && (
              <Grid item xs={12} sm={10}>
                <Paper elevation={2}>
                  <Grid item xs={12}>
                    <Typography>
                      HNS Configuration (** Work In Progress **)
                    </Typography> 
                    <Button
                        variant="contained"
                        color="primary"
                        className="btn-register-pg float-center"
                        type="button"
                        onClick={this.handleHnsSave}
                        //disabled={!this.validateHnsConfig()}
                        disabled={true}
                        startIcon={<SaveIcon />}
                      >
                        Save
                      </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="domain"
                      name="domain"
                      label={"HNS Domain"}
                      value={userSetting?.setting?.hnsconfig?.domain}
                      fullWidth
                      autoComplete="off"
                      onChange={this.handleHnsChange}
                      helperText={"HNS domain name is a mandatory field."}
                      disabled="true"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="apikey"
                      name="apikey"
                      label={"HNS Apikey"}
                      fullWidth
                      value={userSetting?.setting?.hnsconfig?.apikey}
                      autoComplete="off"
                      onChange={this.handleHnsChange}
                      helperText={"HNS apikey is a mandatory field."}
                      disabled="true"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="apisecret"
                      name="apisecret"
                      label={"HNS Secret"}
                      fullWidth
                      value={userSetting?.setting?.hnsconfig?.apisecret}
                      autoComplete="off"
                      onChange={this.handleHnsChange}
                      helperText={"HNS Secret is a mandatory field."}
                      disabled="true"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="hnsgateway"
                      name="hnsgateway"
                      label={"HNS Gateway"}
                      fullWidth
                      autoComplete="off"
                      value={userSetting?.setting?.hnsconfig?.hnsgateway}
                      onChange={this.handleHnsChange}
                      helperText={"HNS Gateway is a mandatory field."}
                      disabled="true"
                    />
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
        </div>
        <Snackbar
          open={this.state.saveAlertMsg}
          autoHideDuration={4000}
          onClose={this.closeSaveAlertMsg}
        >
          <Alert onClose={this.closeSaveAlertMsg} severity="success">
            {this.state.alertMessage!=null ? this.state.alertMessage : 
            "Default Skynet Protal is successfully changed to " + (userSetting && userSetting.setting["portal"])
            }
          </Alert>
        </Snackbar>

        <SnInfoModal
          open={this.state.showInfoModal}
          onClose={() => this.setState({ showInfoModal: false })}
          title="Backup Error"
          content="Please provide HNS configuration before creating backup."
        />

        <SnConfirmationModal
          open={this.state.showConfModal}
          onYes={() => {
            this.setState({ showConfModal: false })
            this.restoreBackup(this.state.backupRowData)
          }}
          onNo={() => this.setState({ showConfModal: false })}
          title="Warning!"
          content="This action will permanently revert your Skyspace to the selected restore point. Do you want to continue?"
        />
      </MuiThemeProvider>
    );
  }
}

export default withStyles(useStyles)(
  connect(mapStateToProps, matchDispatcherToProps)(SnUserSettings)
);
