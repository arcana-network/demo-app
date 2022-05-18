const state = {
  storageLimits: {
    hasApprovedRequest: false,
    totalStorage: 0,
    storageUsed: 0,
  },
  bandwidthLimits: {
    hasApprovedRequest: false,
    totalBandwidth: 0,
    bandwidthUsed: 0,
  },
  myFiles: [],
  sharedWithMe: [],
};

const getters = {
  hasApprovedStorageLimitsRequest: (state) => {
    return state.storageLimits.hasApprovedRequest
  },
  storageLimits: (state) => {
    return {
      totalStorage: state.storageLimits.totalStorage,
      storageUsed: state.storageLimits.storageUsed,
    };
  },
  hasApprovedBandwidthLimitsRequest: (state) => {
    return state.bandwidthLimits.hasApprovedRequest
  },
  bandwidthLimits: (state) => {
    return {
      totalBandwidth: state.bandwidthLimits.totalBandwidth,
      bandwidthUsed: state.bandwidthLimits.bandwidthUsed,
    };
  },
  myFiles: (state) => {
    return state.myFiles;
  },
  sharedWithMe: (state) => {
    return state.sharedWithMe;
  },
};

const mutations = {
  updateHasApprovedStorageLimitsRequest(state, hasApprovedRequest) {
    state.storageLimits.hasApprovedRequest = hasApprovedRequest;
  },
  updateStorageLimits(state, { totalStorage, storageUsed }) {
    state.storageLimits.totalStorage = totalStorage;
    state.storageLimits.storageUsed = storageUsed;
  },
  updateHasApprovedBandwidthLimitsRequest(state, hasApprovedRequest) {
    state.bandwidthLimits.hasApprovedRequest = hasApprovedRequest;
  },
  updateBandwidthLimits(state, { totalBandwidth, bandwidthUsed }) {
    state.bandwidthLimits.totalBandwidth = totalBandwidth;
    state.bandwidthLimits.bandwidthUsed = bandwidthUsed;
  },
  updateMyFiles(state, myFiles) {
    state.myFiles = myFiles.map((file) => {
      file.fileId = file.did;
      return file;
    });
  },
  updateSharedWithMe(state, sharedWithMe) {
    state.sharedWithMe = sharedWithMe.map((file) => {
      file.fileId = file.did;
      return file;
    });
  },
};

const actions = {
  updateStorageLimits({ commit }, { totalStorage, storageUsed }) {
    commit("updateHasApprovedStorageLimitsRequest", true);
    commit("updateStorageLimits", { totalStorage, storageUsed });
  },
  updateBandwidthLimits({ commit }, { totalBandwidth, bandwidthUsed }) {
    commit("updateHasApprovedBandwidthLimitsRequest", true);
    commit("updateBandwidthLimits", { totalBandwidth, bandwidthUsed });
  },
  updateSharedWithMe({ commit }, sharedWithMe) {
    commit("updateSharedWithMe", sharedWithMe);
  },
  updateMyFiles({ commit }, myFiles) {
    commit("updateMyFiles", myFiles);
  },
};

const storageState = {
  state: () => state,
  getters,
  mutations,
  actions,
};

export default storageState;
