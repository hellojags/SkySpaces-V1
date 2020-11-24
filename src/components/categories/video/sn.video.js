import React from "react";
import SnVideosDefault from "./sn.videos-default";

export default function SnVideo(props) {
  const TagName = SnVideosDefault;

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
      senderId={props.senderId}
    />
  );
}
