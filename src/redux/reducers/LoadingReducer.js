export const LoadingReducer = (prevState={isLoading:false}, action) => {
    let {type} = action;
    switch (type){
        case "change_loading":
            // let newstate = {...prevState};
            // newstate.isLoading = !newstate.isLoading;
            // return newstate
            return Object.assign({},{isLoading:!prevState.isLoading});
        default:
            return prevState
    }
}