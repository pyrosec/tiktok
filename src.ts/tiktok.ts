import axios from "haxios";
import TikTokManifest from "./manifest.json";
import { v1 } from "uuid";
import base64url from "base64url";
import fingerprints from "./fingerprints.json";
import { gzip } from "node-gzip";

export const FID_4BIT_PREFIX = parseInt('70', 16);
export const FID_REMOVE_PREFIX_MASK = parseInt('0f', 16);
export const FID_LENGTH = 22;

export const randomFid = () => {
  const bytes = Buffer.from(v1().replace(/\-/g, ''), 'hex');
  bytes[0] &= FID_REMOVE_PREFIX_MASK;
  bytes[0] |= FID_4BIT_PREFIX;
  return base64url(bytes).substr(0, FID_LENGTH);
};

export const DEVICE_LIST = fingerprints.map((v) => ({
  model: v.name.split('(')[0].trim(),
  build: v.fingerprints[0].split(':')[1].split('/')[1]
})).filter((v) => v.build.match(/\w+\.\d+\.\d+/));

export const randomDevice = () => DEVICE_LIST[Math.floor(DEVICE_LIST.length * Math.random())];

export class TikTok {
  public session: any;
  public device: typeof DEVICE_LIST[0];
  constructor({
    session,
    device
  }) {
    this.session = session || null;
    this.device = device || randomDevice();
  }
  getUserAgent() {
    return 'Dalvik/2.1.0 (Linux; U; Android 11; ' + this.device.model + ' Build/' + this.device.build + ')';
  }
  async initSession() {
    const zipped = Buffer.from(await gzip(JSON.stringify({
      appId: TikTokManifest.googleAppId,
      authVersion: "FIS_v2",
      fid: this.session && this.session.fid || randomFid(),
      sdkVersion: "a:17.0.1"
    })));
    const response = await axios.post('https://firebaseinstallations.googleapis.com/v1/projects/' + TikTokManifest.projectId + '/installations', zipped, {
      headers: {
        'Content-Type': 'application/json',
	Accept: 'application/json',
	'Content-Encoding': 'gzip',
	'Cache-Control': 'no-cache',
	'X-Android-Package': TikTokManifest.packageName,
        'X-Android-Cert': TikTokManifest.androidCert,
	'x-goog-api-key': TikTokManifest.googleApiKey,
	'x-firebase-client': TikTokManifest.firebaseClient,
	'User-Agent': this.getUserAgent(),
	'Host': 'firebaseinstallations.googleapis.com',
        Connection: 'Keep-Alive',
	'Accept-Encoding': 'gzip',
	'Content-Length': String(zipped.length)
      },
      responseType: 'json',
      compress: true
    });
    this.session = response.data;
    return response;
  }
  toObject() {
    return {
      device: this.device,
      session: this.session
    };
  }
  serialize() {
    return JSON.stringify(this.toObject(), null, 2);
  }
}
