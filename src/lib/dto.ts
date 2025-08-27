import type { Prisma } from "@prisma/client"

function simplifyLikesForDTO(likes: SongLikePayload[]) : String[] {
    return likes.map((like: SongLikePayload) => like.postId)
}

// -----------------------

export interface UserSelfDTO {
	id: string,
	username: string,
	displayName: string,
	avatarAssetId?: string | null,
    likes: String[]
}

export const UserSelfIncludes: any = {
    likes: true,
    songs: true
}

type SongLikePayload = Prisma.SongLikeGetPayload<{}>;
type UserSelfPayload = Prisma.UserGetPayload<{ include: typeof UserSelfIncludes }>

export function CreateUserSelfDTO(user: UserSelfPayload): UserSelfDTO {
    console.log(user.likes);
    return {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarAssetId: user.avatarAssetId,
        likes: simplifyLikesForDTO(user.likes as SongLikePayload[])
    };
}

// -----------------------

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
    tagWip: boolean,
    tagFeedback: boolean,
    duration?: number | null,
    author: {
        id: string,
        displayName: string,
        username: string,
        avatarAssetId?: string | null,
    },
    likes: String[]
}

export const SongIncludes: Prisma.SongInclude = {
    author: {
        select: {
            id: true,
            displayName: true,
            username: true,
            avatarAssetId: true
        }
    },
    audioAsset: {
        select: {
            waveformJSON: true,
            duration: true
        }
    },
    likes: {
        select: {
            userId: true
        }
    }
}

type SongPayload = Prisma.SongGetPayload<{ include: typeof SongIncludes }>

export function CreateSongMiniDTO(song: SongPayload): SongMiniDTO {
    return {
        id: song.id,
        date: song.date,
        title: song.title,
        url: song.url,
        genre: song.genre,
        audioAssetId: song.audioAssetId,
        coverAssetId: song.coverAssetId,
        waveformJSON: song.audioAsset.waveformJSON,
        duration: song.audioAsset.duration,
        tagWip: song.tagWip,
        tagFeedback: song.tagFeedback,
        author: {
            id: song.author.id,
            displayName: song.author.displayName,
            username: song.author.username,
            avatarAssetId: song.author.avatarAssetId,
        },
        likes: simplifyLikesForDTO(song.likes)
    }
}

// -----------------------

export interface UserProfileDTO {
    id: string,
    username: string,
    displayName: string,
    avatarAssetId?: string | null,
    date: Date,
    bio: string | null,
    songs: SongMiniDTO[]
}

export const UserProfileIncludes: Prisma.UserInclude = {
    songs: {
        orderBy: {
            id: "desc"
        },
        include: SongIncludes
    }
}

export function CreateUserProfileDTO(user: Prisma.UserGetPayload<{include: typeof UserProfileIncludes}>): UserProfileDTO {
    return {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarAssetId: user.avatarAssetId,
        date: user.date,
        bio: user.bio,
        songs: user.songs.map((song) => CreateSongMiniDTO(song as SongPayload))
    };
}

// -----------------------

export interface AssetUploadRespDTO {
    id: string,
    url: string
}
