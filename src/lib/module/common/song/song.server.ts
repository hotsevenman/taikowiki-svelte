import { runQuery } from "@sveltekit-board/db";
//import {escape} from 'mysql';
import { type SongData } from "./types";

export default class SongDB {
    static async getAll(): Promise<(SongData & {order:number})[]> {
        return await runQuery(async (run) => {
            let result = await run("SELECT * FROM `song`");
            result.map((e: any) => {
                e.courses = JSON.parse(e.courses);
                e.bpm = JSON.parse(e.bpm);
                e.version = JSON.parse(e.version);
                e.genre = JSON.parse(e.genre);
                e.artists = JSON.parse(e.artists);
            })
            return JSON.parse(JSON.stringify(result))
        })
    }

    static async addSong(data: SongData){
        return await runQuery(async (run) => {
            return await run(`INSERT INTO \`song\` (
                \`songNo\`, 
                \`title\`,
                \`titleKo\`,
                \`aliasKo\`,
                \`titleEn\`,
                \`aliasEn\`,
                \`bpm\`,
                \`bpmShiver\`,
                \`version\`,
                \`isAsiaBanned\`,
                \`isKrBanned\`,
                \`genre\`,
                \`artists\`,
                \`addedDate\`,
                \`courses\`
            ) VALUES (
                ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
            )`,[
                data.songNo,
                data.title,
                data.titleKo,
                data.aliasKo,
                data.titleEn,
                data.aliasEn,
                JSON.stringify(data.bpm),
                data.bpmShiver,
                JSON.stringify(data.version),
                data.isAsiaBanned,
                data.isKrBanned,
                JSON.stringify(data.genre),
                JSON.stringify(data.artists),
                data.addedDate || 0,
                JSON.stringify(data.courses)
            ])
        })
    }

    /*
    static async search(option: SongSearchOption): Promise<SongData[]> {
        let title = option.title?.replace('%', '\\%').replace('_', '\\_') ?? '%';
        let difficultyQuery = option.difficulty && option.level? `AND JSON_EXTRACT(courses, ${escape(`$.${option.difficulty}.level`)}) = ${escape(option.level)}` : '';

        let result = await runQuery(async (run) => {
            return await run(`SELECT * FROM \`song\`
            WHERE
                (\`title\` LIKE ? OR \`titleKo\` LIKE ? OR \`titleEn\` LIKE ? OR \`aliasKo\` LIKE ? OR \`aliasEn\` LIKE ?)
                ${difficultyQuery}
            `, [title, title, title, title, title])
        })

        result.map((song:any) => {
            song.courses = JSON.parse(song.courses)
        })

        return JSON.parse(JSON.stringify(result))
    }
    */
}

/*
export interface SongSearchOption {
    title?: string;
    difficulty?: Difficulty;
    level?: number;
}
*/
