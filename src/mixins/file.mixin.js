import { useStore } from "vuex";
import { downloadFile, uploadFile } from "../services/file.service";
import { saveAs } from "file-saver";
import { addTx } from "../services/tx.service";
import { generateId } from "../utils/hash";
import { findUser, saveUser } from "../services/user.service";
import bytes from "bytes";

const successToast = {
  styles: {
    backgroundColor: "green",
  },
  type: "success",
};

export function useFileMixin(toast) {
  const store = useStore();

  function download(file) {
    store.dispatch(
      "showLoader",
      "Downloading chunks from distributed storage..."
    );
    setTimeout(() => {
      store.dispatch("showLoader", "Decrypting data and recreating file...");
      downloadFile(file.did).then((fileBlob) => {
        if (toast) {
          toast("All chunks downloaded", successToast);
          store.dispatch("showLoader", "Updating transaction on blockchain...");
          saveAs(fileBlob, file.name);
          const transaction = {
            type: "download",
            hash: generateId(),
            did: file.did,
            timestamp: Date.now(),
            transactionFee: 0.0001,
            status: "File Downloaded",
          };
          addTx(transaction);
          toast(
            "Transaction successfully updated in arcana network's blockchain",
            successToast
          );
          store.dispatch("hideLoader");
        }
      });
    }, 2000);
  }

  function share(fileToShare, email) {
    store.dispatch("showLoader", "Sharing file...");
    const { getPublicKey } = window.arcana_dkg.default;
    getPublicKey("google", email).then((publicKey) => {
      store.dispatch(
        "showLoader",
        "Encrypting file data with recipient's public key......"
      );
      const actualPublicKey =
        publicKey.X.padStart(64, "0") + publicKey.Y.padStart(64, "0");
      const file = Object.assign({}, fileToShare);
      file.ref = generateId();
      let user;
      findUser(actualPublicKey).then((snapshot) => {
        if (snapshot.exists) {
          user = snapshot.data();
          user.sharedWithMe.push(file);
        } else {
          user = {
            address: actualPublicKey,
            totalStorage: bytes("25GB"),
            storageUsed: 0,
            myFiles: [],
            sharedWithMe: [file],
            trash: [],
          };
        }
        saveUser(user).then(() => {
          toast("File shared with the recipient", successToast);
          store.dispatch(
            "showLoader",
            "Updating transaction on blockchain......"
          );
          const tx = {
            type: "share",
            hash: file.ref,
            did: file.did,
            fileMeta: {
              size: file.size,
            },
            timestamp: Date.now(),
            transactionFee: 0.0001,
            status: "File Shared",
          };
          addTx(tx);
          toast(
            "Transaction successfully updated in arcana network's blockchain",
            successToast
          );
          store.dispatch("hideLoader");
        });
      });
    });
  }

  function remove() {}

  function upload(fileToUpload) {
    store.dispatch("showLoader", "Encrypting file...");
    const publicKey = store.getters.publicKey;
    findUser(publicKey).then((snapshot) => {
      setTimeout(() => {
        store.dispatch(
          "showLoader",
          "Uploading file to distributed storage..."
        );
        const did = "did:" + generateId();
        const user = snapshot.data();
        const uploadTask = uploadFile(fileToUpload, did);
        uploadTask.on(
          "state_changed",
          () => {
            //State change handler
          },
          () => {
            //Error handler
          },
          () => {
            //Success handler
            toast("Upload Success", successToast);
            store.dispatch(
              "showLoader",
              "Updating transaction on blockchain......"
            );
            user.storageUsed += fileToUpload.size;
            store.dispatch("updateStorage", user);
            store.dispatch("updateFiles", user);
            const hash = generateId();
            user.myFiles.push({
              type: "file",
              fileId: did,
              name: fileToUpload.name,
              size: fileToUpload.size,
              fileType: fileToUpload.type,
              createdAt: Date.now(),
              did: did,
              ref: hash,
            });
            saveUser(user);
            const tx = {
              type: "upload",
              hash,
              did,
              fileMeta: {
                size: fileToUpload.size,
              },
              timestamp: Date.now(),
              transactionFee: 0.0035,
              status: "File Uploaded",
            };
            addTx(tx);
            toast(
              "Transaction successfully updated in arcana network's blockchain",
              successToast
            );
            store.dispatch("hideLoader");
          }
        );
      }, 1000);
    });
  }

  return {
    download,
    remove,
    upload,
    share,
  };
}
