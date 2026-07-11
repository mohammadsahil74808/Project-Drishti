# services/

Business logic layer. Every non-trivial operation (creating a FIR, computing a risk
score, building a network graph) lives here as a plain, testable function/class —
called by `api/` routes and, where relevant, by `workers/` background jobs. This is
the layer unit tests target most heavily.
