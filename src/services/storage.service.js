import {
  StorageProvider,
  AccessTypeEnum,
} from "@arcana/storage/dist/standalone/storage.umd";

const ARCANA_APP_ADDRESS = import.meta.env.VITE_ARCANA_APP_ADDRESS;
const BLOCKCHAIN_ID = import.meta.env.VITE_ARCANA_BLOCKCHAIN_ID;
const GATEWAY_URL = import.meta.env.VITE_ARCANA_GATEWAY_URL;

function createStorageService() {
  let storage;

  async function init() {
    if (!storage) {
      storage = await StorageProvider.init({
        appAddress: ARCANA_APP_ADDRESS,
        gateway: GATEWAY_URL,
        chainId: Number(BLOCKCHAIN_ID),
        provider: window.arcana.provider,
        debug: true,
      });
    }
  }

  async function getUploadLimit() {
    return await storage.files.getUploadLimit();
  }

  async function getDownloadLimit() {
    return await storage.files.getDownloadLimit();
  }

  async function myFiles() {
    return await storage.files.list(AccessTypeEnum.MY_FILES);
  }

  async function sharedFiles() {
    return await storage.files.list(AccessTypeEnum.SHARED_FILES);
  }

  async function upload(fileBlob, { onSuccess, onError, onProgress }) {
    try {
      const fileDid = await storage.upload(fileBlob, { onProgress });
      onSuccess(fileDid);
      return fileDid;
    } catch (error) {
      onError(error);
    }
  }

  async function download(fileDid, { onSuccess, onProgress }) {
    await storage.download(fileDid, onProgress);
    onSuccess();
  }

  async function remove(fileDid) {
    await storage.files.delete(fileDid);
  }

  async function share(fileDid, address) {
    await storage.files.share(fileDid, address);
  }

  async function getSharedUsers(fileDid) {
    return await storage.files.getSharedUsers(fileDid);
  }

  async function revoke(fileDid, address) {
    await storage.files.revoke(fileDid, address);
  }

  async function changeOwner(fileDid, address) {
    await storage.files.changeOwner(fileDid, address);
  }

  return {
    changeOwner,
    download,
    getDownloadLimit,
    getSharedUsers,
    getUploadLimit,
    init,
    myFiles,
    remove,
    revoke,
    share,
    sharedFiles,
    upload,
  };
}

const StorageService = Object.freeze(createStorageService());

export default StorageService;
