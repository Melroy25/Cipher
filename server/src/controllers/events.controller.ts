import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getAllEvents(req: Request, res: Response) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        slides: {
          orderBy: { order: "asc" },
        },
      },
    });
    return res.json({ success: true, data: events });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch events." });
  }
}

export async function getEventById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        slides: {
          orderBy: { order: "asc" },
        },
      },
    });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    return res.json({ success: true, data: event });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch event." });
  }
}

export async function createEvent(req: Request, res: Response) {
  try {
    const {
      title,
      tag,
      dateTag,
      cardSub,
      subTitle,
      slug,
      shortDesc,
      description,
      fullDescription,
      posterUrl,
      eventDate,
      startTime,
      endTime,
      venue,
      registrationUrl,
      category,
      status,
      displayOrder,
      isPublished,
      featuredOnHome,
      slides,
    } = req.body;

    if (!title || !shortDesc) {
      return res.status(400).json({
        success: false,
        message: "Title and short description are required.",
      });
    }

    const fullDescString = Array.isArray(fullDescription)
      ? JSON.stringify(fullDescription)
      : typeof fullDescription === "string"
      ? fullDescription
      : undefined;

    const event = await prisma.event.create({
      data: {
        title,
        tag: tag || "EVENT",
        dateTag: dateTag || "TBD",
        cardSub,
        subTitle,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
        shortDesc,
        description,
        fullDescription: fullDescString,
        posterUrl,
        eventDate: eventDate ? new Date(eventDate) : null,
        startTime,
        endTime,
        venue,
        registrationUrl,
        category: category || "Workshop",
        status: status || "UPCOMING",
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        featuredOnHome: featuredOnHome !== undefined ? Boolean(featuredOnHome) : true,
        ...(Array.isArray(slides) && slides.length > 0
          ? {
              slides: {
                create: slides.map((slide: any, index: number) => ({
                  imageUrl: typeof slide === "string" ? slide : slide.imageUrl,
                  order: typeof slide === "object" && slide.order !== undefined ? Number(slide.order) : index,
                  caption: typeof slide === "object" ? slide.caption : null,
                })),
              },
            }
          : {}),
      },
      include: {
        slides: true,
      },
    });

    return res.status(201).json({ success: true, data: event, message: "Event created successfully." });
  } catch (err) {
    console.error("Create event error:", err);
    return res.status(500).json({ success: false, message: "Failed to create event." });
  }
}

export async function updateEvent(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      title,
      tag,
      dateTag,
      cardSub,
      subTitle,
      slug,
      shortDesc,
      description,
      fullDescription,
      posterUrl,
      eventDate,
      startTime,
      endTime,
      venue,
      registrationUrl,
      category,
      status,
      displayOrder,
      isPublished,
      featuredOnHome,
      slides,
    } = req.body;

    const fullDescString = fullDescription !== undefined
      ? Array.isArray(fullDescription)
        ? JSON.stringify(fullDescription)
        : fullDescription
      : undefined;

    // Optional slide recreation if slides array provided
    if (Array.isArray(slides)) {
      await prisma.eventSlide.deleteMany({ where: { eventId: id } });
      const validSlides = slides.filter((s: any) => (typeof s === "string" ? s.trim().length > 0 : Boolean(s?.imageUrl)));
      if (validSlides.length > 0) {
        await prisma.eventSlide.createMany({
          data: validSlides.map((slide: any, index: number) => ({
            eventId: id,
            imageUrl: typeof slide === "string" ? slide.trim() : slide.imageUrl,
            order: typeof slide === "object" && slide.order !== undefined ? Number(slide.order) : index,
            caption: typeof slide === "object" ? slide.caption : null,
          })),
        });
      }
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(tag !== undefined && { tag }),
        ...(dateTag !== undefined && { dateTag }),
        ...(cardSub !== undefined && { cardSub }),
        ...(subTitle !== undefined && { subTitle }),
        ...(slug !== undefined && { slug }),
        ...(shortDesc && { shortDesc }),
        ...(description !== undefined && { description }),
        ...(fullDescString !== undefined && { fullDescription: fullDescString }),
        ...(posterUrl !== undefined && { posterUrl }),
        ...(eventDate !== undefined && {
          eventDate: eventDate && !isNaN(new Date(eventDate).getTime()) ? new Date(eventDate) : null,
        }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(venue !== undefined && { venue }),
        ...(registrationUrl !== undefined && { registrationUrl }),
        ...(category !== undefined && { category }),
        ...(status !== undefined && { status }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
        ...(featuredOnHome !== undefined && { featuredOnHome: Boolean(featuredOnHome) }),
      },
      include: {
        slides: { orderBy: { order: "asc" } },
      },
    });

    return res.json({ success: true, data: event, message: "Event updated successfully." });
  } catch (err) {
    console.error("Update event error:", err);
    return res.status(500).json({ success: false, message: "Failed to update event." });
  }
}

export async function deleteEvent(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id } });
    return res.json({ success: true, message: "Event deleted successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete event." });
  }
}

export async function addEventSlide(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { imageUrl, order, caption } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Image URL is required." });
    }

    const slide = await prisma.eventSlide.create({
      data: {
        eventId: id,
        imageUrl,
        order: order !== undefined ? Number(order) : 0,
        caption,
      },
    });

    return res.status(201).json({ success: true, data: slide, message: "Slide added successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to add slide." });
  }
}

export async function deleteEventSlide(req: Request, res: Response) {
  try {
    const { slideId } = req.params;
    await prisma.eventSlide.delete({ where: { id: slideId } });
    return res.json({ success: true, message: "Slide removed successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to remove slide." });
  }
}

