import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import CasinoOutlinedIcon from "@material-ui/icons/CasinoOutlined";
import SportsEsportsOutlinedIcon from "@material-ui/icons/SportsEsportsOutlined";
import MenuBookTwoToneIcon from "@material-ui/icons/MenuBookTwoTone";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import LiveTvOutlinedIcon from "@material-ui/icons/LiveTvOutlined";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";
import PermDeviceInformationOutlinedIcon from "@material-ui/icons/PermDeviceInformationOutlined";
import BusinessCenterOutlinedIcon from "@material-ui/icons/BusinessCenterOutlined";
import SnImages from "./components/categories/images/sn.images";
import SnVideo from "./components/categories/video/sn.video";
import SnAudio from "./components/categories/audio/sn.audio";

export const CATEGORY_OBJ = {
  all: {
    getLogo: () => <AllInclusiveIcon />,
    heading: "All",
  },
  video: {
    fileTypeList: ["video/x-msvideo", "video/mpeg", "video/ogg", "video/webm", "video/3gpp", "video/3gpp2",
      "video/mp4"],
    getLogo: (className) => <FontAwesomeIcon icon="video" className={className ? className : ""}></FontAwesomeIcon>,
    heading: "Videos",
    cards: (page, filteredApps, skyspace, itemsPerPage, openSkyApp, onSelection, isSelect, arrSelectedAps, hash, funcOnDelete, senderId) => (
      <SnVideo
        filteredApps={filteredApps}
        page={page}
        skyspace={skyspace}
        itemsPerPage={itemsPerPage}
        openSkyApp={openSkyApp}
        onDelete={funcOnDelete}
        onSelection={onSelection}
        isSelect={isSelect}
        arrSelectedAps={arrSelectedAps}
        hash={hash}
        senderId={senderId}
      />
    )
  },
  pictures: {
    fileTypeList: ["image/bmp", "image/gif", "image/x-icon", "image/jpeg", "image/png", "image/svg+xml",
      "image/tiff"],
    getLogo: (className) => <CameraAltOutlinedIcon className={className ? className : ""} />,
    heading: "Images",
    cards: (page, filteredApps, skyspace, itemsPerPage, openSkyApp, onSelection, isSelect, arrSelectedAps, hash, funcOnDelete, senderId) => (
      <SnImages
        filteredApps={filteredApps}
        page={page}
        skyspace={skyspace}
        itemsPerPage={itemsPerPage}
        openSkyApp={openSkyApp}
        onDelete={funcOnDelete}
        onSelection={onSelection}
        isSelect={isSelect}
        arrSelectedAps={arrSelectedAps}
        hash={hash}
        senderId={senderId}
      />
    )
  },
  audio: {
    fileTypeList: ["audio/aac", "audio/mpeg"],
    getLogo: (className) => <FontAwesomeIcon icon="headphones" className={className ? className : ""}></FontAwesomeIcon>,
    heading: "Audio",
    cards: (page, filteredApps, skyspace, itemsPerPage, openSkyApp, onSelection, isSelect, arrSelectedAps, hash, funcOnDelete, senderId) => (
      <SnAudio
        filteredApps={filteredApps}
        page={page}
        skyspace={skyspace}
        itemsPerPage={itemsPerPage}
        openSkyApp={openSkyApp}
        onDelete={funcOnDelete}
        onSelection={onSelection}
        isSelect={isSelect}
        arrSelectedAps={arrSelectedAps}
        hash={hash}
        senderId={senderId}
      />
    )
  },
  documents: {
    fileTypeList: ["application/x-abiword", "application/x-freearc", "application/vnd.amazon.ebook", "application/msword",
      "text/html", "text/plain", "application/pdf"],
    getLogo: (className) => <DescriptionOutlinedIcon className={className ? className : ""} />,
    heading: "Documents",
  },
  games: {
    getLogo: (className) => <SportsEsportsOutlinedIcon className={className ? className : ""} />,
    heading: "Games",
  },
  blog: {
    getLogo: (className) => <FontAwesomeIcon icon="blog" className={className ? className : ""}></FontAwesomeIcon>,
    heading: "Blogs",
  },
  utilities: {
    getLogo: (className) => <BusinessCenterOutlinedIcon className={className ? className : ""} />,
    heading: "Utilities",
  },
  software: {
    getLogo: (className) => <CasinoOutlinedIcon className={className ? className : ""} />,
    heading: "Software",
  },
  livestream: {
    getLogo: (className) => <LiveTvOutlinedIcon className={className ? className : ""} />,
    heading: "LiveStream",
  },
  books: {
    getLogo: (className) => <MenuBookTwoToneIcon className={className ? className : ""} />,
    heading: "Books",
  },
  data: {
    getLogo: (className) => <PermDeviceInformationOutlinedIcon className={className ? className : ""} />,
    heading: "Data",
  },
};

export const getCategoryObjWithoutAll = () => {
  const categoryObjCopy = JSON.parse(JSON.stringify(CATEGORY_OBJ));
  delete categoryObjCopy.all;
  return categoryObjCopy;
};

export const getCategoryObjWithoutAllAsArray = () => {
  const categoryObjCopy = JSON.parse(JSON.stringify(CATEGORY_OBJ));
  delete categoryObjCopy.all;
  const categoryArr = [];
  for (const key in categoryObjCopy) {
    if (categoryObjCopy.hasOwnProperty(key)) {
      const obj = {
        key,
        label: categoryObjCopy[key].heading,
      };
      categoryArr.push(obj);
    }
  }
  return categoryArr;
};
