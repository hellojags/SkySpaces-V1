import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import CoolPlayer from 'react-cool-music-player';
import 'react-cool-music-player/dist/index.css';
import { setChangedAudioStatusAction, updateCurrentAudioAction } from '../../../reducers/actions/sn.audio-player.action';
import { useSelector, useDispatch } from "react-redux";

export default function AudioPlayer(props) {
    const dispatch = useDispatch();

    const audioList = useSelector((state) => state.SnAudioPlayer.audioList);
    const playing = useSelector((state) => state.SnAudioPlayer.playing);
    const currentAudio = useSelector((state) => state.SnAudioPlayer.currentAudio);
    const SnAudioPlayer = useSelector((state) => state.SnAudioPlayer);
    
    const audioStatusChanged = (status) => {
        dispatch(setChangedAudioStatusAction(status));
    }

    const audioChanged = (id, currentMusic) => {
        id && dispatch(updateCurrentAudioAction(currentMusic));
    }

    return (
        <div className={'audio-player-wrapper'}>
            <CoolPlayer
                data={audioList}
                play={playing}
                currentAudio={currentAudio}
                showLyricNormal={false}
                showDetailLyric={false}
                onPlayStatusChange={(currentAudio, isPlayed) => {
                    audioStatusChanged(isPlayed)
                }}
                onAudioChange={(id, currentMusic) => {
                    audioChanged(id, currentMusic)
                }}
            />
        </div>
    )
}