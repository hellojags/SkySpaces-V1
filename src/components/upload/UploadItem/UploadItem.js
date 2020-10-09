import React from 'react';
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import Styles from './UploadItem.module.css';
import cliTruncate from "cli-truncate";

const UploadItem = props => {
  const { file, progress, status, url } = props.file;

  const copyToClipboard = (txtToCopy) => {
    navigator.clipboard.writeText(txtToCopy);
  };

  const displaySkylink = (url)=>{
    return (
      <>
        {cliTruncate(url, 40)}
        <FileCopyOutlinedIcon
                      onClick={()=>copyToClipboard(url)}
                      className="cursor-pointer icn-app-bg-clr"
                      style={{ fontSize: 15}}
                    />
      </>
    );
  }
  return (
    <div className={Styles.wrapperItem}>
      <div className={Styles.leftSide}>
        <div className={Styles.progressBar}>
          <div style={{ width: `${(isNaN(progress) || status==='error' ? 0 : progress)*100}%` }} ></div>
        </div>
        <label>{file.directory ? file.name :  file.path}</label>
        <label>{status!=="complete" ? status : displaySkylink(url)} 
          </label>
      </div>
      <span className={Styles.percentage}>{(isNaN(progress) || status==='error' ? 0 : progress.toFixed(2))*100}%</span>
    </div>
  )
}

export default UploadItem
