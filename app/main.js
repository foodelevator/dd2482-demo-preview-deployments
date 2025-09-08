import postgres from "postgres";
import polka from "polka";

const sql = postgres({});

await sql`
    drop table if exists count;
    create table count (
        value integer
    );
    insert into count (value) values (0);
`;

polka()
    .get("/", (req, res) => {
        const [count] = await sql`
            select value from count;
        `;
        res.end(`<h1>${count.value}</h1>`);
    })
    .listen(80);
