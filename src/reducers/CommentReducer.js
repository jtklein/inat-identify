const INITIAL_STATE = {
  predefinedComments: [
    undefined,
    'I am not sure what the focus of this observation is. What would you like to have identified?',
    'Each observation should be about a single species. Rather than adding several photos of different species to a single observation, please put each in its own observation. You can add multiple pictures to an observation when they are each pictures of the same thing.',
    'If you do upload captive or planted things like house plants, garden plants, zoo animals, or pets, please mark them as "captive/cultivated" on the add observation screen. That helps make sure the range maps only represent wild populations. You can also mark it after uploading the observation by clicking the "thumbs down" next to "Organism is wild?" in the Data Quality Assessment section at the bottom of this page on the website. Thanks!',
  ],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
