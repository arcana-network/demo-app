const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID;
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

const { StorageProvider } = window.arcana.storage;

function createStorageService() {
  let storage;

  async function init() {
    if (!storage) {
      storage = new StorageProvider({
        appId: ARCANA_APP_ID,
        gateway: GATEWAY_URL,
        provider: window.ethereum,
      });
    }
  }

  async function getUploadLimit() {
    const access = await storage.getAccess();
    return await access.getUploadLimit();
  }

  async function getDownloadLimit() {
    const access = await storage.getAccess();
    return await access.getDownloadLimit();
  }

  async function myFiles() {
    return await storage.myFiles();
  }

  async function sharedFiles() {
    return await storage.sharedFiles();
  }

  async function upload(fileBlob, { onSuccess, onError, onProgress }) {
    const uploader = await storage.getUploader();
    if (onSuccess) uploader.onSuccess = onSuccess;
    if (onError) uploader.onError = onError;
    if (onProgress) uploader.onProgress = onProgress;
    const fileDid = await uploader.upload(fileBlob);
    return fileDid;
  }

  return {
    init,
    getUploadLimit,
    getDownloadLimit,
    myFiles,
    sharedFiles,
    upload,
  };
}

const StorageService = Object.freeze(createStorageService());

export default StorageService;
