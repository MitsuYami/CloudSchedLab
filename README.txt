FT-GA Cloud Scheduling — Final Year Project Demo
================================================

HOW TO OPEN
-----------
1. Download / unzip this folder
2. Double-click index.html — opens in any browser
3. No installation, no internet required (fonts load from Google if online)

FILES
-----
index.html          → Main application (all 6 pages)
css/style.css       → Stylesheet
js/data.js          → All exact CloudSimPlus result values (Tables 4.1–4.5)
js/sim-engine.js    → Real algorithm logic (GA, FCFS, Min-Min, FT-GA, etc.)

PAGES
-----
Dashboard     → Key findings, algorithm overview, two summary charts
Simulate      → Live simulation — pick algorithm, configure, run with real GA evolution
Results       → Exact numbers from CloudSimPlus (Tables 4.1, 4.2, 4.3, 4.4)
Fault Analysis→ Sensitivity analysis across p=0.10 to p=0.70 (Table 4.5)
Scalability   → Small / Medium / Large scale results and dilution effect
About         → Research gap, GA config, simulation environment, key findings

VIVA TIPS
---------
- Click "Viva Mode" button (top right) for a fullscreen summary slide
- Best demo flow for viva:
    1. Dashboard → show 72.7% GA improvement
    2. Simulate → run GA (fault-free) → show 32.75s makespan
    3. Simulate → toggle fault injection → run FCFS → show 9 tasks dropped
    4. Simulate → switch to FT-GA with faults → show 100% recovery
    5. Fault Analysis → show replication costs 1425% overhead
- Default config (20 tasks, 8 VMs) returns exact CloudSimPlus numbers
- Non-default configs run real algorithm logic scaled from ground truth

ALGORITHMS
----------
Broker Default  Baseline — round-robin, no binding
FCFS            Heuristic — earliest-free VM
Min-Min         Heuristic — greedy minimum completion time
GA              Intelligent — genetic algorithm, α=0.7, β=0.3
FT-GA ★         Proposed — GA + greedy min-load fault recovery
Resubmission    FT baseline — FCFS reassignment on failure
Replication     FT baseline — proactive 2× copies, high overhead
