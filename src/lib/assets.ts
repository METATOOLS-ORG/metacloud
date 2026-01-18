import { PUBLIC_S3_BUCKET_URL_PREFIX } from "$env/static/public";
import { PUBLIC_STORAGE_MODE } from '$env/static/public';

export function getAssetUrl(assetId: string) {
	return PUBLIC_STORAGE_MODE == 'S3'
		? `${PUBLIC_S3_BUCKET_URL_PREFIX}${assetId}`
		: `/ugc_uploads/${assetId}`;
}

export function getAvatarAssetUrl(assetId?: string | null) {
    if (!assetId || assetId == null) return "/assets/default/avatar.png";
    return getAssetUrl(assetId);
}

export function getCoverAssetUrl(assetId?: string | null) {
    if (!assetId || assetId == null) return "/assets/default/cover.svg";
    return getAssetUrl(assetId);
}
