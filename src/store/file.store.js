const state = {
  myFiles: [],
  sharedWithMe: [],
  trash: [],
};

const getters = {
  myFiles: (state) => {
    return state.myFiles;
  },
  sharedWithMe: (state) => {
    return state.sharedWithMe;
  },
  trash: (state) => {
    return state.trash;
  },
};

const mutations = {
  updateMyFiles(state, myFiles) {
    state.myFiles = myFiles;
  },
  updateSharedWithMe(state, sharedWithMe) {
    state.sharedWithMe = sharedWithMe;
  },
  updateTrash(state, trash) {
    state.trash = trash;
  },
};

const actions = {
  updateFiles({ commit }, { myFiles, sharedWithMe, trash }) {
    commit("updateMyFiles", myFiles);
    commit("updateSharedWithMe", sharedWithMe);
    commit("updateTrash", trash);
  },
};

const fileState = {
  state: () => state,
  getters,
  mutations,
  actions,
};

export default fileState;
