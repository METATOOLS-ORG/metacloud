import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkAuth, getAuthedUser } from '$lib/server/auth';
import { getUserById, prisma } from '$lib/server/database';
import { CreateUserSelfDTO, type UserSelfDTO, UserSelfDTO_Includes, type UserSelfDTO_Payload } from '$lib/dto';

const RANDOMIZER_WORD_LIST = ["ascend", "crystal", "grip", "real", "meta", "strict", "ice", "rain", "half", "object", "angel", "snow", "oxide", "form", "evolve", "moon", "star", "sky", "night"]

function rndArray(list: string[]) {
  return list[Math.floor((Math.random()*list.length))];
}

function rndInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


export const GET: RequestHandler = async (req) => {
    // Making this authed only just in case to reduce spam (you would never encounter this endpoint without being logged in anyway)
    let uid = checkAuth(req);

    let title = "";
    let amount = rndInt(0, 6) == 1 ? 3 : 2;
    for (let i = 0; i < amount; i++) {
        if (i != 0) title += " ";
        title += rndArray(RANDOMIZER_WORD_LIST);
    }
    return json({title: title});
};
