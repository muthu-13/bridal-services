import db from "../config/db.js";

export async function getUserChatResponse(message, user) {
  const msg = message.toLowerCase();
  const userId = user?.id || null;
  const userName = user?.name || "Guest";

  // Greeting
  if (msg.includes("hello") || msg.includes("hi")) {
    return {
      reply: `Hello ${userName}! 👋\nYou can ask about your bookings, offers, services, or upcoming workshops.\n\nSample queries:\n- "Show my bookings"\n- "Any offers?"\n- "What services do you provide?"\n- "Upcoming workshops"`,
      buttons: userId
        ? [
            { label: "View Bookings", link: "/booking" },
            { label: "Workshops", link: "/workshops" },
          ]
        : [{ label: "Login to see bookings", link: "/login" }],
    };
  }

  // Offers
  if (msg.includes("offer")) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT title, discount, valid_until FROM offers WHERE valid_until >= CURDATE()"
      );

    if (!rows.length)
      return { reply: "No current offers available.", buttons: [] };

    return {
      reply: rows
        .map(
          (o) =>
            `${o.title} - ${o.discount}% off, valid until ${o.valid_until}`
        )
        .join("\n"),
      buttons: userId
        ? [{ label: "Book Now", link: "/booking" }]
        : [{ label: "Login to Book", link: "/login" }],
    };
  }

  // User Bookings
  if (msg.includes("booking")) {
    if (!userId)
      return {
        reply: "Please login to see your bookings.",
        buttons: [{ label: "Login", link: "/login" }],
      };

    const [rows] = await db
      .promise()
      .query(
        "SELECT id, brideName, eventTypes, date, venue, status FROM bookings WHERE user_id = ?",
        [userId]
      );

    if (!rows.length)
      return {
        reply: "You have no bookings yet.",
        buttons: [{ label: "Book Now", link: "/booking" }],
      };

    return {
      reply: rows
        .map(
          (b) =>
            `Booking ID: ${b.id} - ${b.brideName} for ${b.eventTypes} on ${b.date} at ${b.venue}, Status: ${b.status}`
        )
        .join("\n"),
      buttons: [{ label: "Book More", link: "/booking" }],
    };
  }

  // Services
  if (msg.includes("service")) {
    const [rows] = await db.promise().query(
      "SELECT category, description FROM services"
    );
    if (!rows.length)
      return { reply: "No services available currently.", buttons: [] };

    return {
      reply: rows.map((s) => `${s.category}: ${s.description}`).join("\n"),
      buttons: userId
        ? [{ label: "Book Now", link: "/booking" }]
        : [{ label: "Login to Book", link: "/login" }],
    };
  }

  // Workshops
  if (msg.includes("workshop")) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, title, date, time, location FROM workshops WHERE date >= CURDATE()"
      );

    if (!rows.length)
      return { reply: "No upcoming workshops currently.", buttons: [] };

    return {
      reply: rows
        .map(
          (w) =>
            `${w.title} on ${w.date} at ${w.time}, Location: ${w.location}`
        )
        .join("\n"),
      buttons: rows.map((w) => ({
        label: userId ? `Register: ${w.title}` : `Login to Register`,
        link: userId ? `/register/${w.id}` : "/login",
      })),
    };
  }

  // Default
  return {
    reply: `Sorry, I didn't understand. You can ask about offers, bookings, services, or workshops.\n\nSample queries:\n- "Show my bookings"\n- "Any offers?"\n- "What services do you provide?"\n- "Upcoming workshops"`,
    buttons: userId
      ? [
          { label: "Book Now", link: "/booking" },
          { label: "Workshops", link: "/workshops" },
        ]
      : [{ label: "Login to Book", link: "/login" }],
  };
}
