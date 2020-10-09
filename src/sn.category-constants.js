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

export const CATEGORY_OBJ = {
  all: {
    getLogo: () => <AllInclusiveIcon />,
    heading: "All",
  },
  video: {
    fileTypeList: ["video/x-msvideo", "video/mpeg", "video/ogg", "video/webm", "video/3gpp", "video/3gpp2",
  "video/mp4"],
    getLogo: () => <FontAwesomeIcon icon="video"></FontAwesomeIcon>,
    heading: "Videos",
    cards: (page, filteredApps, skyspace, itemsPerPage, openSkyApp, onSelection, isSelect, arrSelectedAps, hash, funcOnDelete) => (
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
        />
      )
  },
  pictures: {
    fileTypeList: ["image/bmp", "image/gif", "image/x-icon", "image/jpeg", "image/png", "image/svg+xml",
  "image/tiff"],
    getLogo: () => <CameraAltOutlinedIcon />,
    heading: "Images",
    cards: (page, filteredApps, skyspace, itemsPerPage, openSkyApp, onSelection, isSelect, arrSelectedAps, hash, funcOnDelete) => (
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
        />
      )
  },
  audio: {
    fileTypeList: ["audio/aac", "audio/mpeg"],
    getLogo: () => <FontAwesomeIcon icon="headphones"></FontAwesomeIcon>,
    heading: "Audio",
  },
  documents: {
    fileTypeList: ["application/x-abiword", "application/x-freearc", "application/vnd.amazon.ebook", "application/msword",
    "text/html", "text/plain", "application/pdf"],
    getLogo: () => <DescriptionOutlinedIcon />,
    heading: "Documents",
  },
  games: {
    getLogo: () => <SportsEsportsOutlinedIcon />,
    heading: "Games",
  },
  blog: {
    getLogo: () => <FontAwesomeIcon icon="blog"></FontAwesomeIcon>,
    heading: "Blogs",
  },
  utilities: {
    getLogo: () => <BusinessCenterOutlinedIcon />,
    heading: "Utilities",
  },
  software: {
    getLogo: () => <CasinoOutlinedIcon />,
    heading: "Software",
  },
  livestream: {
    getLogo: () => <LiveTvOutlinedIcon />,
    heading: "LiveStream",
  },
  books: {
    getLogo: () => <MenuBookTwoToneIcon />,
    heading: "Books",
  },
  data: {
    getLogo: () => <PermDeviceInformationOutlinedIcon />,
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
