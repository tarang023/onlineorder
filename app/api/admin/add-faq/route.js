import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbConfig";
import Faq from "@/models/faq";
connect();

export async function POST(req) { 
    const { question, answer,category } = await req.json();

    try {
        const newFaq = new Faq({ question, answer,category });
        await newFaq.save();
        return NextResponse.json({ message: "FAQ added successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error adding FAQ", error }, { status: 500 });
    }
}
