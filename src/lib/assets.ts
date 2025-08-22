
export function getAssetUrl(assetId: string) {
    // @todo: get the url from env somehow? idk how lol?????
    // @todo: this is an important one to fix
    return `https://pub-9acb5031bcdc486cae445ccd4fe22aa3.r2.dev/${assetId}`
}

export function getAvatarAssetUrl(assetId?: string | null) {
    if (!assetId || assetId == null) return "/assets/default/avatar.png";
    return getAssetUrl(assetId);
}

export function getCoverAssetUrl(assetId?: string | null) {
    if (!assetId || assetId == null) return "/assets/default/cover.png";
    return getAssetUrl(assetId);
}
