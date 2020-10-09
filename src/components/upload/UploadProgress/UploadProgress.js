import React, { useEffect, useState } from 'react';
import MinimizeOutlinedIcon from '@material-ui/icons/MinimizeOutlined';
import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import { connect } from 'react-redux';

// import { uploadFile } from '../../redux/uploadFile/uploadFile.actions'
import UploadItem from '../UploadItem/UploadItem'
import Styles from './UploadProgress.module.css'

const UploadProgress = props => {
  const { fileProgress, uploadFile } = props;
  const uploadedFileAmount = fileProgress.length;
  const [minimized, setMinimized] = useState(false);

   useEffect(() => {
    minimized && setMinimized(false);
   }, [uploadedFileAmount])

  return uploadedFileAmount > 0 ? (
    <div className={Styles.wrapper}>
      <div className={Styles.uploadFileStatusTitle + " app-bg-color"}>Uploading File 
        {!minimized && (<ArrowDropDownOutlinedIcon className="float-right cursor-pointer" 
          onClick={()=>setMinimized(true)}/>)}
        {minimized && (<ArrowDropUpOutlinedIcon className="float-right cursor-pointer" 
          onClick={()=>setMinimized(false)}/>)}
      </div>
      <div className={Styles.progressContainer} style={minimized ? { height: 0}:{}}>
      {fileProgress && fileProgress.length>0 
        ? fileProgress.map((fileObj, i) => <UploadItem key={i} file={fileObj} />)
        : null}
      </div>
    </div>
  ) : null
}

const mapStateToProps = state => ({
  fileProgress: state.snUploadList
})

// const mapDispatchToProps = dispatch => ({
//   uploadFile: files => dispatch(uploadFile(files)),
// })

export default connect(mapStateToProps)(UploadProgress)
