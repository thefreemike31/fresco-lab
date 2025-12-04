import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'visitor-count.json');

async function getCount(): Promise<number> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const json = JSON.parse(data);
        return json.count || 0;
    } catch {
        return 0;
    }
}

async function setCount(count: number): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify({ count }, null, 2));
}

// GET: just return current count
export async function GET() {
    const count = await getCount();
    return NextResponse.json({ count });
}

// POST: increment and return new count
export async function POST() {
    const count = await getCount();
    const newCount = count + 1;
    await setCount(newCount);
    return NextResponse.json({ count: newCount });
}
