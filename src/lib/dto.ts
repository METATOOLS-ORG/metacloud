import type { Prisma } from "@prisma/client"

// -----------------------
// LikesDTO
// -----------------------
export type LikesDTO = String[];
type LikesDTO_Payload = Prisma.SongLikeGetPayload<{}>;
function CreateLikesDTO(likes: LikesDTO_Payload[]) : String[] {
    return likes.map((like: LikesDTO_Payload) => like.postId)
}

// -----------------------
// SongDTO
// -----------------------
// @todo: do we need the ? if we do | null
export interface SongDTO {
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

export const SongDTO_Includes: Prisma.SongInclude = {
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

type SongDTO_Payload = Prisma.SongGetPayload<{ include: typeof SongDTO_Includes }>

export function CreateSongDTO(song: SongDTO_Payload): SongDTO {
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
        likes: CreateLikesDTO(song.likes)
    }
}

// -----------------------
// UserSelfDTO
// -----------------------
export interface UserSelfDTO {
    id: string,
    username: string,
    displayName: string,
    avatarAssetId?: string | null,
    likes: String[],
    songs: SongDTO[]
}

export const UserSelfDTO_Includes: any = {
    likes: true,
    songs: {
        orderBy: { date: "desc" },
        include: SongDTO_Includes
    }
}

export type UserSelfDTO_Payload = Prisma.UserGetPayload<{ include: typeof UserSelfDTO_Includes }>

export function CreateUserSelfDTO(user: UserSelfDTO_Payload): UserSelfDTO {
    console.log(user.likes);
    return {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarAssetId: user.avatarAssetId,
        likes: CreateLikesDTO(user.likes as LikesDTO_Payload[]),
        songs: user.songs.map((song) => CreateSongDTO(song as SongDTO_Payload))
    };
}

// -----------------------
// UserProfileDTO
// -----------------------
export interface UserProfileDTO {
    id: string,
    username: string,
    displayName: string,
    avatarAssetId?: string | null,
    date: Date,
    bio: string | null,
    songs: SongDTO[]
}

export const UserProfileDTO_Includes: Prisma.UserInclude = {
    songs: {
        orderBy: {
            id: "desc"
        },
        include: SongDTO_Includes
    }
}

type UserProfileDTO_Payload = Prisma.UserGetPayload<{include: typeof UserProfileDTO_Includes}>;

export function CreateUserProfileDTO(user: UserProfileDTO_Payload): UserProfileDTO {
    return {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarAssetId: user.avatarAssetId,
        date: user.date,
        bio: user.bio,
        songs: user.songs.map((song) => CreateSongDTO(song as SongDTO_Payload))
    };
}

// -----------------------
// AssetUploadRespDTO
// -----------------------
export interface AssetUploadRespDTO {
    id: string,
    url: string
}
