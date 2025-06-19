It uses:

* Next.js (App Router)
* Prisma ORM + Supabase
* Gemini API (for generating text answers or product descriptions from prompt)
* UI components from `shadcn/ui`

---

## STEP 1 – Clone the Project

```bash
git clone https://github.com/Prathamesh01110/CRUD-APP.git
cd CRUD-APP
npm install
```

---

## STEP 2 – Connect to Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. Get your Supabase **database URL** and **anon/public API key**.

Create a `.env` file in the root of your project and add:

```env
DATABASE_URL="postgresql://<your-db-username>:<password>@<host>:<port>/<db-name>"
```

You can find this under **Project Settings → Database → Connection Info** in Supabase.

---

## STEP 3 – Initialize Prisma

If you haven't already:

```bash
npx prisma init
```

This will create:

* `prisma/schema.prisma` → Your database schema
* `.env` → For your database URL

Edit `schema.prisma` with your models.

Example:

```prisma
model Product {
  id        String   @id @default(cuid())
  name      String
  price     Int
  createdAt DateTime @default(now())
}
```

Then run:

```bash
npx prisma migrate dev --name init
```

This creates the tables in your Supabase database.

---

## Prisma Commands – Quick Guide

```bash
npx prisma init              # Initializes Prisma project
npx prisma db push          # Push schema to DB without creating a migration
npx prisma migrate dev      # Applies schema and creates a versioned migration
npx prisma studio           # Opens Prisma Studio (DB UI)
npx prisma generate         # Regenerates Prisma Client (after schema change)
npx prisma format           # Formats your schema.prisma file
```

### Tips

* Use `db push` for quick testing
* Use `migrate dev` to track schema changes
* Use `studio` to visually check your data

---

## Project Structure – Pages Overview

### `/user`

* A simple form to store user name and phone number **locally**
* No database connection

### `/admin`

* Connected to **Supabase using Prisma**
* Supports **Create** and **Read** operations (C, R)

### `/superadmin`

* Connected to **Supabase**
* Supports full **CRUD**: Create, Read, Update, Delete

### `/answers`

* Integrates **Gemini API**
* Accepts a user text prompt and returns an AI-generated response

---

## `lib/` Folder Explained

### `lib/prisma.js` – Prisma Client Singleton

```js
import { PrismaClient } from '@prisma/client';

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}
```

✅ Use this to safely access the DB across pages/components.

```js
import { prisma } from "@/lib/prisma";
```

---

### `lib/gemini.js` – Gemini API Wrapper

```js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateAnswer(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
```

✅ Call this function from server actions or route handlers:

```js
const answer = await generateAnswer("Write a cool description for iPhone 15");
```

---

## UI Components – shadcn/ui

We are using `shadcn/ui` for modern styled React components.
It's built on top of Tailwind CSS.

Example:

```js
import { Button } from "@/components/ui/button";

<Button className="bg-blue-600 text-white">Click Me</Button>
```

Use prebuilt inputs, cards, modals, and other UI components.

---

## Useful Summary

* Clone the repo and install packages
* Set `DATABASE_URL` from Supabase in `.env`
* Run Prisma setup commands
* Build pages: `/user`, `/admin`, `/superadmin`, `/answers`
* Use `lib/prisma` for DB and `lib/gemini` for AI
* UI is styled with `shadcn/ui`

✅ You're ready to build and test the app!
