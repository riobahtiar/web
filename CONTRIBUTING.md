# Contributing to Astro Rio

Thank you for your interest in contributing to this project! This document provides guidelines and best practices for contributing.

## 🤝 How to Contribute

### Reporting Issues

- Check existing issues before creating a new one
- Use a clear, descriptive title
- Provide detailed reproduction steps
- Include environment information (browser, OS, Node version)
- Add screenshots or error logs when applicable

### Suggesting Features

- Open an issue with the "feature request" label
- Clearly describe the proposed feature and its benefits
- Explain the use case and expected behavior
- Be open to discussion and feedback

## 🔧 Development Setup

### Prerequisites

- Node.js 22.x or higher
- npm 10.x or higher
- Git
- Code editor (VS Code recommended)

### Initial Setup

```bash
# 1. Clone the repository
git clone https://github.com/riobahtiar/web.git
cd web

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

### Recommended VS Code Extensions

- **Astro** - Astro language support
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **ESLint** - Code linting

## 📝 Coding Guidelines

### Code Style

Follow the guidelines in [CLAUDE.md](./CLAUDE.md):

- Use TypeScript strict mode
- Follow naming conventions (PascalCase, camelCase, kebab-case)
- Use path aliases (`@/`) for imports
- Write self-documenting code with clear variable names

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(blog): add pagination to blog posts
fix(i18n): resolve language switcher redirect issue
docs: update deployment guide with KV namespace setup
style: format code with prettier
refactor(components): simplify Header component logic
```

### Branch Naming

Use descriptive branch names:

```
feature/add-search-functionality
fix/navbar-mobile-menu
docs/update-readme
refactor/optimize-blog-queries
```

## 🧪 Testing

### Before Submitting

Run these commands to ensure code quality:

```bash
# 1. Type checking
npx astro check

# 2. Code formatting
npm run format

# 3. Build test
npm run build

# 4. Security audit
npm audit
```

### Manual Testing Checklist

- [ ] Test on desktop and mobile
- [ ] Check both English and Indonesian versions
- [ ] Verify dark/light theme switching
- [ ] Test all navigation links
- [ ] Check for console errors
- [ ] Verify responsive design

## 📦 Pull Request Process

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow coding guidelines
- Write clean, documented code
- Keep changes focused and atomic
- Update documentation if needed

### 3. Test Thoroughly

```bash
npm run dev          # Test locally
npx astro check      # Type check
npm run build        # Ensure build succeeds
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

### 5. Push to GitHub

```bash
git push -u origin feature/your-feature-name
```

### 6. Create Pull Request

- Use a clear, descriptive title
- Fill out the PR template completely
- Link related issues
- Request review from maintainers
- Be responsive to feedback

### PR Requirements

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npx astro check`, `npm run build`)
- [ ] Documentation updated (if applicable)
- [ ] No console errors or warnings
- [ ] Tested on both languages (English & Indonesian)
- [ ] No security vulnerabilities introduced

## 🌍 Internationalization

When adding new features with text:

1. Add English translation to `src/i18n/en.ts`
2. Add Indonesian translation to `src/i18n/id.ts`
3. Ensure both have identical structure
4. Use translations in components (not hard-coded strings)

**Example:**

```typescript
// src/i18n/en.ts
export const en = {
  // ... existing translations
  newFeature: {
    title: "New Feature",
    description: "Feature description",
  },
};

// src/i18n/id.ts
export const id = {
  // ... existing translations
  newFeature: {
    title: "Fitur Baru",
    description: "Deskripsi fitur",
  },
};
```

## 🐛 Bug Fixes

### Reporting Bugs

Include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos (if applicable)
- Browser and OS information
- Error messages or console logs

### Fixing Bugs

1. Create an issue (if not already exists)
2. Reference the issue in your PR
3. Include steps to verify the fix
4. Add comments explaining the solution

## 📚 Documentation

### When to Update Documentation

- Adding new features
- Changing configuration
- Modifying deployment process
- Adding dependencies
- Changing project structure

### Documentation Files

- `README.md` - Project overview and quick start
- `CLAUDE.md` - Development guidelines
- `DEPLOYMENT.md` - Deployment instructions
- `CONTRIBUTING.md` - This file
- Code comments - Complex logic explanations

## 🔒 Security

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Instead:

1. Email security concerns privately
2. Include detailed description
3. Provide steps to reproduce
4. Wait for response before public disclosure

### Security Best Practices

- Never commit sensitive data (API keys, secrets)
- Validate all user input
- Use environment variables for secrets
- Keep dependencies up-to-date
- Run `npm audit` regularly

## ⚖️ Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome diverse perspectives
- Give and receive constructive feedback gracefully
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Personal attacks or insults
- Trolling or inflammatory comments
- Publishing others' private information
- Unprofessional conduct

## 📞 Getting Help

- Read the [README.md](./README.md) first
- Check [CLAUDE.md](./CLAUDE.md) for development guidelines
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Search existing issues
- Ask questions in discussions
- Contact maintainers if needed

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Astro Rio! 🎉
