import { z } from 'zod';
import { insertNgoSchema, insertUserSchema, insertAnnouncementSchema, insertSiteContentSchema, insertNoticeSchema, ngos, users, announcements, siteContent, notices } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/auth/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  ngos: {
    listPublic: {
      method: 'GET' as const,
      path: '/api/ngos/public',
      responses: {
        200: z.array(z.custom<typeof ngos.$inferSelect>()),
      },
    },
    getPublic: {
      method: 'GET' as const,
      path: '/api/ngos/public/:id',
      responses: {
        200: z.custom<typeof ngos.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/ngos',
      responses: {
        200: z.array(z.custom<typeof ngos.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/ngos/:id',
      responses: {
        200: z.custom<typeof ngos.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/ngos',
      input: insertNgoSchema,
      responses: {
        201: z.custom<typeof ngos.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/ngos/:id/status',
      input: z.object({ status: z.enum(["Pending", "Approved", "Rejected"]) }),
      responses: {
        200: z.custom<typeof ngos.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/ngos/:id',
      input: insertNgoSchema.partial(),
      responses: {
        200: z.custom<typeof ngos.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/ngos/:id',
      responses: {
        200: z.object({ success: z.boolean() }),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  opportunities: {
    list: {
      method: 'GET' as const,
      path: '/api/public/opportunities',
      responses: {
        200: z.array(z.object({
          id: z.string(),
          type: z.enum(['job', 'volunteer']),
          ngoId: z.number(),
          ngoName: z.string(),
          vacancyName: z.string(),
          workField: z.string().optional(),
          governorate: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          commitmentNature: z.string().optional(),
          qualification: z.string().optional(),
          skills: z.string().optional(),
          experience: z.string().optional(),
          details: z.string().optional(),
          jobPurpose: z.string().optional(),
          volunteerPurpose: z.string().optional(),
        })),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/public/opportunities/:id',
      responses: {
        200: z.object({
          id: z.string(),
          type: z.enum(['job', 'volunteer']),
          ngoId: z.number(),
          ngoName: z.string(),
          vacancyName: z.string(),
          vacancyNumber: z.string().optional(),
          workField: z.string().optional(),
          governorate: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          commitmentNature: z.string().optional(),
          qualification: z.string().optional(),
          skills: z.string().optional(),
          experience: z.string().optional(),
          details: z.string().optional(),
          jobPurpose: z.string().optional(),
          volunteerPurpose: z.string().optional(),
        }),
        404: errorSchemas.notFound,
      },
    },
  },
  announcements: {
    list: {
      method: 'GET' as const,
      path: '/api/announcements',
      responses: {
        200: z.array(z.custom<typeof announcements.$inferSelect>()),
      },
    },
    listPublished: {
      method: 'GET' as const,
      path: '/api/announcements/published',
      responses: {
        200: z.array(z.custom<typeof announcements.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/announcements/:id',
      responses: {
        200: z.custom<typeof announcements.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/announcements',
      input: insertAnnouncementSchema,
      responses: {
        201: z.custom<typeof announcements.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/announcements/:id',
      input: insertAnnouncementSchema.partial(),
      responses: {
        200: z.custom<typeof announcements.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/announcements/:id',
      responses: {
        200: z.object({ success: z.boolean() }),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  siteContent: {
    list: {
      method: 'GET' as const,
      path: '/api/content',
      responses: {
        200: z.array(z.custom<typeof siteContent.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/content/:key',
      responses: {
        200: z.custom<typeof siteContent.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    upsert: {
      method: 'PUT' as const,
      path: '/api/content/:key',
      input: insertSiteContentSchema.omit({ key: true }),
      responses: {
        200: z.custom<typeof siteContent.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  notices: {
    list: {
      method: 'GET' as const,
      path: '/api/notices',
      responses: {
        200: z.array(z.custom<typeof notices.$inferSelect>()),
      },
    },
    listPublic: {
      method: 'GET' as const,
      path: '/api/notices/public',
      responses: {
        200: z.array(z.custom<typeof notices.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/notices/:id',
      responses: {
        200: z.custom<typeof notices.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/notices',
      input: insertNoticeSchema,
      responses: {
        201: z.custom<typeof notices.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/notices/:id',
      input: insertNoticeSchema.partial(),
      responses: {
        200: z.custom<typeof notices.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/notices/:id',
      responses: {
        200: z.object({ success: z.boolean() }),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
