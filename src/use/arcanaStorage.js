import bytes from "bytes";
import { ethers } from "ethers";
import { useStore } from "vuex";

import padPublicKey from "../utils/padPublicKey";
import StorageService from "../services/storage.service";
import useArcanaWallet from "../use/arcanaWallet";
import useToast from "../use/toast";

const NO_SPACE = "No space left for user";
const UNAUTHORIZED = "UNAUTHORIZED";

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
      toastError(error.message || "Something went wrong.");
    }
  }

  async function fetchMyFiles() {
    try {
      const myFiles = await StorageService.myFiles();
      store.dispatch("updateMyFiles", myFiles);
    } catch (error) {
      console.log(error);
      toastError(error.message || "Something went wrong.");
    }
  }

  async function fetchSharedFiles() {
    try {
      const sharedFiles = await StorageService.sharedFiles();
      store.dispatch("updateSharedWithMe", sharedFiles);
    } catch (error) {
      console.log(error);
      toastError(error.message || "Something went wrong.");
    }
  }

  async function upload(file) {
    if (file.size > FILE_SIZE_LIMIT) {
      toastError("You are not allowed to upload files bigger than 100MiB.");
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
          toastError(error.message || "Something went wrong.");
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
      toastError(error.message || "Something went wrong.");
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
      toastError(error.message || "Something went wrong.");
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
      toastError(error.message || "Something went wrong.");
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
      const address = ethers.utils.computeAddress("0x" + publicKey);
      await StorageService.share(file.fileId, address);
      toastSuccess(`Shared file successfully with ${email}`);
    } catch (error) {
      console.error(error);
      toastError(error.message || "Something went wrong.");
    } finally {
      console.timeEnd("Share");
      store.dispatch("hideInlineLoader");
    }
  }

  // async function getSharedUsers(did) {
  //   try {
  //     const access = await storageInstance.getAccess();
  //     const fileId = did.substring(0, 2) !== "0x" ? "0x" + did : did;
  //     const users = await access.getSharedUsers(fileId);
  //     return users;
  //   } catch (e) {
  //     console.error(e);
  //     toast(
  //       "Something went wrong while fetching shared users list",
  //       errorToast
  //     );
  //   }
  // }

  // async function revoke(fileToRevoke, address) {
  //   const did = fileToRevoke.fileId;
  //   const revokeStart = Date.now();
  //   store.dispatch("showLoader", "Revoking file access...");
  //   try {
  //     const access = await storageInstance.getAccess();
  //     const fileId = did.substring(0, 2) !== "0x" ? "0x" + did : did;
  //     await access.revoke(fileId, address);
  //     toast(`File Access Revoked`, successToast);
  //     store.dispatch("hideLoader");
  //     const revokeEnd = Date.now();
  //     console.log("REVOKE COMPLETED", `${(revokeEnd - revokeStart) / 1000}s`);
  //   } catch (e) {
  //     console.error(e);
  //     toast("Something went wrong. Try again", errorToast);
  //     store.dispatch("hideLoader");
  //   }
  // }

  return {
    initStorage,
    download,
    fetchMyFiles,
    fetchSharedFiles,
    fetchStorageLimits,
    // getSharedUsers,
    remove,
    // revoke,
    share,
    upload,
  };
}

export default useArcanaStorage;
