import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().default("TQCC"),
    category: z.enum([
      "Club News",
      "Race Reports",
      "Ride Reports",
      "Events",
      "Youth",
      "Boccia",
      "General",
    ]),
    image: z.string().optional(),
    excerpt: z.string(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string(),
    description: z.string(),
    rideType: z
      .enum([
        "Club Ride",
        "Sportive",
        "Social",
        "Youth Ride",
        "Training",
        "Race",
        "Other",
      ])
      .default("Club Ride"),
    meetingPoint: z.string().optional(),
    distance: z.string().optional(),
    pace: z.string().optional(),
    link: z.string().url().optional(),
    image: z.string().optional(),
  }),
});

const rides = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/rides" }),
  schema: z.object({
    title: z.string(),
    day: z.enum([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]),
    time: z.string(),
    meetingPoint: z.string(),
    pace: z.string(),
    distance: z.string(),
    description: z.string(),
    difficulty: z.enum(["Easy", "Moderate", "Intermediate", "Advanced"]),
    active: z.boolean().default(true),
    order: z.number().default(0),
  }),
});

const newsletters = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/newsletters" }),
  schema: z.object({
    month: z.enum([
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]),
    year: z.number(),
    date: z.coerce.date(),
    heroImage: z.string(),
    introduction: z.string(),
    events: z.array(
      z.object({
        month: z.string(),
        description: z.string(),
        date: z.string(),
      })
    ),
  }),
});

export const collections = { posts, events, rides, newsletters };
