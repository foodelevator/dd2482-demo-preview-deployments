import postgres from "postgres";
import polka from "polka";
import fs from "fs/promises";

const sql = postgres({});

await sql`
    create extension if not exists "pgcrypto";

    create table if not exists todos ();
    alter table todos rename to todos__old;

    create table if not exists todos (
        id uuid primary key default gen_random_uuid(),
        title text not null,
        description text not null default ''
    );

    insert into todos select * from todos__old;
    drop table todos__old;
`.simple();

const index = await fs.readFile("index.html", { encoding: "utf-8" });

function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            resolve(Object.fromEntries(params));
        });
    });
}

polka()
    .get("/", async (req, res) => {
        const todos = await sql`
            select * from todos order by id desc;
        `;

        let todosHtml = '';
        if (todos.length === 0) {
            todosHtml = '<li class="empty-state">No todos yet. Add one above!</li>';
        } else {
            todosHtml = todos.map(todo => `
                <li class="todo-item">
                    <div class="todo-content">
                        <div class="todo-title">${escapeHtml(todo.title)}</div>
                        <div class="todo-description">${escapeHtml(todo.description)}</div>
                    </div>
                    <form method="post" action="/delete/${todo.id}" style="display: inline;">
                        <button type="submit" class="delete-btn">Delete</button>
                    </form>
                </li>
            `).join('');
        }

        res.writeHead(200, {
            "Content-Type": "text/html; charset=UTF-8",
        });
        res.end(index.replaceAll("$TODOS$", todosHtml));
    })
    .post("/add", async (req, res) => {
        const body = await parseBody(req);
        if (body.title && body.title.trim()) {
            await sql`
                insert into todos (title, description) values (${body.title.trim()}, ${(body.description || "").trim()});
            `;
        }
        res.writeHead(303, {
            "Location": "/",
            "Content-Length": 0
        });
        res.end();
    })
    .post("/delete/:id", async (req, res) => {
        const id = req.params.id;
        if (id) {
            await sql`
                delete from todos where id = ${id};
            `;
        }
        res.writeHead(303, {
            "Location": "/",
            "Content-Length": 0
        });
        res.end();
    })
    .listen(80);

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
