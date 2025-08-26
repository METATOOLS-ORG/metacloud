import { PUBLIC_S3_BUCKET_URL_PREFIX } from "$env/static/public";

export function getAssetUrl(assetId: string) {
    // @todo: get the url from env somehow? idk how lol?????
    // @todo: this is an important one to fix
    return `${PUBLIC_S3_BUCKET_URL_PREFIX}${assetId}`
}

export function getAvatarAssetUrl(assetId?: string | null) {
    if (!assetId || assetId == null) return "/assets/default/avatar.png";
    return getAssetUrl(assetId);
}

export function getCoverAssetUrl(assetId?: string | null) {
    if (!assetId || assetId == null) return "/assets/default/cover.svg";
    return getAssetUrl(assetId);
}
