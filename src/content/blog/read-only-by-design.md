---
title: "Read-Only by Design: How BoloDB Prevents Destructive Queries"
description: "A deep dive into BoloDB's dual-layer query validation system — how we ensure that AI-generated SQL can never modify, delete, or corrupt your data."
pubDate: 2026-07-10
tags: ["security", "architecture"]
---

When you let an AI write SQL against your production database, the first question should always be: *what's the worst that could happen?*

The honest answer, for most text-to-SQL tools, is terrifying. A hallucinated `DROP TABLE`, an accidental `UPDATE` without a `WHERE` clause, or a well-meaning `DELETE` that wipes months of data. These aren't theoretical risks — they're the reason most DBAs won't let AI-generated queries anywhere near production.

BoloDB takes a different approach. **Destructive queries are structurally impossible**, not just discouraged.

## Layer 1: AST-Level Parsing

Before any generated SQL reaches your database, BoloDB parses it into an Abstract Syntax Tree (AST). This isn't a regex check or a keyword scan — it's a full syntactic analysis that understands the structure of the query.

The rules are simple and absolute:

- ✅ `SELECT` statements → allowed
- ❌ `INSERT`, `UPDATE`, `DELETE` → rejected
- ❌ `DROP`, `ALTER`, `TRUNCATE` → rejected  
- ❌ `CREATE`, `GRANT`, `REVOKE` → rejected
- ❌ Subqueries containing any mutation → rejected

```
Input:  "DELETE FROM users WHERE id = 5; SELECT * FROM users"
Result: ❌ REJECTED — mutation detected at AST node 0
```

This catches every variation — CTEs wrapping mutations, multi-statement injections, and even database-specific syntax extensions. If the AST contains any node that isn't a read operation, the entire query is rejected.

## Layer 2: Database-Level Enforcement

The AST check is the first line of defense, but we don't stop there. BoloDB strongly recommends — and our documentation guides you through — connecting with a **read-only database user**.

```sql
-- PostgreSQL example
CREATE ROLE bolodb_reader WITH LOGIN PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE analytics TO bolodb_reader;
GRANT USAGE ON SCHEMA public TO bolodb_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO bolodb_reader;
```

This creates a second, independent layer of protection. Even if a bug in our AST parser somehow missed a destructive query (it won't — but defense in depth matters), the database itself would reject the operation.

## What About SQL Injection?

SQL injection is the classic attack vector, and it deserves specific attention. BoloDB mitigates it at multiple levels:

**Parameterized execution**: When queries involve user-provided values, they're passed as parameterized inputs, not string-concatenated into the SQL.

**Schema-only context**: The AI only sees table names, column names, and data types. It never sees full row data that could contain injection payloads.

**No dynamic DDL**: BoloDB never generates or executes data definition language. The connection is purely for querying existing structures.

## The Confidence Signal

Beyond preventing destructive queries, BoloDB provides a **confidence score** with every result. This isn't the AI saying "I'm 95% sure" — it's a computed metric based on concrete signals:

| Signal | Weight | What It Measures |
|--------|--------|-----------------|
| Schema match | High | Do all referenced columns exist? |
| Type coherence | Medium | Are comparisons type-safe? |
| Historical accuracy | High | Have similar queries been verified before? |
| Query complexity | Low | Is the query unusually complex? |

A low confidence score doesn't mean the query is wrong — it means you should review it carefully before confirming. A high score means the system has strong evidence (often from your own past verifications) that the SQL correctly answers the question.

## Trust Is Earned, Not Assumed

BoloDB starts every database relationship in **Supervised mode**. Every query result needs your confirmation. As you verify answers, the system accumulates evidence and moves toward **Assisted** and eventually **Trusted** modes — but only for query patterns you've explicitly validated.

This isn't AI autonomy. It's AI accountability. The system earns your trust through demonstrated accuracy, not through confident-sounding disclaimers.

## Try It Yourself

Connect a read-only user to BoloDB and test the boundaries. Try asking it to delete data, modify records, or run DDL. Watch every attempt get caught, explained, and rejected — before it ever reaches your database.

Security isn't a feature we bolted on. It's the foundation everything else is built on.
