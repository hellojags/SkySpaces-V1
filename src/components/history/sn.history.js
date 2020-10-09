import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { Redirect } from "react-router-dom";
import {
  APP_BG_COLOR, STORAGE_SKYAPP_DETAIL_KEY,
  BROWSER_STORAGE
} from "../../sn.constants";
import MaterialTable from "material-table"
import { readableBytes } from "../../sn.util";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import cliTruncate from "cli-truncate";
import { authOrigin, appDetails, userSession } from "../../blockstack/constants";
import {
  mapStateToProps,
  matchDispatcherToProps,
} from "./sn.history.container";
import { bsSetHistory, bsClearHistory } from "../../blockstack/blockstack-api";
import { authenticate } from "@blockstack/connect";
import { ITEMS_PER_PAGE } from "../../sn.constants";

const tableIcons = {
  Add: React.forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: React.forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: React.forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: React.forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: React.forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: React.forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: React.forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: React.forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: React.forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: React.forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: React.forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: React.forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: React.forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: React.forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: React.forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: React.forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: React.forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

const doSignIn = () => {
  const authOptions = {
    redirectTo: "/",
    manifestPath: '/manifest.json',
    authOrigin,
    userSession,
    sendToSignIn: true,
    finished: ({ userSession }) => {
      this.props.setUserSession(userSession);
      this.props.setPersonGetOtherData(userSession.loadUserData());
    },
    appDetails: appDetails,
  };
  //this.props.userSession.redirectToSignIn();
  authenticate(authOptions);
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class SnHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      saveToSkyspace: false,
      openCopySuccess: false,
      columns: [
        {
          title: 'File Name', field: 'fileName', render: rowData => (
            <div>
              <span className="font-weight-bold h6" color="black">
                {rowData.fileName}
              </span>
              <br />
              <Tooltip title={rowData.skylink} arrow>
                <span>{cliTruncate(rowData.skylink, 11, { position: 'middle' })}</span>
              </Tooltip>
              <Tooltip title="Copy Skylink to clipboard" arrow>
                <FileCopyOutlinedIcon
                  onClick={e => this.copyToClipboard(e, rowData.skylink)}
                  className="cursor-pointer"
                  style={{ color: APP_BG_COLOR, paddingLeft: 10 }}
                  value={rowData.skylink}
                />
              </Tooltip>
              <br />
              <font color="primary">{rowData.contentType}  </font> | <font color="primary">{rowData.contentLength && !isNaN(rowData.contentLength) && readableBytes(rowData.contentLength)} </font>
            </div>
          )
        },
        { title: 'Activity Time', field: 'timestamp', type: 'datetime' },
        { title: 'Activity Type', field: 'action' },
        {
          title: 'Spaces', field: 'skyspaces',
          render: (rowData) => rowData.skyspaces ? this.loadAvailableAction(rowData): "N/A"
        }
      ],
    };
    this.props.fetchHistory(this.props.userSession);
  }

  onSaveToSkyspace = (rowData) => {
    this.props.skyapp["skhubId"] = rowData.skhubId;
    this.props.skyapp["skylink"] = rowData.skylink;
    this.props.skyapp["name"] = rowData.fileName;
    this.props.setSkappDetail(this.props.skyapp);
    if (
      this.props.person == null &&
      !this.props.userSession.isSignInPending()
    ) {
      BROWSER_STORAGE.setItem(
        STORAGE_SKYAPP_DETAIL_KEY,
        JSON.stringify(this.props.skyapp)
      );
      doSignIn();
    } else {
      this.setState({
        saveToSkyspace: true,
      });
    }
  };

  loadAvailableAction = (rowData) => {
    return (rowData.savedToSkySpaces === false) ?
      <Tooltip title="Add to Spaces" arrow>
        <IconButton onClick={() => this.onSaveToSkyspace(rowData)}>
          <AddCircleOutlineOutlinedIcon style={{ color: APP_BG_COLOR, fontSize: 25 }} />
        </IconButton>
      </Tooltip> : <div>{rowData.skyspaces}</div>;
  }

  copyToClipboard = (evt, skylink) => {
    navigator.clipboard.writeText(skylink);
    this.setState({ openCopySuccess: true });
  }

  closeCopySucess = () => {
    this.setState({ openCopySuccess: false });
  }

  udpdatePage = (page) => {
    this.setState({ page });
  }

  getFilteredHistory = () => {
    const startIdx = (this.state.page - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    return this.props.history.slice(startIdx, endIdx);
  }

  selectAll = (evt) => {
    console.log(evt.target.checked);
  }

  deleteSelectedHistory = async (rowData) => {
    this.props.setLoaderDisplay(true);
    if (rowData && this.props.history && this.props.history.length === rowData.length) {
      bsClearHistory(this.props.userSession).then(
        () => {
          this.props.fetchHistory(this.props.userSession);
          this.props.setLoaderDisplay(false);
        });
    }
    else {
      //make copy of history object
      const updatedHistoryObj = [...this.props.history];
      const selectedIdList = (rowData.map(x => x.tableData.id))
      const tempUpdatedHistoryObj = updatedHistoryObj.filter(item => !selectedIdList.includes(item.tableData.id))
      //update History object in Blockstack
      bsSetHistory(this.props.userSession, tempUpdatedHistoryObj).then(
        (res) => {
          this.props.fetchHistory(this.props.userSession);
          this.props.setLoaderDisplay(false);
        });
    }
  }

  render() {
    let { columns } = this.state;
    if (this.state.saveToSkyspace) {
      return <Redirect to="/register" />;
    }
    return (
      <div className="container-fluid register-container">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <MaterialTable
              icons={tableIcons}
              title="Activity History"
              columns={columns}
              data={this.props.history}
              options={{
                selection: true,
                sorting: true,
                actionsColumnIndex: -1
              }}
              actions={[
                {
                  tooltip: 'Remove Selected Activity History',
                  icon: tableIcons.Delete,
                  onClick: (event, rows) => { this.deleteSelectedHistory(rows) }
                }
              ]}
            />
          </Grid>
        </Grid>
        <Snackbar
          open={this.state.openCopySuccess}
          autoHideDuration={4000}
          onClose={this.closeCopySucess}
        >
          <Alert onClose={this.closeCopySucess} severity="success">
            Skylink successfully copied to clipboard!
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(useStyles)(
  connect(mapStateToProps, matchDispatcherToProps)(SnHistory)
);
