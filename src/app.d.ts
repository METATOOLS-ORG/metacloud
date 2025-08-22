// See https://svelte.dev/docs/kit/types#app.d.ts for more info about these interfaces

import type { UserProfileDTO } from "$lib/dto";
declare global {
    namespace App {
        interface Error {
            code: string,
            // @todo: implement https://github.com/colinhacks/zod/discussions/1735#discussioncomment-4468433
            validationErrors?: any
        }
        interface Locals {
            userId: string | null
        }
        interface PageData {
            user?: UserSelfDTO,
            profile?: UserProfileDTO
        }
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
