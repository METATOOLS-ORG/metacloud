export interface UserSelfDTO {
	id: string,
	username: string,
	displayName: string,
	avatarAssetId?: string | null,
    likes: String[]
}

export interface UserProfileDTO {
    id: string,
    username: string,
    displayName: string,
    avatarAssetId?: string | null,
    date: Date,
    bio: string | null,
    songs: SongMiniDTO[]
}

// @todo: do we need the ? if we do | null
export interface SongMiniDTO {
    id: string,
    date: Date,
    title: string,
    url: string,
    genre: string,
    audioAssetId: string,
    coverAssetId?: string | null,
    waveformJSON?: string | null,
    // @todo: should duration be optional?
    duration?: number | null,
    author: {
        id: string,
        displayName: string,
        username: string,
        avatarAssetId?: string | null,
    },
    likes: String[]
}

export interface AssetUploadRespDTO {
    id: string,
    url: string
}
