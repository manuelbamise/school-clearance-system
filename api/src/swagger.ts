const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Student Clearance System API',
    version: '1.0.0',
    description:
      'REST API for the Student Clearance Management System. Supports student clearance workflows, document management, user administration, and audit logging.',
  },
  servers: [
    {
      url: '/api',
      description: 'API base path',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from POST /auth/login',
      },
    },
    schemas: {
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          total: { type: 'integer', example: 42 },
          totalPages: { type: 'integer', example: 5 },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'array',
            items: { type: 'object' },
            nullable: true,
          },
        },
      },
      SuccessMessage: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          message: { type: 'string', example: 'User deleted' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          studentId: { type: 'string', nullable: true },
          staffId: { type: 'string', nullable: true },
          role: {
            type: 'string',
            enum: ['student', 'superAdmin', 'academic', 'bursary', 'department'],
          },
          departmentId: { type: 'string', nullable: true },
          department: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
            },
            nullable: true,
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/User' },
              token: { type: 'string' },
            },
          },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['email', 'password', 'name', 'role'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@portal.test' },
          password: { type: 'string', format: 'password', minLength: 8, example: 'password123' },
          name: { type: 'string', example: 'John Doe' },
          role: {
            type: 'string',
            enum: ['student', 'superAdmin', 'academic', 'bursary', 'department'],
          },
          studentId: { type: 'string', example: 'STU001' },
          staffId: { type: 'string', example: 'STA001' },
          departmentId: { type: 'string' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'super@portal.test' },
          password: { type: 'string', format: 'password', example: 'password123' },
        },
      },
      CreateUserInput: {
        type: 'object',
        required: ['email', 'password', 'name', 'role'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password', minLength: 8 },
          name: { type: 'string' },
          role: {
            type: 'string',
            enum: ['student', 'superAdmin', 'academic', 'bursary', 'department'],
          },
          studentId: { type: 'string' },
          staffId: { type: 'string' },
          departmentId: { type: 'string', nullable: true },
        },
      },
      UpdateUserInput: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: {
            type: 'string',
            enum: ['student', 'superAdmin', 'academic', 'bursary', 'department'],
          },
          studentId: { type: 'string' },
          staffId: { type: 'string' },
          departmentId: { type: 'string', nullable: true },
        },
      },
      Report: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userName: { type: 'string', example: 'John Doe' },
          userEmail: { type: 'string', format: 'email', example: 'john@test.com' },
          userDepartment: { type: 'string', example: 'Computer Science' },
          title: { type: 'string', example: 'Missing Fee Receipt' },
          content: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'resolved'] },
          date: { type: 'string', format: 'date', example: '2026-04-12' },
        },
      },
      CreateReportInput: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', example: 'Missing Fee Receipt' },
          content: { type: 'string', example: 'I submitted my fee receipt last week...' },
        },
      },
      UpdateReportStatus: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['pending', 'resolved'] },
        },
      },
      Department: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Computer Science' },
          userCount: { type: 'integer', example: 45 },
        },
      },
      CreateDepartmentInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'New Department' },
        },
      },
      AuditLog: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          who: { type: 'string', example: 'Super Admin' },
          whoEmail: { type: 'string', format: 'email', example: 'admin@test.com' },
          what: { type: 'string', example: 'Successful login' },
          when: { type: 'string', format: 'date-time' },
          where: { type: 'string', example: '192.168.1.100' },
          why: { type: 'string', example: 'User logged in successfully' },
          category: {
            type: 'string',
            enum: ['login', 'permission', 'export', 'user-management'],
          },
          status: { type: 'string', enum: ['success', 'failure'] },
        },
      },
      Activity: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'John Doe' },
              role: { type: 'string', example: 'student' },
            },
          },
          action: { type: 'string', example: 'uploaded' },
          target: { type: 'string', example: 'CS 301 Assignment' },
          timestamp: { type: 'string', format: 'date-time' },
          type: { type: 'string', enum: ['info', 'success', 'warning', 'error'] },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Returns server status to confirm the API is running.',
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    message: { type: 'string', example: 'Server is running well' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        description: 'Creates a new user account and returns a JWT token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Email already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        description: 'Authenticates with email and password. Returns user data and JWT token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user',
        description: 'Returns the authenticated user\'s profile.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Current user data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List all users',
        description: 'Returns a paginated list of users. Requires superAdmin role.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
          { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Search by name, email, student ID, or staff ID' },
        ],
        responses: {
          '200': {
            description: 'Paginated list of users',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden — not superAdmin' },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create a user',
        description: 'Creates a new user. Requires superAdmin role.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden — not superAdmin' },
        },
      },
    },

    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by ID',
        description: 'Returns a single user. Requires superAdmin role.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'User data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden — not superAdmin' },
          '404': { description: 'User not found' },
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update user',
        description: 'Updates a user\'s details. Requires superAdmin role.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'User updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden — not superAdmin' },
          '404': { description: 'User not found' },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user',
        description: 'Permanently deletes a user. Requires superAdmin role.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'User deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessMessage' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden — not superAdmin' },
          '404': { description: 'User not found' },
        },
      },
    },

    '/reports': {
      post: {
        tags: ['Reports'],
        summary: 'Create a report',
        description: 'Submits a new report. Accessible to all roles except superAdmin.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateReportInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Report created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/Report' },
                  },
                },
              },
            },
          },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden — superAdmin cannot create reports' },
        },
      },
      get: {
        tags: ['Reports'],
        summary: 'List all reports',
        description: 'Returns a paginated list of reports. Requires superAdmin role.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
          { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Search by title, user name, or email' },
          { in: 'query', name: 'status', schema: { type: 'string', enum: ['all', 'pending', 'resolved'] } },
        ],
        responses: {
          '200': {
            description: 'Paginated list of reports',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Report' } },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden — not superAdmin' },
        },
      },
    },

    '/reports/{id}': {
      patch: {
        tags: ['Reports'],
        summary: 'Update report status',
        description: 'Resolves or reopens a report. Requires superAdmin role.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateReportStatus' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Report status updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/Report' },
                  },
                },
              },
            },
          },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden — not superAdmin' },
          '404': { description: 'Report not found' },
        },
      },
      delete: {
        tags: ['Reports'],
        summary: 'Delete report',
        description: 'Permanently deletes a report. Requires superAdmin role.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Report deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessMessage' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden — not superAdmin' },
          '404': { description: 'Report not found' },
        },
      },
    },

    '/departments': {
      get: {
        tags: ['Departments'],
        summary: 'List all departments',
        description: 'Returns all departments with user count. Requires superAdmin role.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of departments',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Department' },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden — not superAdmin' },
        },
      },
      post: {
        tags: ['Departments'],
        summary: 'Create a department',
        description: 'Creates a new department. Requires superAdmin role.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDepartmentInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Department created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/Department' },
                  },
                },
              },
            },
          },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden — not superAdmin' },
          '409': { description: 'Department name already exists' },
        },
      },
    },

    '/departments/{id}': {
      delete: {
        tags: ['Departments'],
        summary: 'Delete department',
        description: 'Permanently deletes a department. Requires superAdmin role.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Department deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessMessage' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden — not superAdmin' },
          '404': { description: 'Department not found' },
        },
      },
    },

    '/activities': {
      get: {
        tags: ['Activities'],
        summary: 'List recent activities',
        description: 'Returns a paginated list of recent user activities for the dashboard feed. Any authenticated user can view.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          '200': {
            description: 'Paginated list of activities',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Activity' } },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    '/audit-logs': {
      get: {
        tags: ['Audit Logs'],
        summary: 'List audit logs',
        description: 'Returns a paginated list of audit logs. Requires superAdmin role. Filterable by category and search.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
          { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Search by action, reason, IP, user name, or email' },
          { in: 'query', name: 'category', schema: { type: 'string', enum: ['all', 'login', 'permission', 'export', 'user-management'] } },
        ],
        responses: {
          '200': {
            description: 'Paginated list of audit logs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/AuditLog' } },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden — not superAdmin' },
        },
      },
      delete: {
        tags: ['Audit Logs'],
        summary: 'Clear all audit logs',
        description: 'Permanently deletes all audit logs. Requires superAdmin role.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'All audit logs cleared',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessMessage' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden — not superAdmin' },
        },
      },
    },
  },
};

export default swaggerSpec;
