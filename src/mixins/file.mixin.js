import { useStore } from "vuex";
import { getArcanaAuth, getArcanaStorage } from "../utils/arcana-sdk";
import bytes from "bytes";

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

const NO_SPACE = "No space left for user";
const UNAUTHORIZED = "UNAUTHORIZED";

export function useFileMixin(toast) {
  const store = useStore();

  async function getLimits() {
    const arcanaStorage = getArcanaStorage();
    const access = await arcanaStorage.getAccess();
    const [consumedStorage, totalStorage] = await access.getUploadLimit();
    const [consumedBandwidth, totalBandwidth] = await access.getDownloadLimit();
    console.log({
      consumedBandwidth,
      totalBandwidth,
      consumedStorage,
      totalStorage,
    });
  }

  async function download(file) {
    store.dispatch(
      "showLoader",
      "Downloading chunks from distributed storage..."
    );
    const arcanaStorage = getArcanaStorage();
    const downloder = await arcanaStorage.getDownloader();
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
      toast("All chunks downloaded", successToast);
      toast(
        "Transaction successfully updated in arcana network's blockchain",
        successToast
      );
      store.dispatch("hideLoader");
    };
    downloder.onProgress = (a, b) => {
      store.dispatch("showLoader", `Completed ${bytes(a)} out of ${bytes(b)}`);
    };
  }

  async function share(fileToShare, email) {
    store.dispatch("showLoader", "Sharing file...");
    try {
      const arcanaAuth = getArcanaAuth();
      const publicKey = await arcanaAuth.getPublicKey({
        verifier: "google",
        id: email,
      });
      store.dispatch(
        "showLoader",
        "Encrypting file data with recipient's public key......"
      );
      const actualPublicKey =
        "0x04" + publicKey.X.padStart(64, "0") + publicKey.Y.padStart(64, "0");
      console.log(actualPublicKey, email, fileToShare);
      const arcanaStorage = getArcanaStorage();
      const access = await arcanaStorage.getAccess();
      let did = fileToShare.fileId;
      did = did.substring(0, 2) != "0x" ? "0x" + did : did;
      store.dispatch("showLoader", `Sharing file with ${email}`);
      await access.share([did], [actualPublicKey], [1000000]);
      toast(`Shared file successfully with ${email}`, successToast);
      store.dispatch("hideLoader");
    } catch (e) {
      console.error(e);
      toast("Something went wrong. Try again", errorToast);
      store.dispatch("hideLoader");
    }
  }

  async function remove(fileToDelete) {
    store.dispatch("showLoader", "Deleting file...");
    const arcanaStorage = getArcanaStorage();
    const access = await arcanaStorage.getAccess();
    try {
      let did = fileToDelete.fileId;
      did = did.substring(0, 2) != "0x" ? "0x" + did : did;
      await access.deleteFile(did);
      let myFiles = [...store.getters.myFiles];
      myFiles = myFiles.filter((file) => file.fileId !== fileToDelete.fileId);
      store.dispatch("updateMyFiles", myFiles);
      toast(`File Deleted`, successToast);
      store.dispatch("hideLoader");
    } catch (e) {
      console.error(e);
      toast("Something went wrong. Try again", errorToast);
      store.dispatch("hideLoader");
    }
  }

  async function upload(fileToUpload) {
    try {
      store.dispatch("showLoader", "Encrypting file...");
      const arcanaStorage = getArcanaStorage();
      const uploader = await arcanaStorage.getUploader();
      store.dispatch("showLoader", "Uploading file to distributed storage...");
      let uploadDate, totalSize, did;

      uploadDate = new Date();

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
        toast("Upload Success", successToast);
        toast(
          "Transaction successfully updated in arcana network's blockchain",
          successToast
        );
        console.log("Upload Success");
        let myFiles = [...store.getters.myFiles];
        myFiles.push({
          fileId: did,
          did,
          createdAt: uploadDate,
          size: totalSize,
        });
        store.dispatch("updateMyFiles", myFiles);
        store.dispatch("hideLoader");
      };
      uploader.onError = (err) => {
        console.log("Error caught", err);
      };
    } catch (e) {
      console.error(e);
      toast("Something went wrong. Try again", errorToast);
      store.dispatch("hideLoader");
    }
  }

  return {
    download,
    remove,
    upload,
    share,
    getLimits,
  };
}
