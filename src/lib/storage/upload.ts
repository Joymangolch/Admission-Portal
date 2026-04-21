import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/config";

/**
 * Uploads a file to Firebase Storage and returns the download URL
 */
export async function uploadDocument(userId: string, type: string, file: File) {
  const fileExtension = file.name.split(".").pop();
  const fileName = `${type}_${Date.now()}.${fileExtension}`;
  const storageRef = ref(storage, `documents/${userId}/${fileName}`);
  
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return {
    url: downloadURL,
    fileName: file.name
  };
}
