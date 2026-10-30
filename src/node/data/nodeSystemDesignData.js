// System Design & Sequence Flow Data for Node.js Backend Problems
export const NODE_SYSTEM_DESIGN_REGISTRY = {
  // N1: Custom Transform Stream: CSV to JSON
  1: {
    systemDesign: {
      componentHierarchy: "DiskSource (fs.createReadStream) -> CsvToJsonTransform (stream.Transform) -> JsonArraySink (fs.createWriteStream / HTTP Response)",
      stateModel: {
        "residualTail": "string - Holds incomplete trailing line string between 64KB chunk boundaries.",
        "headers": "string[] - Parsed CSV column header names from line 0.",
        "rowCount": "number - Cumulative parsed records count."
      },
      browserApis: [
        "stream.Transform (Node.js Core Stream)",
        "fs.createReadStream({ highWaterMark: 65536 })",
        "stream.pipeline(source, transform, sink, callback)",
        "Buffer.byteLength(chunk)"
      ],
      dataFlow: "fs.createReadStream reads 64KB -> passes to CsvToJsonTransform._transform() -> prepends residual tail -> splits by newline -> pops last incomplete line -> JSON.stringify() -> this.push() -> downstream sink.",
      invariants: [
        "Memory footprint NEVER exceeds O(1) chunk buffer size (~64KB).",
        "Trailing residual string is ALWAYS flushed in _flush() upon stream end.",
        "All streams in pipeline are guaranteed destroyed if any error fires."
      ]
    },
    sequenceDiagram: {
      actors: ["Client/Trigger", "ReadStream", "TransformStream", "SinkStream", "V8GarbageCollector"],
      steps: [
        { step: 1, from: "Client/Trigger", to: "ReadStream", action: "Initiate pipeline()", detail: "Calls stream.pipeline(source, transform, sink)." },
        { step: 2, from: "ReadStream", to: "TransformStream", action: "Emits 64KB chunk", detail: "Pumps binary buffer into TransformStream._transform()." },
        { step: 3, from: "TransformStream", to: "TransformStream", action: "Splits lines & buffers tail", detail: "Parses complete lines to JSON; keeps incomplete tail." },
        { step: 4, from: "TransformStream", to: "SinkStream", action: "Pushes JSON records", detail: "Calls this.push(jsonLine + '\\n') to downstream." },
        { step: 5, from: "TransformStream", to: "V8GarbageCollector", action: "Reclaims processed chunk", detail: "Old buffer is unreferenced; GC runs without heap bloat." },
        { step: 6, from: "TransformStream", to: "SinkStream", action: "Calls _flush() and closes", detail: "Finalizes tail and emits 'finish'." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User as Client
  participant Read as ReadStream (FS/Socket)
  participant Transform as CsvTransformStream
  participant Sink as Destination Writable
  participant V8 as V8 Heap GC

  User->>Read: stream.pipeline(source, transform, sink)
  loop Every 64KB Chunk
    Read->>Transform: chunk emitted -> _transform(chunk)
    Transform->>Transform: Split lines + save incomplete tail
    Transform->>Sink: this.push(JSON.stringify(record))
    Transform-->>V8: Unreference processed chunk (constant RAM)
  end
  Read->>Transform: emit("end")
  Transform->>Transform: _flush() -> push remaining tail
  Transform->>Sink: emit("finish")
  Sink-->>User: Pipeline Complete Callback (zero OOM)`
    }
  },

  // N2: Stream Backpressure Controller
  2: {
    systemDesign: {
      componentHierarchy: "ProducerReadable -> HighWaterMarkBuffer (16KB) -> SlowConsumerWritable",
      stateModel: {
        "bufferLevel": "number - Percentage of writable highWaterMark filled.",
        "isPaused": "boolean - Whether readable.pause() has been triggered.",
        "drainCount": "number - Total 'drain' synchronization cycles."
      },
      browserApis: [
        "writable.write(chunk) (returns boolean backpressure signal)",
        "readable.pause() (stops pulling chunks from kernel)",
        "readable.resume() (resumes chunk ingestion)",
        "writable.on('drain') (emitted when buffer empties below threshold)"
      ],
      dataFlow: "Producer pumps chunks -> consumer writes -> buffer hits highWaterMark -> write() returns false -> producer pauses -> consumer drains buffer -> emits 'drain' -> producer resumes.",
      invariants: [
        "Producer MUST pause when write() returns false.",
        "Producer MUST resume ONLY after receiving 'drain' event.",
        "Memory buffer MUST NEVER exceed highWaterMark limit."
      ]
    },
    sequenceDiagram: {
      actors: ["FastProducer", "WritableBuffer", "SlowConsumer"],
      steps: [
        { step: 1, from: "FastProducer", to: "WritableBuffer", action: "writable.write(chunk)", detail: "Producer pushes 16KB data." },
        { step: 2, from: "WritableBuffer", to: "FastProducer", action: "Returns false", detail: "Internal buffer exceeds highWaterMark." },
        { step: 3, from: "FastProducer", to: "FastProducer", action: "Calls readable.pause()", detail: "Stops reading from disk/socket." },
        { step: 4, from: "WritableBuffer", to: "SlowConsumer", action: "Flushes data to slow I/O", detail: "Consumer writes to slow database." },
        { step: 5, from: "WritableBuffer", to: "FastProducer", action: "Emits 'drain' event", detail: "Internal write buffer is emptied." },
        { step: 6, from: "FastProducer", to: "FastProducer", action: "Calls readable.resume()", detail: "Producer resumes data pumping." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  participant FastProducer as Fast Producer (Readable)
  participant Buffer as Writable Stream Buffer
  participant SlowConsumer as Slow Consumer (DB/Sink)

  FastProducer->>Buffer: write(chunk)
  Note over Buffer: Buffer hits highWaterMark!
  Buffer-->>FastProducer: returns false (Backpressure!)
  FastProducer->>FastProducer: readable.pause() (Stop I/O)
  Buffer->>SlowConsumer: Drain to database slowly...
  Note over Buffer: Buffer drained below threshold
  Buffer->>FastProducer: emit("drain")
  FastProducer->>FastProducer: readable.resume() (Continue I/O)`
    }
  }
};

// Generic Node System Design Generator for all 100 questions
export function getNodeSystemDesign(question) {
  if (NODE_SYSTEM_DESIGN_REGISTRY[question.id]) {
    return NODE_SYSTEM_DESIGN_REGISTRY[question.id];
  }

  const { title, category } = question;

  return {
    systemDesign: {
      componentHierarchy: `ClientRequest -> NodeHTTPGateway -> ${title.replace(/\s+/g, '')}Service -> Database/EventBus`,
      stateModel: {
        "status": "string - Current lifecycle state of the backend service.",
        "activeConnections": "number - Active socket/connection handles.",
        "latencyMs": "number - Rolling sub-millisecond execution latency."
      },
      browserApis: [
        "Node.js Core Runtime (v20+ / v22+ LTS)",
        "Libuv Event Loop & Thread Pool",
        "process.on('SIGTERM', gracefulShutdown)",
        "AsyncLocalStorage (Trace Context)"
      ],
      dataFlow: `Client dispatches payload -> Gateway validates signature & rate limits -> ${title} executes asynchronously -> Returns response -> Emits metrics to Prometheus.`,
      invariants: [
        "Event loop MUST remain unblocked (sub-5ms lag invariant).",
        "All asynchronous resources MUST be released in finally blocks.",
        "Process MUST handle SIGTERM gracefully without dropping in-flight connections."
      ]
    },
    sequenceDiagram: {
      actors: ["Client", "NodeGateway", "BackendWorker", "Database"],
      steps: [
        { step: 1, from: "Client", to: "NodeGateway", action: "HTTP / Socket Dispatch", detail: "Client initiates request to backend service." },
        { step: 2, from: "NodeGateway", to: "BackendWorker", action: "Asynchronous Handoff", detail: "Request passed without blocking event loop." },
        { step: 3, from: "BackendWorker", to: "Database", action: "Optimized Query / Transaction", detail: "Executes indexed query with connection pooling." },
        { step: 4, from: "Database", to: "BackendWorker", action: "Result Settlement", detail: "Returns rows; connection returned to pool." },
        { step: 5, from: "BackendWorker", to: "Client", action: "JSON / Stream Response", detail: "Flushes response headers and payload." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor Client as Client / API Caller
  participant Gateway as Node.js HTTP Gateway
  participant Service as ${title.slice(0, 20)} Worker
  participant DB as DB / Redis Cache

  Client->>Gateway: Request
  Gateway->>Service: Non-blocking async dispatch
  Service->>DB: Query / Transaction
  DB-->>Service: Result
  Service-->>Gateway: Formatted Response
  Gateway-->>Client: 200 OK (Clean Socket)`
    }
  };
}
