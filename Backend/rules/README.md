# Backend Development Rules & Standards

This folder contains comprehensive documentation for backend development standards, patterns, and best practices for the GYM App backend.

## 📚 Documentation Index

### Core Standards
- **[Structure & Organization](./structure.md)** - Backend folder structure, naming conventions, and code organization
- **[Error Handling](./error-handling.md)** - Error handling patterns, exception management, and logging
- **[API Standards](./api-standards.md)** - API response formats, status codes, and endpoint conventions
- **[Validation](./validation.md)** - Input validation patterns and form request usage

### Architecture Patterns
- **[Services Layer](./services.md)** - Service classes, dependency injection, and business logic organization
- **[Database Queries](./database.md)** - Query optimization, eager loading, and N+1 prevention
- **[Authentication & Authorization](./authentication.md)** - Auth patterns, middleware, and role-based access

### Additional Guidelines
- **[Testing](./testing.md)** - Testing strategies and patterns
- **[Code Style](./code-style.md)** - Coding standards and conventions

## 🎯 Quick Reference

### When to Use What

| Scenario | Solution | Reference |
|----------|----------|-----------|
| API endpoint needs validation | Form Request | [Validation](./validation.md) |
| Complex business logic | Service Class | [Services](./services.md) |
| API response formatting | Resource Class | [API Standards](./api-standards.md) |
| Error occurs in controller | Try-catch with proper response | [Error Handling](./error-handling.md) |
| Need to query with relationships | Eager loading with `with()` | [Database](./database.md) |
| Need to check user permissions | Policy or Middleware | [Authentication](./authentication.md) |

## 📖 How to Use This Documentation

1. **New Developers**: Start with [Structure](./structure.md) and [Error Handling](./error-handling.md)
2. **API Development**: Review [API Standards](./api-standards.md) and [Validation](./validation.md)
3. **Complex Features**: Check [Services](./services.md) and [Database](./database.md)
4. **Security**: Read [Authentication](./authentication.md)

## 🔄 Keeping This Updated

When adding new patterns or changing existing ones:
1. Update the relevant documentation file
2. Add examples from actual code
3. Update this README if new sections are added

---

**Last Updated**: December 2025
**Laravel Version**: 11.x
**PHP Version**: 8.2+

