const initialState = {
  userId: null,
  otherValue: "hello there",
};

// front end components will dispatch an action object:
// { type: "USER_AUTH", payload: userId }
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "USER_AUTH":
      return {
        ...state,
        userId: action.payload,
      };
    // triggered from front end with the dispatch action object: { type: "LOGOUT" }
    case "LOGOUT":
      return {
        ...state,
        userId: null,
      };
    default:
      return state;
  }
}
