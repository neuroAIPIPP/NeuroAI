# Contributing to NeuroAI

First off, thank you for considering contributing to NeuroAI! It's 
people like you that make NeuroAI such a great tool.

## Table of Contents

- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)


## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid 
duplicates. When you create a bug report, include as many details as 
possible using our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

**Great bug reports include:**
- A clear, descriptive title
- Steps to reproduce the behavior
- Expected behavior vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, version)

### 💡 Suggesting Features

Feature requests are welcome! Please use our 
[feature request template](.github/ISSUE_TEMPLATE/feature_request.md).

**Great feature requests include:**
- Clear problem statement: "I'm frustrated when..."
- Proposed solution
- Alternative solutions you've considered
- Additional context


## Development Setup

### Prerequisites

- Node.js 22+
- npm 10+
- Git

### Getting Started

```bash
# 1. Clone repo locally
git clone https://github.com/neuroAIPIPP/NeuroAI.git
cd NeuroAI

# 2. Install dependencies
npm install

# 3. Create a branch for your changes
git checkout -b feature/your-feature-name

# 4. Start development server
npm run dev

# 5. Run tests to verify setup
npm test
```

### Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm test` | Run test suite |
| `npm run lint` | Check code style |
| `npm run format:write` | Auto-format code |
| `npm run build` | Build for production |

## Pull Request Process

### Before Submitting

1. **Run the full test suite** and ensure all tests pass:
   ```bash
   npm test
   ```

2. **Update documentation** if you've changed APIs or added features.

### Submitting

1. Push your branch to your development branch:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request against the `main` branch.

3. Fill out the PR template completely.

4. Wait for review.

### PR Template

When you create a PR, include as many details as possible 
using our [pull request template](.github/pull_request_template.md).

## Style Guide

### Commit Messages

We follow [Conventional Commits](https://conventionalcommits.org/):

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add OAuth2 support
fix(api): handle null response from payment provider
docs(readme): update installation instructions
```

### Code Style

- Use Prettier for formatting (config included)
- Use ESLint for linting (config included)
- Write self-documenting code with meaningful variable names

### Testing

- All new features must include tests
- Bug fixes should include regression tests
- Aim for >80% code coverage on new code
- Tests should be deterministic (no flaky tests)

---

Thank you for contributing! 🎉