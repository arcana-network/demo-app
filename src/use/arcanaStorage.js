import bytes from "bytes";
import { useStore } from "vuex";

import StorageService from "../services/storage.service";
import AuthService from "../services/auth.service";
import useArcanaWallet from "../use/arcanaWallet";
import useToast from "../use/toast";

const FILE_SIZE_LIMIT = bytes("100MB");

function useArcanaStorage() {
  const store = useStore();
  const { toastSuccess, toastError } = useToast();
  const { requestPublicKey } = useArcanaWallet();

  function initStorage() {
    StorageService.init();
  }

  async function fetchStorageLimits() {
    try {
      const [storageUsed, totalStorage] = await StorageService.getUploadLimit();
      const [bandwidthUsed, totalBandwidth] =
        await StorageService.getDownloadLimit();
      store.dispatch("updateStorageLimits", {
        totalStorage,
        storageUsed,
      });
      store.dispatch("updateBandwidthLimits", {
        totalBandwidth,
        bandwidthUsed,
      });
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  }

  async function fetchMyFiles() {
    try {
      const myFiles = await StorageService.myFiles();
      store.dispatch("updateMyFiles", myFiles);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  }

  async function fetchSharedFiles() {
    try {
      const sharedFiles = await StorageService.sharedFiles();
      store.dispatch("updateSharedWithMe", sharedFiles);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  }

  async function upload(file) {
    if (file.size > FILE_SIZE_LIMIT) {
      toastError("You are not allowed to upload files bigger than 100MB.");
      throw new Error("File size exceeded maximum");
    }

    console.time("Upload");

    try {
      let uploadDate = new Date(),
        totalSize;

      store.dispatch("showInlineLoader", "Uploading file");

      const did = await StorageService.upload(file, {
        onProgress: (uploaded, total) => {
          store.dispatch(
            "showInlineLoader",
            `Uploaded ${bytes(uploaded)} / ${bytes(total)}`
          );
          totalSize = total;
        },
        onError: (error) => {
          console.error(error);
          toastError(error.message);
          store.dispatch("hideInlineLoader");
        },
        onSuccess: () => {
          fetchStorageLimits();
          toastSuccess("Upload success");
          let myFiles = [...store.getters.myFiles];
          myFiles.push({
            did,
            createdAt: uploadDate,
            size: totalSize,
          });
          store.dispatch("updateMyFiles", myFiles);
          store.dispatch("hideInlineLoader");
        },
      });
    } catch (error) {
      console.error(error);
      toastError(error.message);
    } finally {
      console.timeEnd("Upload");
      store.dispatch("hideInlineLoader");
    }
  }

  async function download(file) {
    console.time("Download");

    try {
      store.dispatch("showInlineLoader", "Downloading file");

      await StorageService.download(file.fileId, {
        onProgress: (downloaded, total) => {
          store.dispatch(
            "showInlineLoader",
            `Downloaded ${bytes(downloaded)} / ${bytes(total)}`
          );
        },
        onSuccess: () => {
          fetchStorageLimits();
          toastSuccess("Download success");
          store.dispatch("hideInlineLoader");
        },
      });
    } catch (error) {
      console.error(error);
      toastError(error.message);
    } finally {
      console.timeEnd("Download");
      store.dispatch("hideInlineLoader");
    }
  }

  async function remove(file) {
    console.time("Delete");

    try {
      store.dispatch("showInlineLoader", "Deleting file");

      await StorageService.remove(file.fileId);
      let myFiles = [...store.getters.myFiles];
      myFiles = myFiles.filter((myFile) => myFile.fileId !== file.fileId);
      store.dispatch("updateMyFiles", myFiles);

      fetchStorageLimits();
      toastSuccess("Delete success");
    } catch (error) {
      console.error(error);
      toastError(error.message);
    } finally {
      console.timeEnd("Delete");
      store.dispatch("hideInlineLoader");
    }
  }

  async function share(file, email) {
    console.time("Share");

    try {
      store.dispatch("showInlineLoader", "Sharing file");

      const publicKey = await requestPublicKey(email);
      const address = AuthService.computeAddress(publicKey);
      await StorageService.share(file.fileId, address);
      toastSuccess(`Shared file successfully with ${email}`);
    } catch (error) {
      console.error(error);
      toastError(error.message);
    } finally {
      console.timeEnd("Share");
      store.dispatch("hideInlineLoader");
    }
  }

  async function getSharedUsers(did) {
    try {
      store.dispatch("showInlineLoader", "Fetch shared users");

      return await StorageService.getSharedUsers(did);
    } catch (error) {
      console.error(error);
      toastError(error.message);
    } finally {
      store.dispatch("hideInlineLoader");
    }
  }

  async function revoke(fileToRevoke, address) {
    try {
      store.dispatch("showInlineLoader", "Revoking file access");

      await StorageService.revoke(fileToRevoke.fileId, address);
      toastSuccess("File access revoked");
    } catch (error) {
      console.error(error);
      toastError(error.message);
    } finally {
      console.timeEnd("Revoke");
      store.dispatch("hideInlineLoader");
    }
  }

  async function changeFileOwner(fileToTransfer, email) {
    console.time("Transfer");

    try {
      store.dispatch("showInlineLoader", "Transfering file");

      const publicKey = await requestPublicKey(email);
      const address = AuthService.computeAddress(publicKey);
      await StorageService.changeFileOwner(fileToTransfer.fileId, address);

      let myFiles = [...store.getters.myFiles];
      myFiles = myFiles.filter((file) => file.did !== fileToTransfer.fileId);
      store.dispatch("updateMyFiles", myFiles);

      await fetchStorageLimits();

      toastSuccess(`Transferred file ownership to ${email}`);
    } catch (error) {
      console.error(error);
      toastError(error.message);
    } finally {
      console.timeEnd("Transfer");
      store.dispatch("hideInlineLoader");
    }
  }

  return {
    changeFileOwner,
    download,
    fetchMyFiles,
    fetchSharedFiles,
    fetchStorageLimits,
    getSharedUsers,
    initStorage,
    remove,
    revoke,
    share,
    upload,
  };
}

export default useArcanaStorage;
