import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/database/mysql";

export async function GET() {
    try{
        const connection = await pool.getConnection();
        const [rows] = await connection.execute("SELECT id, text FROM `todo` ORDER BY id DESC");
        connection.release();
        return NextResponse.json(rows, { status: 200 })
    }catch(error: any){
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try{
        const json = await req.json();
        const text = json.data;
        const sql = 'INSERT INTO `todo` (`text`) VALUES (?)';
        const connection = await pool.getConnection();
        await connection.execute(sql, [text]);
        connection.release();
        return NextResponse.json({}, { status: 200 })
    }catch(error: any){
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try{
        const json = await req.json();
        const id = json.id;
        const sql = 'DELETE FROM `todo` WHERE id = ?';
        const connection = await pool.getConnection();
        await connection.execute(sql, [id]);
        connection.release();
        return NextResponse.json({}, { status: 200 })
    }catch(error: any){
        return NextResponse.json({ error: error }, { status: 500 });
    }
}