const INITIAL_STATE = {
  predefinedComments: [
    undefined,
    'You have different species in your pictures, please split them up into different observations.',
    'I am not sure what the focus of this observation is. What would you like to have identified?',
  ],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
