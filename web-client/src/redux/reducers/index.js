import { RECEIVE_PROJECTS } from '../actions';

const initialState = {};
const actionsMap = {
  [RECEIVE_PROJECTS]: (state, action) =>
    Object.assign({}, state, {
      projecs: action.projects
    })
};
const rootReducer = (state = initialState, action) => {
  const currentAction = actionsMap[action.type];
  if (currentAction) return currentAction(state, action);
  else return state;
};
export default rootReducer;
