import { RECEIVE_PROJECTS, RECEIVE_PROJECT } from '../actions';

const initialState = {};
const actionsMap = {
  [RECEIVE_PROJECTS]: (state, action) =>
    Object.assign({}, state, {
      projects: action.projects
    }),
  [RECEIVE_PROJECT]: (state, action) =>
    Object.assign({}, state, {
      project: action.project
    })
};
const rootReducer = (state = initialState, action) => {
  const currentAction = actionsMap[action.type];
  if (currentAction) return currentAction(state, action);
  else return state;
};
export default rootReducer;
