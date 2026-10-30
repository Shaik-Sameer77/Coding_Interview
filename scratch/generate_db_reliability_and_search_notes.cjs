// scratch/generate_db_reliability_and_search_notes.cjs
// Script to generate:
// 1. Part 16 Section 16.7: Module 7 — Production Database Reliability
// 2. Part 17 Sections 17.1, 17.2, 17.3: MongoDB vs MySQL Decision Framework (10 Scenarios & Q&A)
// 3. Part 7 Sections 7.3, 7.4: Request-to-Database Flow & Search Engineering
// Governed by AGENTS.md standards.

const fs = require('fs');
const path = require('path');

// ============================================================================
// PART 16: SECTION 16.7 — PRODUCTION DATABASE RELIABILITY
// ============================================================================
const section_16_7 = {
  id: "16.7",
  title: "50. Production Database Reliability: Connection Pools, Replication & Schema Migrations",
  content: `### 1. Topic Overview & Mental Model
A database running on localhost rarely fails. In production, however, databases face connection exhaustion, slow query thread pool starvation, replication lag on read replicas, deadlocks under peak traffic, and schema migration locks that take down entire platforms.
**Database Reliability Engineering (DBRE)** is the practice of designing defensive connection lifecycles, zero-downtime schema evolution, automated failovers, and least-privilege security boundaries.

---

### 2. Connection Pool Sizing & Preventing Connection Exhaustion

- **The Connection Illusion**: Many developers assume "more connections = faster performance". **This is false.**
- Each active database connection requires operating system thread context switches, RAM allocations (~1-2MB per thread in MySQL/Postgres), and CPU cache invalidations. If a database server with 8 CPU cores receives 1,000 concurrent database connections, the CPU spends 90% of its cycles swapping thread context rather than executing queries!
- **Optimal Pool Sizing Formula (The HikariCP / PostgreSQL Rule)**:
  $$\\text{Pool Size} = (\\text{Core Count} \\times 2) + \\text{Effective Spindle Count}$$
  - For an 8-core cloud VM with fast NVMe SSD: $8 \\times 2 + 1 = 17$ to $20$ connections per Node.js process!
- **Preventing Connection Exhaustion**:
  - Distribute pool limits across application replicas: $\\text{Total App Sockets} = \\text{Instances} \\times \\text{Pool Size}$. Ensure total sockets stay well below the database's \`max_connections\` (leaving a buffer for admin \`SUPER\` connections).
  - Use an intermediate connection pooler like **ProxySQL** (for MySQL) or **PgBouncer** (for PostgreSQL) to multiplex thousands of client connections over a compact pool of physical server connections.

---

### 3. Replication Architectures, High Availability & Replication Lag

1. **Replication Topologies**:
   - **Asynchronous Replication**: Primary writes to local storage and confirms success to the client immediately. Secondaries pull changes asynchronously. High write throughput, but potential data loss if Primary dies before replicating.
   - **Semi-Synchronous Replication**: Primary waits until at least one replica acknowledges receipt into its relay log before returning success to the client. Balanced durability and speed.
   - **Group Replication (MySQL InnoDB Cluster)**: Paxos-based distributed consensus across 3+ nodes with automated leader election.
2. **Replication Lag & Read Replica Inconsistency**:
   - Read replicas offload analytical and read-heavy queries. However, during high write spikes or long-running migrations, secondaries experience **Replication Lag** (falling behind the Primary by seconds or minutes).
   - **The "Read-Your-Own-Writes" Consistency Bug**: A user updates their shipping address on the Primary, and is redirected to their profile page. The profile page reads from a lagging Read Replica: the user sees their old address and files a bug ticket!
   - *Production Solution (Session Consistency Pinning)*: Pin read operations to the **Primary** database for 5–10 seconds after any mutation performed by the current user session.

---

### 4. Zero-Downtime Schema Migrations: The Expand/Contract Pattern

Never run blocking \`ALTER TABLE orders ADD COLUMN ...\` or \`RENAME COLUMN\` directly on large production tables during business hours!
- **The Expand / Contract (Parallel Run) Pattern**:
  1. **Expand**: Add the new column as nullable or with a safe default. Deploy backend code that writes to **both** old and new columns, but reads from the old column.
  2. **Backfill**: Run an asynchronous background worker script to migrate historical rows in small batches (e.g. 500 rows/second).
  3. **Switch**: Deploy backend code that reads from the new column.
  4. **Contract**: Once all services use the new column, run a non-blocking migration to drop the old column.
- Use online schema migration tools like **gh-ost** (GitHub Online Schema Tool) or **pt-online-schema-change** to alter multi-gigabyte tables without holding metadata table locks.

---

### 5. Defensive Database Security & Least-Privilege Accounts

- **Never connect your backend using \`root\` or \`admin\`!**
- Create dedicated application service accounts with least-privilege grants:
  \`\`\`sql
  CREATE USER 'chrona_app'@'10.0.%.%' IDENTIFIED BY 'StrongRandomSecret';
  GRANT SELECT, INSERT, UPDATE, DELETE ON chrona_prod.* TO 'chrona_app'@'10.0.%.%';
  -- Notice: NO DROP, NO ALTER, NO TRUNCATE, NO GRANT OPTION!
  \`\`\`
- **PII Protection**: Store sensitive data (SSNs, tax IDs) encrypted at rest using AES-256-GCM. Mask PII in database query logs and staging database dumps.`,
  comparisonTable: [
    { aspect: "Connection Pool Sizing", detail: "More connections degrade performance through CPU thrashing; optimal size is (CPU cores * 2) + disk spindles." },
    { aspect: "Replication Lag Solution", detail: "Pin read queries to the Primary for 5-10s following any write from that user session to guarantee read-your-own-writes." },
    { aspect: "Expand/Contract Migrations", detail: "Phased zero-downtime migration: write to both columns, backfill asynchronously, switch reads, drop old column." },
    { aspect: "Least Privilege Accounts", detail: "Application users must only have DML permissions (SELECT, INSERT, UPDATE, DELETE); ban ALTER and DROP in app users." }
  ],
  code: `// Production Database Reliability: Healthcheck, Pool Exhaustion Watchdog & Session Pinning
import mysql from 'mysql2/promise';

export class ResilientDatabaseManager {
  private pool: mysql.Pool;
  private primaryOnlyUntilMap = new Map<string, number>();

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 15,          // Sized according to CPU core formula
      queueLimit: 100,              // Cap waiting queue to reject overload
      connectTimeout: 5000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    });

    this.startPoolWatchdog();
  }

  // 1. Connection Pool Health Watchdog
  private startPoolWatchdog() {
    setInterval(() => {
      const pool = (this.pool as any).pool;
      if (pool) {
        const total = pool._allConnections.length;
        const free = pool._freeConnections.length;
        const queued = pool._connectionQueue.length;

        if (queued > 20) {
          console.warn(\`⚠️ High DB Pool Queue Alert: \${queued} requests waiting! Active: \${total - free}/\${total}\`);
        }
      }
    }, 10000);
  }

  // 2. Read-Your-Own-Writes Session Pinning
  recordMutation(userId: string) {
    // Pin to Primary for 8 seconds
    this.primaryOnlyUntilMap.set(userId, Date.now() + 8000);
  }

  shouldReadFromPrimary(userId?: string): boolean {
    if (!userId) return false;
    const expiresAt = this.primaryOnlyUntilMap.get(userId);
    if (!expiresAt) return false;
    if (Date.now() > expiresAt) {
      this.primaryOnlyUntilMap.delete(userId);
      return false;
    }
    return true;
  }

  // 3. Graceful Connection Draining
  async close() {
    await this.pool.end();
    console.log('Database connection pool cleanly drained and closed');
  }
}`,
  keyTakeaways: [
    "Size connection pools conservatively using (cores * 2); oversized pools degrade performance via CPU context switching.",
    "Pin reads to the Primary node for 5-10s after mutations to eliminate replication lag inconsistencies for active users.",
    "Always apply the Expand/Contract pattern with tools like gh-ost for zero-downtime production schema changes.",
    "Never connect application code using administrative DB credentials; grant only SELECT, INSERT, UPDATE, DELETE."
  ]
};

// ============================================================================
// PART 17: MONGODB VS MYSQL DECISION FRAMEWORK (10 SCENARIOS & INTERVIEW Q&A)
// ============================================================================
const section_17_1 = {
  id: "17.1",
  title: "51. MongoDB vs MySQL: The 18-Dimensional Architectural Decision Matrix",
  content: `### 1. Topic Overview & Mental Model
In senior engineering interviews, **never claim that one database is universally faster, more modern, or superior**.
MySQL (Relational / ACID / B+Tree) and MongoDB (Document / Semi-structured / WiredTiger) make fundamentally different trade-offs across consistency, schema flexibility, join latency, and horizontal scaling.
Your architectural credibility depends on evaluating requirements against **18 rigorous dimensions** and choosing the engine whose strengths align with the system's dominant access patterns.

---

### 2. Comprehensive 18-Dimensional Comparison Matrix

| # | Architectural Dimension | MySQL (InnoDB Relational) | MongoDB (Document NoSQL) | Senior Trade-off Guidance |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Data Model** | Fixed tabular rows & typed columns. | Hierarchical BSON documents with nested subdocs & arrays. | Pick MongoDB for tree structures; pick MySQL for flat relational records. |
| **2** | **Relationships** | 1:1, 1:N, N:N enforced via Foreign Keys. | Preferential Embedding for 1:N; references for N:N. | MySQL enforces referential integrity at the engine level. |
| **3** | **Joins** | Native relational \`JOIN\` across indexed tables. | Pipeline \`$lookup\` stage (left outer join). | MySQL executes joins with far superior optimization and index nesting. |
| **4** | **Transactions** | Multi-table ACID by default (Undo/Redo log). | Single-doc atomic; multi-doc ACID requires replica sets. | MySQL has lower latency and less cache overhead for multi-table transactions. |
| **5** | **Schema Flexibility** | Rigid. Requires \`ALTER TABLE\` DDL migrations. | Dynamic / Polymorphic. Documents hold variable fields. | MongoDB eliminates blocking schema migrations in fast-moving startups. |
| **6** | **Constraints** | PK, FK, Unique, Check, Default, NOT NULL. | Unique, JSON Schema validation at collection level. | MySQL guarantees database-enforced invariants. |
| **7** | **Query Patterns** | Structured SQL with CTEs and Window Functions. | Rich object selectors and Aggregation pipelines. | MySQL wins on complex analytical reporting; MongoDB wins on document retrieval. |
| **8** | **Indexes** | B+Tree (Clustered & Secondary), Full-Text, Spatial. | B-Tree, Multikey (arrays), Text, Geospatial, TTL. | MongoDB multikey indexes allow indexing inside nested arrays natively. |
| **9** | **Aggregations** | \`GROUP BY\`, \`HAVING\`, Analytic Window Functions. | Multi-stage Aggregation Pipeline (\`$match\`, \`$unwind\`). | Aggregation pipelines are more expressive for transforming nested documents. |
| **10** | **Data Consistency** | Immediate consistency (ACID / WAL). | Tunable consistency (Read/Write Concerns \`w: majority\`). | MySQL defaults to strict consistency; MongoDB can trade consistency for speed. |
| **11** | **Scaling** | Vertical scaling; Read replicas; Sharding via Vitess. | Native auto-sharding via mongos routers and shard keys. | MongoDB scales horizontally out-of-the-box much more seamlessly. |
| **12** | **Reporting** | Exceptional via BI tools, SQL queries, and views. | Requires specialized pipelines or MongoDB BI Connector. | SQL is the universal language of enterprise reporting and data warehouses. |
| **13** | **Schema Changes** | Requires migration tooling (Flyway, gh-ost). | Handled in application code via schema versioning. | Schema changes in MongoDB require zero database-level table locking. |
| **14** | **Operational Complexity** | High under high write volumes (sharding is hard). | High cluster complexity (mongos, config servers, shards). | Both require mature DBA expertise at petabyte scale. |
| **15** | **Developer Experience** | Requires SQL syntax or heavy ORMs (Prisma, TypeORM). | Direct mapping from JSON/TypeScript objects. | MongoDB feels native to JavaScript/TypeScript developers. |
| **16** | **Data Integrity** | Enforced by engine even if application code is buggy. | Relies heavily on application layer (Mongoose/Zod). | Buggy code can corrupt MongoDB document consistency if unvalidated. |
| **17** | **Memory Footprint** | Efficient (runs well on 1GB-4GB RAM). | Heavy (WiredTiger claims 50% RAM for cache by default). | MySQL has significantly lower idle memory requirements. |
| **18** | **CAP Theorem** | **CA** (Consistency & Availability in single-primary). | **CP** (Consistency & Partition Tolerance under default). | MongoDB halts primary writes during network partitions until election. |`,
  comparisonTable: [
    { aspect: "ACID vs Horizontal Scale", detail: "MySQL excels at multi-table transactional integrity; MongoDB excels at horizontal scale and nested document reads." },
    { aspect: "Data Integrity Layer", detail: "MySQL enforces integrity at the storage engine level; MongoDB relies heavily on application-layer validation schemas." },
    { aspect: "Schema Migrations", detail: "MySQL requires DDL migrations that can lock large tables; MongoDB supports dynamic schema evolution without locks." },
    { aspect: "Memory Requirements", detail: "MySQL has a compact memory footprint; MongoDB WiredTiger demands 50% of total host RAM for optimal caching." }
  ],
  code: `// Comparative Code Representation: Polymorphic Product Catalog in Both Engines
// SCENARIO: An E-Commerce Catalog with variable attributes (Laptops have CPUs, Shoes have Sizes)

// 1. MONGODB APPROACH: Clean Polymorphic Document Embedding (Natural fit)
export const mongoProductDocument = {
  _id: "prod_101",
  title: "MacBook Pro 16",
  category: "electronics",
  priceCents: 249900,
  attributes: {
    cpu: "M3 Max",
    ramGb: 64,
    storageGb: 2000,
    ports: ["Thunderbolt 4", "HDMI", "SD Card"]
  }
};

// 2. MYSQL APPROACH: Entity-Attribute-Value (EAV) or JSON Column
export const mySqlProductSchema = \`
-- Approach A: Using MySQL 8 native JSON with generated indexed column
CREATE TABLE products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price_cents INT UNSIGNED NOT NULL,
  attributes JSON NOT NULL,
  -- Extract and index specific JSON attribute for fast B-Tree lookups:
  cpu_model VARCHAR(50) GENERATED ALWAYS AS (attributes->>'$.cpu') STORED,
  INDEX idx_products_cpu (cpu_model)
) ENGINE=InnoDB;
\`;`,
  keyTakeaways: [
    "Never label either database as universally superior; articulate trade-offs based on access patterns.",
    "MySQL guarantees referential and relational integrity at the database storage engine layer.",
    "MongoDB provides horizontal sharding and frictionless polymorphic document modeling.",
    "MySQL 8 JSON columns bridge the gap for semi-structured data within an ACID relational core."
  ]
};

const section_17_2 = {
  id: "17.2",
  title: "52. 10 Enterprise Production Scenarios: Architectural Choice & Decision Criteria",
  content: `### 1. Topic Overview & Mental Model
In senior system design reviews, theoretical comparisons must translate into concrete architectural selections.
Below are **10 Real-World Enterprise Scenarios**. For each scenario, we declare the **Primary Recommendation**, explain the **First-Principles Architectural Rationale**, identify the **Viable Alternative**, and specify the **Conditions that could flip the decision**.

---

### 2. The 10 Enterprise Scenarios Dissected

#### Scenario 1: Marketplace Product Catalog (Diverse, Polymorphic Attributes)
- **Primary Choice**: **MongoDB**
- **Rationale**: An e-commerce marketplace sells laptops, shoes, perfumes, and groceries. Each item has completely distinct attributes (CPUs vs shoe sizes vs ingredients). In MySQL, this requires messy Entity-Attribute-Value (EAV) junction tables. In MongoDB, attributes embed naturally into a polymorphic BSON document with multikey array indexing.
- **Alternative**: MySQL with \`JSON\` columns.
- **Condition to Flip to MySQL**: If the catalog is small (<50,000 items) with fixed categories, or if strict foreign keys to supplier and warehouse tables dominate queries.

#### Scenario 2: Orders, Invoicing & Payments
- **Primary Choice**: **MySQL**
- **Rationale**: Financial ledgers and payment settlements demand strict ACID guarantees, foreign key integrity (an invoice item cannot exist without a parent invoice), and immutable double-entry accounting.
- **Alternative**: MongoDB with multi-document transactions.
- **Condition to Flip to MongoDB**: If orders must store an immutable snapshot of line items and shipping addresses that never change after placement, and write volume exceeds single-node MySQL throughput.

#### Scenario 3: User Profiles & Notification Preferences
- **Primary Choice**: **MongoDB**
- **Rationale**: User profiles hold hierarchical nested settings (dark mode, email digests, push token arrays, OAuth provider links). Fetched in 1 round-trip on every page load.
- **Alternative**: MySQL \`users\` table with 1:1 \`user_profiles\` relation.
- **Condition to Flip to MySQL**: If user IDs are referenced as foreign keys across 15+ relational business tables (orders, reviews, subscriptions, tickets).

#### Scenario 4: Ephemeral Audit Logs & Security Trails
- **Primary Choice**: **MongoDB**
- **Rationale**: Append-heavy, write-intensive workload with semi-structured metadata. Built-in **TTL Indexes** (\`expireAfterSeconds: 30 * 86400\`) automatically purge expired logs in the background with zero cron maintenance.
- **Alternative**: MySQL with monthly table partitioning.
- **Condition to Flip to MySQL**: If compliance regulations (SOC2 / HIPAA) require relational foreign keys to user IDs and immutable SQL auditing tables.

#### Scenario 5: High-Volume Analytics Events & Telemetry
- **Primary Choice**: **MongoDB (or ClickHouse / TimescaleDB)**
- **Rationale**: Ingesting tens of thousands of event JSON payloads per second. MongoDB's native time-series collections and horizontal sharding scale write throughput effortlessly.
- **Alternative**: PostgreSQL with TimescaleDB plugin.
- **Condition to Flip to Relational**: If analytics queries require complex SQL joins against user and financial tables.

#### Scenario 6: Real-Time Inventory Reservation & Stock Counters
- **Primary Choice**: **MySQL (or Redis + MySQL)**
- **Rationale**: Real-time inventory decrement during flash sales requires strict row-level exclusive locks (\`SELECT stock FROM inventory WHERE id = ? FOR UPDATE\`) or atomic checks (\`UPDATE inventory SET stock = stock - 1 WHERE id = ? AND stock >= 1\`) under strict serializability to prevent overselling.
- **Alternative**: MongoDB with \`findOneAndUpdate({ _id: id, stock: { $gte: 1 } }, { $inc: { stock: -1 } })\`.
- **Condition to Flip to MongoDB**: If inventory is embedded directly within warehouse documents partitioned by region.

#### Scenario 7: Airline & Hotel Booking Systems
- **Primary Choice**: **MySQL**
- **Rationale**: Bookings involve interrelated constraints: seat assignments, room inventory, customer accounts, promo codes, and payment charges. Isolation levels (Repeatable Read) prevent double-booking anomalies.
- **Alternative**: MongoDB with multi-document distributed transactions.
- **Condition to Flip to MongoDB**: If booking documents are pre-allocated and customer details are embedded directly inside reservation records.

#### Scenario 8: Core Financial Ledger & Banking Transactions
- **Primary Choice**: **MySQL (or PostgreSQL)**
- **Rationale**: Double-entry bookkeeping requires mathematically balanced journal entries (total debits must equal total credits across accounts). Relational foreign keys and transactional consistency are non-negotiable.
- **Alternative**: Dedicated ledger databases (Amazon QLDB, TigerBeetle).
- **Condition to Flip to MongoDB**: Almost never appropriate for a core general ledger.

#### Scenario 9: Hierarchical Documents & Organization Trees
- **Primary Choice**: **MongoDB**
- **Rationale**: Complex nested folders, permissions, and department hierarchies map cleanly into nested BSON subdocuments. Can be retrieved in a single read without recursive CTE SQL joins.
- **Alternative**: MySQL with recursive Common Table Expressions (\`WITH RECURSIVE\`).
- **Condition to Flip to MySQL**: If depth exceeds BSON 16MB limits or permissions require strict foreign key cascades.

#### Scenario 10: Rapidly Evolving Product Metadata (Early-Stage Startup MVP)
- **Primary Choice**: **MongoDB**
- **Rationale**: Fast-moving development where fields change daily. Zero database schema migrations required during initial product iterations.
- **Alternative**: MySQL.
- **Condition to Flip to MySQL**: As soon as domain entities stabilize and complex relational queries emerge between users, subscriptions, and billing.`,
  comparisonTable: [
    { aspect: "Marketplace Catalog", detail: "MongoDB chosen for polymorphic attributes; flip to MySQL if catalog is small with fixed categories." },
    { aspect: "Orders & Payments", detail: "MySQL chosen for ACID double-entry integrity; flip to MongoDB only if scale exceeds single-node write IOPS." },
    { aspect: "Audit Logs", detail: "MongoDB chosen for append-heavy throughput and TTL automated expiration; flip to MySQL for relational compliance." },
    { aspect: "Inventory Flash Sale", detail: "MySQL chosen for row-level locks (FOR UPDATE); Redis cache layer recommended upstream." }
  ],
  code: `// Decision Logic Engine: Automated Architectural Database Recommender
export type DatabaseChoice = 'MONGODB' | 'MYSQL' | 'HYBRID_POLYGLOT';

export interface WorkloadCharacteristics {
  isFinancialOrLedger: boolean;
  hasPolymorphicSchema: boolean;
  requiresComplexJoins: boolean;
  writeThroughputPerSec: number;
  unboundedDocumentGrowth: boolean;
}

export function recommendDatabase(workload: WorkloadCharacteristics): {
  choice: DatabaseChoice;
  reasoning: string;
} {
  // Rule 1: Financial ledgers require strict ACID relational guarantees
  if (workload.isFinancialOrLedger) {
    return {
      choice: 'MYSQL',
      reasoning: 'Strict double-entry accounting and referential integrity require relational ACID transactions.'
    };
  }

  // Rule 2: Diverse, non-uniform attributes with high write volume
  if (workload.hasPolymorphicSchema && !workload.requiresComplexJoins) {
    return {
      choice: 'MONGODB',
      reasoning: 'Polymorphic attributes and nested document structures map cleanly to BSON without messy EAV tables.'
    };
  }

  // Rule 3: Heavy joins across 5+ entities
  if (workload.requiresComplexJoins) {
    return {
      choice: 'MYSQL',
      reasoning: 'Complex multi-entity relational joins are optimized natively by SQL B+Tree engines.'
    };
  }

  // Default balanced architecture
  return {
    choice: 'HYBRID_POLYGLOT',
    reasoning: 'Consider Polyglot Persistence: MySQL for core transactional entities, MongoDB for catalog and telemetry.'
  };
}`,
  keyTakeaways: [
    "Always state the primary choice, the viable alternative, and the specific constraint that flips the decision.",
    "Use MySQL for financial ledgers, double-entry accounting, and heavily interconnected relational models.",
    "Use MongoDB for polymorphic product catalogs, tree-structured documents, and write-heavy telemetry with TTL purging.",
    "Senior architects often employ Polyglot Persistence: relational database for billing/users, document store for catalog/events."
  ]
};

const section_17_3 = {
  id: "17.3",
  title: "53. Senior Technical Interview Defense: MongoDB vs MySQL Architecture Q&A",
  content: `### 1. Topic Overview & Mental Model
In Staff and Senior Engineer interviews, questions comparing MongoDB and MySQL are designed to test your **first-principles engineering judgment**.
Interviewers listen for whether you quote superficial marketing slogans (e.g. "MongoDB is web-scale") or explain concrete runtime trade-offs (e.g. WiredTiger cache allocation, lock contention, BSON serialization overhead, and replication topologies).

---

### 2. High-Frequency Senior Interview Questions & Spoken Defense

#### Q1: "Why would you choose MySQL over MongoDB for an e-commerce checkout system?"
- **Spoken Pitch (60 Seconds)**:
  > "For checkout and payment settlement, I prioritize **engine-enforced data integrity and ACID consistency**. Checkout coordinates orders, line items, inventory deduction, coupon usage, and payment records. In MySQL, foreign key constraints guarantee that an order line item can never reference a non-existent product or be orphaned if an order fails. Furthermore, InnoDB's row-level locking (\`SELECT ... FOR UPDATE\`) and Repeatable Read isolation eliminate phantom reads and overselling race conditions at the database layer. In contrast, while MongoDB supports multi-document transactions, they require replica sets, add significant WiredTiger cache pressure, and rely heavily on application-level logic to enforce referential integrity."
- **Follow-up Probe**: "Can you store an order snapshot in MongoDB?"
  - *Answer*: "Yes, and that is where MongoDB shines. In a hybrid architecture, I use MySQL to execute the transactional checkout and inventory lock, and emit an event to write an immutable, denormalized Order Snapshot document in MongoDB for fast single-round-trip retrieval in customer mobile apps."

---

#### Q2: "When does MongoDB outperform MySQL in production?"
- **Spoken Pitch (60 Seconds)**:
  > "MongoDB outperforms MySQL primarily when query patterns align with **single-document access affinity**. If a user profile, product page, or dashboard view model can be embedded into a single BSON document, MongoDB satisfies the entire query with a single disk seek and zero joins. Secondly, in write-intensive telemetry, IoT, or audit ingestion, MongoDB's native horizontal sharding distributes write IOPS across multiple replica sets with zero application-layer sharding middleware. In contrast, sharding MySQL horizontally requires complex solutions like Vitess or manual application-level partitioning."

---

#### Q3: "How do you handle schema migrations in MongoDB vs MySQL on a 100-million-row collection?"
- **Spoken Pitch (60 Seconds)**:
  > "In MySQL, executing an \`ALTER TABLE\` on a 100M-row table can block writes or consume massive disk I/O. I would use an online schema tool like **gh-ost** or **pt-online-schema-change**, which creates a ghost table, streams binlog row changes, backfills historical data in batches, and performs an atomic table cutover. In MongoDB, documents are schema-flexible, meaning we don't run an \`ALTER\` command. Instead, we use the **Expand/Contract Application Pattern**: the backend code handles both Schema Version 1 and Version 2 simultaneously using defaults or Mongoose discriminators, and a background worker lazily migrates documents upon read or via a batch cursor."`,
  comparisonTable: [
    { aspect: "Checkout Integrity", detail: "MySQL engine-enforced foreign keys prevent orphaned line items; InnoDB row locks stop stock overselling." },
    { aspect: "Single-Seek Reads", detail: "MongoDB satisfies complete view models in a single disk seek when data is embedded in 1 document." },
    { aspect: "Migration at 100M Scale", detail: "MySQL uses gh-ost ghost tables with binlog streaming; MongoDB uses application-layer Expand/Contract pattern." },
    { aspect: "Sharding Complexity", detail: "MongoDB supports native horizontal auto-sharding; MySQL requires Vitess or application-level sharding logic." }
  ],
  code: `// Dual-Schema Versioning Pattern for Frictionless MongoDB Migrations
export interface LegacyUserDocument {
  _id: string;
  name: string; // Old format: "Alex Johnson"
  schemaVersion: 1;
}

export interface ModernUserDocument {
  _id: string;
  firstName: string; // New format
  lastName: string;  // New format
  schemaVersion: 2;
}

export type UserDoc = LegacyUserDocument | ModernUserDocument;

// Zero-Downtime Lazy Application Migration
export function normalizeUserDocument(doc: any): ModernUserDocument {
  // If document is already version 2, return directly
  if (doc.schemaVersion === 2) {
    return doc as ModernUserDocument;
  }

  // If document is version 1, migrate on-the-fly without database locks
  const [firstName, ...rest] = (doc.name || '').split(' ');
  const lastName = rest.join(' ') || '';

  return {
    _id: doc._id,
    firstName: firstName || 'Anonymous',
    lastName: lastName || '',
    schemaVersion: 2
  };
}`,
  keyTakeaways: [
    "Ground interview answers in engine mechanics (locks, buffer pools, BSON traversals, binlogs).",
    "Highlight hybrid Polyglot Persistence: relational database for transactional checkout, document store for denormalized read snapshots.",
    "Explain gh-ost online schema change mechanics for MySQL migrations at multi-million row scale.",
    "Demonstrate application-layer schema versioning (schemaVersion: 2) for zero-downtime MongoDB evolution."
  ]
};

// ============================================================================
// PART 7: REQUEST-TO-DATABASE FLOW & SEARCH ENGINEERING
// ============================================================================
const section_7_3 = {
  id: "7.3",
  title: "21. The Request-to-Database Flow: The Complete 14-Step Search Lifecycle",
  content: `### 1. Topic Overview & Mental Model
A senior backend engineer must be able to trace a web request across the **entire full-stack lifecycle**: from the user typing a character into a browser search input, down through networking, middleware, authorization, query planning, database B-Tree index traversal, and all the way back to the rendered UI.

---

### 2. The Complete 14-Step Request Lifecycle Breakdown

\`\`\`
[1. User Keystroke] ──► [2. Debounce 300ms] ──► [3. Build URL & Params]
                                                          │ (HTTPS Network Hop)
                                                          ▼
[6. AuthN / AuthZ] ◄── [5. CORS & Middleware] ◄── [4. Server / Reverse Proxy]
       │
       ▼
[7. Zod Schema Parse] ──► [8. Service Logic] ──► [9. Repository Prepared Query]
                                                          │ (Database Socket Hop)
                                                          ▼
[12. Map Response DTO] ◄── [11. Sort & Paginate] ◄── [10. B-Tree Index Seek]
       │
       ▼ (HTTP 200 JSON Response)
[13. Frontend UI Render (Loading/Empty/Success/Error)] ──► [14. Vitest / Supertest Suite]
\`\`\`

#### Step-by-Step Mechanical Walkthrough:

1. **User Enters Search Query in Frontend**: User types \`"react"\` into a search input bar.
2. **Frontend Validates & Debounces**: To prevent firing 5 HTTP requests for 5 keystrokes, a \`useDebounce(value, 300)\` hook delays execution until typing pauses for 300ms.
3. **Frontend Builds URL**: The client serializes query parameters into a clean URL: \`/api/v1/products?q=react&category=books&page=1&limit=20\`.
4. **Request Traverses Network**: Reaches the cloud load balancer (AWS ALB / Cloudflare), which terminates TLS and forwards the HTTP request to the Express backend.
5. **CORS & Global Middleware**: Express executes \`cors()\`, \`helmet()\`, and parses query strings.
6. **Authentication & Authorization**: JWT token in \`Authorization: Bearer <token>\` is verified; user identity and tenant context are attached to \`req.user\`.
7. **Query Parameter Validation (Zod)**: Raw strings (\`page="1"\`, \`limit="20"\`) are coerced into positive integers and sanitized against injection.
8. **Service Layer Business Logic**: Enforces multi-tenant scoping (\`orgId = req.user.orgId\`), checks feature flags, and queries the cache layer.
9. **Repository Constructs Safe Query**: The repository uses parameterized queries or structured MongoDB query objects, preventing SQL / NoSQL injection.
10. **Database Index & Query Plan Evaluation**: The database query planner evaluates indexes, choosing an **\`IXSCAN\`** (B-Tree seek) matching the search criteria.
11. **Results Sorted & Paginated**: Database retrieves records matching the keyset or limit, sorting by relevance or creation date.
12. **Backend Maps Database Records to DTO**: Internal columns (like \`cost_cents\`, \`internal_notes\`) are stripped; clean public DTO is returned with \`200 OK\`.
13. **Frontend Handles UI States**: Frontend React component renders distinct states: **Loading Skeleton**, **Empty Search State**, **Success Data List**, or **Error Banner**.
14. **Tests Verify Behavior**: Automated Vitest / Supertest integration tests verify that malicious inputs, unauthenticated requests, and pagination boundaries behave predictably.`,
  comparisonTable: [
    { aspect: "Frontend Debouncing", detail: "Delays network request until user stops typing for 300ms, eliminating 80%+ of redundant backend traffic." },
    { aspect: "Boundary Validation (Zod)", detail: "Coerces string query parameters into typed integers and bounds page size (e.g. max limit: 100) to prevent DoS." },
    { aspect: "Database Plan Evaluation", detail: "Query optimizer selects B-Tree index range scan (IXSCAN); avoids full table scan (COLLSCAN/ALL)." },
    { aspect: "DTO Projection Mapping", detail: "Transforms raw database records into public response objects, preventing accidental disclosure of sensitive columns." }
  ],
  code: `// Complete End-to-End Implementation of the 14-Step Search Workflow
import express, { Request, Response } from 'express';
import { z } from 'zod';

// ============================================================================
// STEP 7: Zod Query Validation Schema
// ============================================================================
export const productSearchQuerySchema = z.object({
  q: z.string().trim().max(100).default(''),
  category: z.string().trim().max(50).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20), // Max limit prevents memory DoS
  sortBy: z.enum(['price_asc', 'price_desc', 'created_desc']).default('created_desc')
});

export type ProductSearchQuery = z.infer<typeof productSearchQuerySchema>;

// ============================================================================
// STEP 9: Repository Safe Parameterized Query (MySQL Example)
// ============================================================================
export interface ProductSearchResult {
  id: string;
  title: string;
  sku: string;
  priceCents: number;
}

export class ProductSearchRepository {
  constructor(private db: any) {}

  async search(tenantId: string, params: ProductSearchQuery): Promise<{ items: ProductSearchResult[]; total: number }> {
    const conditions: string[] = ['organization_id = ?', 'deleted_at IS NULL'];
    const values: any[] = [tenantId];

    // Safe Prefix Search (Avoids Leading Wildcard for Index Usage)
    if (params.q) {
      conditions.push('title LIKE ?');
      values.push(\`\${params.q}%\`); // SARGable prefix search!
    }

    if (params.category) {
      conditions.push('category = ?');
      values.push(params.category);
    }

    const whereClause = conditions.join(' AND ');
    const offset = (params.page - 1) * params.limit;

    // Parameterized SQL query preventing injection
    const query = \`
      SELECT id, title, sku, price_cents
      FROM products
      WHERE \${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?;
    \`;

    const [rows] = await this.db.execute(query, [...values, params.limit, offset]);
    return { items: rows, total: rows.length };
  }
}

// ============================================================================
// STEP 12: Route Handler Mapping to API Response DTO
// ============================================================================
export const searchProductsHandler = (repo: ProductSearchRepository) => {
  return async (req: Request, res: Response) => {
    const parseResult = productSearchQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'ValidationFailed', issues: parseResult.error.issues });
    }

    const tenantId = (req as any).user?.organizationId || 'org_default';
    const { items, total } = await repo.search(tenantId, parseResult.data);

    return res.json({
      success: true,
      meta: {
        page: parseResult.data.page,
        limit: parseResult.data.limit,
        total
      },
      data: items
    });
  };
};`,
  keyTakeaways: [
    "A full request flows through 14 distinct stages from client keystroke to database storage engine and back.",
    "Always debounce frontend search inputs (300ms) to protect backend services from volumetric request storms.",
    "Validate and cap query parameter limits (max limit: 100) using Zod to prevent memory exhaustion DoS.",
    "Scope all repository search queries by tenant organizationId to eliminate unauthorized cross-tenant data leaks."
  ]
};

const section_7_4 = {
  id: "7.4",
  title: "22. Search Engineering: Filtering, Collation, Regex Limits & Caching",
  content: `### 1. Topic Overview & Mental Model
Designing a production search API requires balancing **query expressiveness**, **database index utilization**, and **cache performance**.
Junior engineers frequently deploy \`LIKE '%term%'\` in MySQL or \`{ $regex: term }\` in MongoDB. In production, leading wildcards invalidate B-Tree indexes, triggering catastrophic full table scans that freeze the database under traffic.

---

### 2. Search Mechanics: SQL LIKE vs MongoDB Regex vs Full-Text Search

#### 1. The Leading Wildcard Trap
- **The Problem**: A B-Tree index is sorted like a physical dictionary. You can easily find words starting with \`"app"\` (trailing wildcard \`LIKE 'app%'\`). But you cannot look up words ending with \`"pple"\` without reading every word in the entire dictionary from A to Z!
- \`WHERE title LIKE '%react%'\` or \`{ title: /react/i }\` forces a **Full Table / Collection Scan** (\`type: ALL\` or \`COLLSCAN\`).
- **Remediation for Real-Time Prefix Search**: Restrict search to prefix matches: \`LIKE 'react%'\`.
- **Remediation for Substring / Keyword Search**: Use dedicated Full-Text Search:
  - MySQL: \`FULLTEXT\` index with \`MATCH(title) AGAINST('react' IN BOOLEAN MODE)\`.
  - MongoDB: \`$text\` index with \`$search\`.
  - Dedicated Engine: Offload to **Elasticsearch / Meilisearch / OpenSearch** when catalog exceeds 1M documents.

---

### 3. Case Sensitivity, Collations & Normalization

- **MySQL Collations**:
  - \`utf8mb4_0900_ai_ci\`: **Accent-Insensitive (ai)** and **Case-Insensitive (ci)**. Searching for \`"resume"\` matches \`"résumé"\`, \`"Resume"\`, and \`"RESUME"\`.
  - \`utf8mb4_bin\`: Binary collation; strictly case-sensitive. Essential for password hashes, API keys, and Base64 tokens.
- **Search Normalization**:
  - Normalize incoming search queries before querying: strip excess whitespace, convert to lowercase, and apply Unicode NFKC normalization: \`query.normalize('NFKC').trim().toLowerCase()\`.

---

### 4. High-Performance Redis Cache-Aside Pattern

To protect the primary database from redundant search queries:
1. Client searches for \`"laptop"\`.
2. Generate deterministic cache key: \`cache:products:search:\${tenantId}:\${hash(queryParameters)}\`.
3. Check Redis:
   - **Cache Hit**: Return cached JSON string immediately in <2ms.
   - **Cache Miss**: Execute database query, store result in Redis with a 5-minute TTL (\`EX 300\`), and return response.
4. **Cache Stampede Defense**: If a popular search query expires under 1,000 req/sec, all 1,000 requests hit the database simultaneously! Mitigate using a distributed Redis mutex lock or probabilistic early expiration.`,
  comparisonTable: [
    { aspect: "Leading Wildcard (%term)", detail: "Invalidates B-Tree index seeking, forcing full table/collection scan; use prefix search or Full-Text indexes." },
    { aspect: "Collation (ai_ci vs bin)", detail: "ai_ci provides case- and accent-insensitive search; bin enforces strict byte-exact matching for tokens." },
    { aspect: "Cache-Aside Pattern", detail: "Caches query results in Redis for 5 minutes; bypasses database entirely on repeated queries." },
    { aspect: "Unicode Normalization", detail: "Applying .normalize('NFKC') eliminates variations between combined and pre-composed Unicode glyphs." }
  ],
  code: `// Complete Search API with Redis Cache-Aside & Collation-Safe Queries
import { Request, Response } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';

// Mock Redis Client Interface
interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode: string, ttlSeconds: number): Promise<void>;
}

export class CachedSearchService {
  constructor(private db: any, private redis: RedisClient) {}

  async searchProducts(tenantId: string, queryText: string, page = 1, limit = 20) {
    // Step 1: Normalize query string (Unicode NFKC + Trim + Lowercase)
    const normalizedQuery = queryText.normalize('NFKC').trim().toLowerCase();

    // Step 2: Generate Deterministic Cache Key
    const cacheKeyRaw = \`\${tenantId}:\${normalizedQuery}:\${page}:\${limit}\`;
    const cacheKeyHash = crypto.createHash('sha256').update(cacheKeyRaw).digest('hex');
    const cacheKey = \`cache:search:\${cacheKeyHash}\`;

    // Step 3: Check Redis Cache-Aside
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return { source: 'CACHE', data: JSON.parse(cached) };
    }

    // Step 4: Execute Database Query (Using MySQL FULLTEXT or Prefix Index)
    const offset = (page - 1) * limit;
    const [rows] = await this.db.execute(
      \`SELECT id, title, sku, price_cents
       FROM products
       WHERE organization_id = ? AND title LIKE ? AND deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?\`,
      [tenantId, \`\${normalizedQuery}%\`, limit, offset]
    );

    // Step 5: Store in Redis with 5-minute TTL (300 seconds)
    await this.redis.set(cacheKey, JSON.stringify(rows), 'EX', 300);

    return { source: 'DATABASE', data: rows };
  }
}`,
  keyTakeaways: [
    "Leading wildcards (LIKE '%term%') invalidate B-Tree seeking; use prefix search or full-text indexes.",
    "Configure utf8mb4_0900_ai_ci collation for case- and accent-insensitive human catalog search.",
    "Implement the Redis Cache-Aside pattern with deterministic hashed cache keys to protect databases from repeated search storms.",
    "Normalize search strings using Unicode NFKC to guarantee consistent matching across international character sets."
  ]
};

// ============================================================================
// APPLY UPDATES TO SCRATCH JSON FILES
// ============================================================================

// 1. Update Part 16 (Add Section 16.7) in scratch/node_notes_parts_9_to_16.json
const p9to16Path = path.resolve(__dirname, 'node_notes_parts_9_to_16.json');
const p9to16 = JSON.parse(fs.readFileSync(p9to16Path, 'utf-8'));
const p16 = p9to16.find(p => p.id === 16);
if (p16) {
  // Check if 16.7 already exists
  const existingIdx = p16.sections.findIndex(s => s.id === "16.7");
  if (existingIdx !== -1) {
    p16.sections[existingIdx] = section_16_7;
  } else {
    p16.sections.push(section_16_7);
  }
  fs.writeFileSync(p9to16Path, JSON.stringify(p9to16, null, 2), 'utf-8');
  console.log('✅ Updated Part 16 with Section 16.7 (Production Database Reliability).');
}

// 2. Update Part 17 in scratch/node_notes_parts_17_to_24.json
const p17to24Path = path.resolve(__dirname, 'node_notes_parts_17_to_24.json');
const p17to24 = JSON.parse(fs.readFileSync(p17to24Path, 'utf-8'));
const p17 = p17to24.find(p => p.id === 17);
if (p17) {
  p17.title = "Part 17 — MongoDB vs MySQL: The Definitive Architectural Decision Matrix";
  p17.badge = "Database Architecture";
  p17.sections = [section_17_1, section_17_2, section_17_3];
  fs.writeFileSync(p17to24Path, JSON.stringify(p17to24, null, 2), 'utf-8');
  console.log('✅ Updated Part 17 with 3 exhaustive sections (18 Dimensions, 10 Scenarios, Interview Q&A).');
}

// 3. Update Part 7 in scratch/node_notes_parts_1_to_8.json
const p1to8Path = path.resolve(__dirname, 'node_notes_parts_1_to_8.json');
const p1to8 = JSON.parse(fs.readFileSync(p1to8Path, 'utf-8'));
const p7 = p1to8.find(p => p.id === 7);
if (p7) {
  // Check if 7.3 and 7.4 exist
  const existing73 = p7.sections.findIndex(s => s.id === "7.3");
  if (existing73 !== -1) p7.sections[existing73] = section_7_3;
  else p7.sections.push(section_7_3);

  const existing74 = p7.sections.findIndex(s => s.id === "7.4");
  if (existing74 !== -1) p7.sections[existing74] = section_7_4;
  else p7.sections.push(section_7_4);

  fs.writeFileSync(p1to8Path, JSON.stringify(p1to8, null, 2), 'utf-8');
  console.log('✅ Updated Part 7 with Sections 7.3 & 7.4 (Request-to-Database Flow & Search Engineering).');
}

console.log('🎉 All files updated successfully. Ready to build.');
