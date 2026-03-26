import {
  initializeApp,
  cert,
  getApps,
  getApp,
  type App,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getAdminApp(): App {
  if (getApps().length > 0) return getApp();

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT env var is not set. Set it to the JSON string of your Firebase service account key."
    );
  }

  return initializeApp({
    credential: cert(JSON.parse(serviceAccount)),
  });
}

let _app: App | null = null;

function app(): App {
  if (!_app) _app = getAdminApp();
  return _app;
}

export function getAdminDb() {
  return getFirestore(app());
}

export function getAdminAuth() {
  return getAuth(app());
}
