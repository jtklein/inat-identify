import {
  SIGNED_IN,
} from '../actions/types';

const INITIAL_STATE = {
  signedIn: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGNED_IN:
      return {
        ...state,
        signedIn: true,
        apiToken: action.payload,
      };
    default:
      return state;
  }
};
