import bytes from "bytes";
import { useStore } from "vuex";

import StorageService from "../services/storage.service";
import padPublicKey from "../utils/padPublicKey";
import useToast from "../use/toast";

const NO_SPACE = "No space left for user";
const UNAUTHORIZED = "UNAUTHORIZED";

const FILE_SIZE_LIMIT = bytes("100MB");

function useArcanaStorage() {
  const store = useStore();
  const { toastSuccess, toastError } = useToast();

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
    }
  }

  async function fetchMyFiles() {
    try {
      const myFiles = await StorageService.myFiles();
      store.dispatch("updateMyFiles", myFiles);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchSharedFiles() {
    try {
      const sharedFiles = await StorageService.sharedFiles();
      store.dispatch("updateSharedWithMe", sharedFiles);
    } catch (error) {
      console.log(error);
    }
  }

  async function upload(fileToUpload) {
    if (fileToUpload.size > FILE_SIZE_LIMIT) {
      toastError("You are not allowed to upload files bigger than 100MiB.");
      throw new Error("File size exceeded maximum");
    }

    console.time("Upload");

    try {
      let uploadDate = new Date(),
        totalSize;

      store.dispatch("showInlineLoader", "Uploading file");

      const did = await StorageService.upload(fileToUpload, {
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
    }
  }

  // async function download(file) {
  //   const downloadStart = Date.now();
  //   store.dispatch(
  //     "showLoader",
  //     "Downloading chunks from distributed storage..."
  //   );
  //   const downloder = await storageInstance.getDownloader();
  //   let did = file.fileId;
  //   did = did.substring(0, 2) !== "0x" ? "0x" + did : did;
  //   downloder.download(did).catch((error) => {
  //     console.error(error);
  //     if (error.message === NO_SPACE) {
  //       toast(
  //         "Download failed. Bandwidth limit exceeded. Upgrade your account to continue",
  //         errorToast
  //       );
  //       store.dispatch("hideLoader");
  //     } else if (error.code === UNAUTHORIZED) {
  //       toast(
  //         "Seems like you don't have access to download this file",
  //         errorToast
  //       );
  //       store.dispatch("hideLoader");
  //     } else {
  //       toast("Something went wrong. Try again", errorToast);
  //       store.dispatch("hideLoader");
  //     }
  //   });
  //   downloder.onSuccess = () => {
  //     fetchStorageLimits();
  //     toast("All chunks downloaded", successToast);
  //     toast(
  //       "Transaction successfully updated in arcana network's blockchain",
  //       successToast
  //     );
  //     store.dispatch("hideLoader");
  //     const downloadEnd = Date.now();
  //     console.log(
  //       "DOWNLOAD COMPLETED",
  //       `${(downloadEnd - downloadStart) / 1000}s`
  //     );
  //   };
  //   downloder.onProgress = (a, b) => {
  //     store.dispatch("showLoader", `Completed ${bytes(a)} out of ${bytes(b)}`);
  //   };
  // }

  // async function share(fileToShare, email) {
  //   const shareStart = Date.now();
  //   store.dispatch("showLoader", "Sharing file...");
  //   try {
  //     store.dispatch(
  //       "showLoader",
  //       "Encrypting file data with recipient's public key......"
  //     );
  //     const publicKey = '000' // await getPublicKey(email);
  //     const actualPublicKey = padPublicKey(publicKey);
  //     const access = await storageInstance.getAccess();
  //     let did = fileToShare.fileId;
  //     did = did.substring(0, 2) != "0x" ? "0x" + did : did;
  //     store.dispatch("showLoader", `Sharing file with ${email}`);
  //     await access.share([did], [actualPublicKey], [1000000]);
  //     toast(`Shared file successfully with ${email}`, successToast);
  //     store.dispatch("hideLoader");
  //     const shareEnd = Date.now();
  //     console.log("SHARE COMPLETED", `${(shareEnd - shareStart) / 1000}s`);
  //   } catch (e) {
  //     console.error(e);
  //     toast("Something went wrong. Try again", errorToast);
  //     store.dispatch("hideLoader");
  //   }
  //   return;
  // }

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

  // async function remove(fileToDelete) {
  //   const deleteStart = Date.now();
  //   store.dispatch("showLoader", "Deleting file...");
  //   const access = await storageInstance.getAccess();
  //   try {
  //     let did = fileToDelete.fileId;
  //     did = did.substring(0, 2) != "0x" ? "0x" + did : did;
  //     await access.deleteFile(did);
  //     fetchStorageLimits();
  //     let myFiles = [...store.getters.myFiles];
  //     myFiles = myFiles.filter((file) => file.fileId !== fileToDelete.fileId);
  //     store.dispatch("updateMyFiles", myFiles);
  //     toast(`File Deleted`, successToast);
  //     store.dispatch("hideLoader");
  //     const deleteEnd = Date.now();
  //     console.log("DELETE COMPLETED", `${(deleteEnd - deleteStart) / 1000}s`);
  //   } catch (e) {
  //     console.error(e);
  //     toast("Something went wrong. Try again", errorToast);
  //     store.dispatch("hideLoader");
  //   }
  // }

  return {
    initStorage,
    // download,
    fetchMyFiles,
    fetchSharedFiles,
    fetchStorageLimits,
    // getSharedUsers,
    // remove,
    // revoke,
    // share,
    upload,
  };
}

export default useArcanaStorage;
