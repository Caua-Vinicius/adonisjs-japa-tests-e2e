# AdonisJS Japa E2E Tests with DynamoDB

This repository documents my learning journey with **automated end-to-end testing** in **AdonisJS**, using **Japa** as the test runner and **DynamoDB** as the database.

The project focuses on understanding how to properly test APIs backed by a **NoSQL database**, including environment isolation, local infrastructure setup, test lifecycle management, and continuous integration.

---

## 🎯 Goals

- Learn E2E testing practices in AdonisJS  
- Understand how to test applications using DynamoDB (NoSQL)  
- Practice writing reliable, isolated, and repeatable tests  
- Explore real-world testing patterns for backend applications  

---

## 🧰 Tech Stack

- AdonisJS  
- Japa  
- DynamoDB Local  
- AWS SDK  
- TypeScript  
- GitHub Actions (CI)

---

## 🧪 Testing Approach

This project uses **Japa integrated with AdonisJS** to execute end-to-end tests against a **local DynamoDB instance**.

To ensure consistency and safety, the project relies on:
- Environment separation
- Local infrastructure simulation
- Explicit test lifecycle control

---

## 🌍 Environment Configuration

The application supports multiple environments using different `.env` files:

- `.env` → development environment  
- `.env.test` → test environment (used automatically by Japa)  

When running tests, AdonisJS loads `.env.test`, which allows:

- Using DynamoDB Local instead of AWS  
- Isolating test data from development data  
- Avoiding accidental access to real AWS resources  

Typical `.env.test` usage:
- Local DynamoDB endpoint  
- Test-specific table names  
- Dummy AWS credentials  

---

## 🧩 Japa Runner Configuration

Japa is configured with essential plugins to support assertions, HTTP testing, and AdonisJS integration:

```ts
export const plugins = [
  assert(),
  apiClient(),
  pluginAdonisJS(app),
]
```

This enables:
- Full HTTP API testing
- Access to AdonisJS application lifecycle
- Standard assertion utilities

---

## 🗄️ DynamoDB Table Setup

Instead of traditional database seeders, this project uses a **custom script** to prepare the DynamoDB infrastructure before tests run.

### Why a table creation script?

- DynamoDB requires tables to exist before use
- This step prepares infrastructure, not test data
- Keeps tests deterministic and independent

---

## ⚙️ Pre-Test Table Creation

Before all tests run, Japa executes a setup hook that ensures the `products` table exists in DynamoDB Local:

```ts
export const runnerHooks = {
  setup: [
    async () => {
      await createTable()
    },
  ],
  teardown: [],
}
```

This guarantees:
- Tables are always available during tests
- No manual setup is required
- Tests are repeatable and reliable

---

## 🌱 Test Data Strategy

- No traditional database seeders are used
- Test data is created inside test cases or helpers
- Each test controls its own data lifecycle

This approach helps:
- Avoid hidden test dependencies
- Improve test readability
- Keep tests focused and explicit

---

## 🌐 HTTP Server Lifecycle

For functional and E2E test suites, the AdonisJS HTTP server is started automatically:

```ts
export const configureSuite = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}
```

This ensures:
- Real HTTP requests during tests
- Full middleware and routing execution
- Behavior close to production

---

## 🔄 Continuous Integration (CI)

This repository includes a **CI pipeline** that automatically runs the test suite on every **Pull Request**.

The CI workflow:
- Spins up the required test environment
- Runs DynamoDB Local
- Executes the full Japa test suite
- Prevents merging code that breaks existing tests

This ensures:
- Early detection of regressions
- Consistent test execution across environments
- Increased confidence when reviewing and merging PRs

---

## 🚀 Running the Tests Locally

```bash
npm install
npm run test
```

Make sure DynamoDB Local is running before executing the tests.

---

## 📚 Learning-Oriented Repository

This repository is **learning-focused**, not a production-ready template.

It exists to:
- Experiment with NoSQL testing strategies
- Understand AdonisJS + Japa deeply
- Document lessons learned along the way

---
