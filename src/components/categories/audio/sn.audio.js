import React from "react";
import SnAudioDefault from "./sn.audio-default";
import "./Audio.css";

export default function SnAudio(props) {
  const TagName = SnAudioDefault;

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
