/// <reference types="node" />
export declare const FID_4BIT_PREFIX: number;
export declare const FID_REMOVE_PREFIX_MASK: number;
export declare const FID_LENGTH = 22;
export declare const randomFid: () => string;
export declare const DEVICE_LIST: {
    model: string;
    build: string;
}[];
export declare const randomDevice: () => {
    model: string;
    build: string;
};
export declare class TikTok {
    session: any;
    device: typeof DEVICE_LIST[0];
    constructor({ session, device }: {
        session: any;
        device: any;
    });
    getUserAgent(): string;
    initSession(): Promise<import("haxios").AxiosResponse<any, Buffer, {
        headers: {
            'Content-Type': string;
            Accept: string;
            'Content-Encoding': string;
            'Cache-Control': string;
            'X-Android-Package': string;
            'X-Android-Cert': string;
            'x-goog-api-key': string;
            'x-firebase-client': string;
            'User-Agent': string;
            Host: string;
            Connection: string;
            'Accept-Encoding': string;
            'Content-Length': string;
        };
        responseType: "json";
        compress: boolean;
    }>>;
    toObject(): {
        device: {
            model: string;
            build: string;
        };
        session: any;
    };
    serialize(): string;
}
