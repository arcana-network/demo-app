import bytes from "bytes";
import { Arcana as StorageProvider } from "@arcana/storage/dist/standalone/storage.umd";
import { ref, onBeforeMount, inject } from "vue";
import { useStore } from "vuex";

import padPublicKey from "../utils/padPublicKey";
import { authInstance } from "./arcanaAuth";

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID;
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

const NO_SPACE = "No space left for user";
const UNAUTHORIZED = "UNAUTHORIZED";

const successToast = {
  styles: {
    backgroundColor: "green",
  },
  type: "success",
};
const errorToast = {
  styles: {
    backgroundColor: "red",
  },
  type: "error",
};

const FILE_SIZE_LIMIT = bytes("100MB");

function useArcanaStorage() {
  const store = useStore();
  const toast = inject("$toast");
  const storageInstanceRef = ref(null);

  let storageInstance;

  onBeforeMount(() => {
    if (!storageInstanceRef.value) {
      storageInstanceRef.value = new StorageProvider({
        appId: ARCANA_APP_ID,
        privateKey: store.getters.privateKey,
        email: store.getters.email,
        gateway: GATEWAY_URL,
      });

      console.log("Initialised storage with:", {
        appId: ARCANA_APP_ID,
        gateway: GATEWAY_URL,
      });
    }
    storageInstance = storageInstanceRef.value;
  });

  async function fetchStorageLimits() {
    const access = await storageInstance.getAccess();
    const [storageUsed, totalStorage] = await access.getUploadLimit();
    const [bandwidthUsed, totalBandwidth] = await access.getDownloadLimit();

    store.dispatch("updateStorage", {
      totalStorage,
      storageUsed,
    });
    store.dispatch("updateBandwidth", {
      totalBandwidth,
      bandwidthUsed,
    });
  }

  async function fetchMyFiles() {
    store.dispatch("showLoader", "Fetching uploaded files...");
    const myFiles = await storageInstance.myFiles();
    store.dispatch("updateMyFiles", myFiles);
    store.dispatch("hideLoader");
  }

  async function fetchSharedFiles() {
    store.dispatch("showLoader", "Fetching shared files...");
    const sharedFiles = await storageInstance.sharedFiles();
    store.dispatch("updateSharedWithMe", sharedFiles);
    store.dispatch("hideLoader");
  }

  async function upload(fileToUpload) {
    if (fileToUpload.size > FILE_SIZE_LIMIT) {
      toast(
        "You are not allowed to upload files bigger than 100MiB.",
        errorToast
      );
      throw new Error("File size exceeded maximum");
    }
    const uploadStart = Date.now();
    try {
      store.dispatch("showLoader", "Encrypting file...");
      const uploader = await storageInstance.getUploader();

      store.dispatch("showLoader", "Uploading file to distributed storage...");
      let uploadDate = new Date(),
        totalSize,
        did;

      uploader
        .upload(fileToUpload)
        .then((fileDid) => {
          did = fileDid;
        })
        .catch((error) => {
          console.error(error);
          if (error.message === NO_SPACE) {
            toast(
              "Upload failed. Storage limit exceeded. Upgrade your account to continue",
              errorToast
            );
            store.dispatch("hideLoader");
          } else if (error.code === UNAUTHORIZED) {
            toast("Upload failed. Kindly login and try again", errorToast);
            store.dispatch("hideLoader");
          } else {
            toast("Something went wrong. Try again", errorToast);
            store.dispatch("hideLoader");
          }
        });
      uploader.onProgress = (uploaded, total) => {
        store.dispatch(
          "showLoader",
          `Uploaded ${bytes(uploaded)} out of ${bytes(total)}`
        );
        totalSize = total;
      };
      uploader.onSuccess = () => {
        fetchStorageLimits();
        toast("Upload Success", successToast);
        toast(
          "Transaction successfully updated in arcana network's blockchain",
          successToast
        );
        let myFiles = [...store.getters.myFiles];
        myFiles.push({
          did,
          createdAt: uploadDate,
          size: totalSize,
        });
        store.dispatch("updateMyFiles", myFiles);
        store.dispatch("hideLoader");
        const uploadEnd = Date.now();
        console.log("UPLOAD COMPLETED", `${(uploadEnd - uploadStart) / 1000}s`);
      };
      uploader.onError = (err) => {
        console.error("Error caught", err);
        toast("Something went wrong. Try again", errorToast);
        store.dispatch("hideLoader");
      };
    } catch (e) {
      console.error(e);
      toast("Something went wrong. Try again", errorToast);
      store.dispatch("hideLoader");
    }
  }

  async function download(file) {
    const downloadStart = Date.now();
    store.dispatch(
      "showLoader",
      "Downloading chunks from distributed storage..."
    );
    const downloder = await storageInstance.getDownloader();
    let did = file.fileId;
    did = did.substring(0, 2) !== "0x" ? "0x" + did : did;
    downloder.download(did).catch((error) => {
      console.error(error);
      if (error.message === NO_SPACE) {
        toast(
          "Download failed. Bandwidth limit exceeded. Upgrade your account to continue",
          errorToast
        );
        store.dispatch("hideLoader");
      } else if (error.code === UNAUTHORIZED) {
        toast(
          "Seems like you don't have access to download this file",
          errorToast
        );
        store.dispatch("hideLoader");
      } else {
        toast("Something went wrong. Try again", errorToast);
        store.dispatch("hideLoader");
      }
    });
    downloder.onSuccess = () => {
      fetchStorageLimits();
      toast("All chunks downloaded", successToast);
      toast(
        "Transaction successfully updated in arcana network's blockchain",
        successToast
      );
      store.dispatch("hideLoader");
      const downloadEnd = Date.now();
      console.log(
        "DOWNLOAD COMPLETED",
        `${(downloadEnd - downloadStart) / 1000}s`
      );
    };
    downloder.onProgress = (a, b) => {
      store.dispatch("showLoader", `Completed ${bytes(a)} out of ${bytes(b)}`);
    };
  }

  async function share(fileToShare, email) {
    const shareStart = Date.now();
    store.dispatch("showLoader", "Sharing file...");
    try {
      store.dispatch(
        "showLoader",
        "Encrypting file data with recipient's public key......"
      );
      const publicKey = await authInstance.getPublicKey({
        verifier: "google",
        id: email,
      });
      const actualPublicKey = padPublicKey(publicKey);
      const access = await storageInstance.getAccess();
      let did = fileToShare.fileId;
      did = did.substring(0, 2) != "0x" ? "0x" + did : did;
      store.dispatch("showLoader", `Sharing file with ${email}`);
      await access.share([did], [actualPublicKey], [1000000]);
      toast(`Shared file successfully with ${email}`, successToast);
      store.dispatch("hideLoader");
      const shareEnd = Date.now();
      console.log("SHARE COMPLETED", `${(shareEnd - shareStart) / 1000}s`);
    } catch (e) {
      console.error(e);
      toast("Something went wrong. Try again", errorToast);
      store.dispatch("hideLoader");
    }
    return;
  }

  async function getSharedUsers(did) {
    try {
      const access = await storageInstance.getAccess();
      const fileId = did.substring(0, 2) !== "0x" ? "0x" + did : did;
      const users = await access.getSharedUsers(fileId);
      return users;
    } catch (e) {
      console.error(e);
      toast(
        "Something went wrong while fetching shared users list",
        errorToast
      );
    }
  }

  async function revoke(fileToRevoke, address) {
    const did = fileToRevoke.fileId;
    const revokeStart = Date.now();
    store.dispatch("showLoader", "Revoking file access...");
    try {
      const access = await storageInstance.getAccess();
      const fileId = did.substring(0, 2) !== "0x" ? "0x" + did : did;
      await access.revoke(fileId, address);
      toast(`File Access Revoked`, successToast);
      store.dispatch("hideLoader");
      const revokeEnd = Date.now();
      console.log("REVOKE COMPLETED", `${(revokeEnd - revokeStart) / 1000}s`);
    } catch (e) {
      console.error(e);
      toast("Something went wrong. Try again", errorToast);
      store.dispatch("hideLoader");
    }
  }

  async function remove(fileToDelete) {
    const deleteStart = Date.now();
    store.dispatch("showLoader", "Deleting file...");
    const access = await storageInstance.getAccess();
    try {
      let did = fileToDelete.fileId;
      did = did.substring(0, 2) != "0x" ? "0x" + did : did;
      await access.deleteFile(did);
      fetchStorageLimits();
      let myFiles = [...store.getters.myFiles];
      myFiles = myFiles.filter((file) => file.fileId !== fileToDelete.fileId);
      store.dispatch("updateMyFiles", myFiles);
      toast(`File Deleted`, successToast);
      store.dispatch("hideLoader");
      const deleteEnd = Date.now();
      console.log("DELETE COMPLETED", `${(deleteEnd - deleteStart) / 1000}s`);
    } catch (e) {
      console.error(e);
      toast("Something went wrong. Try again", errorToast);
      store.dispatch("hideLoader");
    }
  }

  return {
    download,
    fetchMyFiles,
    fetchSharedFiles,
    fetchStorageLimits,
    getSharedUsers,
    remove,
    revoke,
    share,
    upload,
  };
}

export default useArcanaStorage;
