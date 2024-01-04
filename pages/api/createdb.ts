import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        let result = {};

        //#region SysUser
        result = await sql`
                CREATE TABLE IF NOT EXISTS SysUser (
                    UserName varchar(20) PRIMARY KEY,
                    FullName varchar(25),
                    Password varchar(100),
                    Actived BOOLEAN NOT NULL DEFAULT (true)
                );`

        result = await sql`INSERT INTO SysUser(UserName,FullName,Password,Actived)
                SELECT 'MTLUC','Mai Tiến Lực','b5ffe3f21838d7b4aef3fedbdd8245c3', true
                WHERE
                NOT EXISTS (
                SELECT 1 FROM SysUser WHERE UserName = 'MTLUC'
                );
            `;
        //#endregion

        //#region SysUser
        result = await sql`
                CREATE TABLE IF NOT EXISTS GuestBook (
                    Id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                    Relationship varchar(25),
                    ShortName varchar(128),
                    FullName varchar(128),
                    Phone varchar(10),
                    Description varchar (256),
                    Sent BOOLEAN DEFAULT (false) NOT NULL,
                    GuestDate timestamp,
                    Agree BOOLEAN DEFAULT (false) NOT NULL,
                    BusId NUMERIC,
                    IsConfirmBus BOOLEAN DEFAULT (false) NOT NULL,
                    IsConfirm BOOLEAN DEFAULT (false) NOT NULL,
                    UserName varchar(20) NOT NULL
                );`
        //#endregion

        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }

}