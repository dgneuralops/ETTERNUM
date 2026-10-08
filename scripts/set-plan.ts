/**
 * Define o plano de um usuário (útil até o checkout de pagamento estar conectado).
 *
 *   npm run usuario:plano -- pessoa@email.com premium
 *   npm run usuario:plano -- pessoa@email.com trial
 */
import { eq } from "drizzle-orm";
import { connect } from "./db";

async function main() {
  const [email, plan] = process.argv.slice(2);
  if (!email || !["premium", "trial"].includes(plan ?? "")) {
    console.error("Uso: npm run usuario:plano -- <email> <premium|trial>");
    process.exit(1);
  }
  const { db, schema, close } = await connect();
  try {
    const updated = await db
      .update(schema.users)
      .set({ plan })
      .where(eq(schema.users.email, email.toLowerCase()))
      .returning({ id: schema.users.id });
    console.log(updated.length ? `✓ ${email} agora está no plano ${plan}.` : `Nenhum usuário com o e-mail ${email}.`);
  } finally {
    await close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
