import db from "../config/db.js";

// Admin chatbot controller
export async function getAdminChatResponse(message, admin) {
  const msg = message.toLowerCase();
  const adminName = admin?.username || "Admin";

  // 1️⃣ Greeting
  if (msg.includes("hello") || msg.includes("hi")) {
    return {
      reply: `Hello ${adminName}! 👋
You can ask about bookings, offers, workshops, services, contacts, reviews, or inventory.

Sample queries:
- "Total bookings"
- "Show offers"
- "Workshops list"
- "Services"
- "Contacts received"
- "Inventory"`
    };
  }

  // 2️⃣ Total Bookings
  if (msg.includes("booking")) {
    const [rows] = await db.promise().query("SELECT COUNT(*) AS totalBookings FROM bookings");
    return { reply: `Total bookings: ${rows[0].totalBookings}` };
  }

  // 3️⃣ Offers
  if (msg.includes("offer")) {
    const [rows] = await db
      .promise()
      .query("SELECT title, discount FROM offers WHERE valid_until >= CURDATE()");
    if (!rows.length) return { reply: "No active offers." };
    return { reply: rows.map((o) => `${o.title} - ${o.discount}% off`).join("\n") };
  }

  // 4️⃣ Workshops
  if (msg.includes("workshop")) {
    const [rows] = await db
      .promise()
      .query("SELECT title, date FROM workshops WHERE date >= CURDATE()");
    if (!rows.length) return { reply: "No upcoming workshops." };
    return { reply: rows.map((w) => `${w.title} on ${w.date}`).join("\n") };
  }

  // 5️⃣ Services
  if (msg.includes("service")) {
    const [rows] = await db.promise().query("SELECT category FROM services");
    if (!rows.length) return { reply: "No services found." };
    return { reply: rows.map((s) => s.category).join("\n") };
  }

  // 6️⃣ Contacts
  if (msg.includes("contact")) {
    const [rows] = await db
      .promise()
      .query("SELECT COUNT(*) AS totalContacts FROM contact_form");
    return { reply: `Total contact queries: ${rows[0].totalContacts}` };
  }

  // 7️⃣ Reviews
  if (msg.includes("review")) {
    const [rows] = await db.promise().query("SELECT COUNT(*) AS totalReviews FROM reviews");
    return { reply: `Total reviews: ${rows[0].totalReviews}` };
  }

  // 8️⃣ Inventory
  if (msg.includes("inventory")) {
    const [rows] = await db.promise().query("SELECT name, quantity FROM inventory");
    if (!rows.length) return { reply: "No inventory found." };
    return { reply: rows.map((i) => `${i.name}: ${i.quantity}`).join("\n") };
  }

  return { reply: "Sorry, I didn't understand. Try: bookings, offers, workshops, services, contacts, reviews, inventory." };
}
