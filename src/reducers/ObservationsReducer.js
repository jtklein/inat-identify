import {
  OBSERVATION_SKIPPED,
} from '../actions/types';

const INITIAL_STATE = {
  skippedObservations: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OBSERVATION_SKIPPED:
      return {
        ...state,
        skippedObservations: state.skippedObservations.concat([action.payload]),
      };
    default:
      return state;
  }
};
