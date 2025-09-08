import postgres from "postgres";
import polka from "polka";
import fs from "fs/promises";

const sql = postgres({});

await sql`
    drop table if exists count;
    create table count (
        value integer
    );
    insert into count (value) values (0);
`.simple();

const index = await fs.readFile("index.html", { encoding: "utf-8" });

polka()
    .get("/", async (req, res) => {
        const [count] = await sql`
            select value from count;
        `;
        res.end(index.replaceAll("$COUNT$", count.value));
    })
    .post("/", async (req, res) => {
        await sql`
            update count
            set value = value + 1;
        `;
        res.writeHead(303, {
            'Location': "/",
            'Content-Length': 0
        });
        res.end();
    })
    .listen(80);
