import React from "react";
import SnImagesDefault from "./sn.images-default";

export default function SnImages(props) {
  const TagName = SnImagesDefault;

  return (
    <TagName
      filteredApps={props.filteredApps}
      page={props.page}
      skyspace={props.skyspace}
      itemsPerPage={props.itemsPerPage}
      openSkyApp={props.openSkyApp}
      onDelete={props.onDelete}
      onSelection={props.onSelection}
      isSelect={props.isSelect}
      arrSelectedAps={props.arrSelectedAps}
      hash={props.hash}

    />
  );
}
