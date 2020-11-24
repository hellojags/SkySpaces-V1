import {
  ACT_TY_SET_AUDIO_LIST, ACT_TY_RESET_AUDIO_PLAYER, ACT_TY_ADD_ITEM_IN_AUDIO_LIST, ACT_TY_CHANGE_AUDIO_STATUS,
  ACT_TY_UPDATE_CURRENT_AUDIO
} from './actions/sn.action.constants';

const initialState = {
  audioList: [],
  currentAudio: null,
  playing: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACT_TY_SET_AUDIO_LIST:
      return {
        ...state,
        audioList: [...action.payload],
        currentAudio: action.payload[0] ? action.payload[0] : null
      };
    case ACT_TY_ADD_ITEM_IN_AUDIO_LIST:
      return {
        ...state,
        audioList: [
          ...state.audioList,
          action.payload
        ]
      };
    case ACT_TY_CHANGE_AUDIO_STATUS:
      return {
        ...state,
        playing: action.payload
      };
    case ACT_TY_UPDATE_CURRENT_AUDIO:
      return {
        ...state,
        currentAudio: action.payload
      };
    case ACT_TY_RESET_AUDIO_PLAYER:
      return {
        ...initialState
      };
    default:
      return state;
  }
}