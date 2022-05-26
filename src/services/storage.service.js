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

  async function download(fileDid, { onSuccess, onProgress }) {
    const downloader = await storage.getDownloader();
    if (onSuccess) downloader.onSuccess = onSuccess;
    if (onProgress) downloader.onProgress = onProgress;
    await downloader.download(fileDid);
  }

  async function remove(fileDid) {
    const access = await storage.getAccess();
    await access.deleteFile(fileDid);
  }

  async function share(fileDid, address) {
    const access = await storage.getAccess();
    await access.share(fileDid, address);
  }

  return {
    init,
    getUploadLimit,
    getDownloadLimit,
    myFiles,
    sharedFiles,
    upload,
    download,
    remove,
    share,
  };
}

const StorageService = Object.freeze(createStorageService());

export default StorageService;
