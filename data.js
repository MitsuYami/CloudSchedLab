// ============================================================
// data.js — Ground truth from CloudSimPlus simulation results
// Source: Final Year Project Report (Tables 4.1 – 4.5)
// ============================================================

const DATA = {
  // ----------------------------------------------------------
  // Table 4.1 — Fault-Free Performance (seed=42, 20 tasks, 8 VMs)
  // ----------------------------------------------------------
  faultFree: [
    {
      algo: "Broker Default",
      type: "baseline",
      makespan: 120.0,
      imbalance: 183.71,
      cpuTime: 649.86,
      avgExec: 32.49,
      throughput: 0.17,
      completed: 20,
      total: 20,
    },
    {
      algo: "FCFS",
      type: "heuristic",
      makespan: 62.0,
      imbalance: 47.74,
      cpuTime: 381.97,
      avgExec: 19.1,
      throughput: 0.32,
      completed: 20,
      total: 20,
    },
    {
      algo: "Min-Min",
      type: "heuristic",
      makespan: 41.62,
      imbalance: 32.89,
      cpuTime: 300.52,
      avgExec: 15.03,
      throughput: 0.48,
      completed: 20,
      total: 20,
    },
    {
      algo: "GA",
      type: "intelligent",
      makespan: 32.75,
      imbalance: 34.43,
      cpuTime: 364.7,
      avgExec: 18.24,
      throughput: 0.61,
      completed: 20,
      total: 20,
    },
    {
      algo: "FT-GA",
      type: "ft",
      makespan: 71.01,
      imbalance: 43.22,
      cpuTime: 495.32,
      avgExec: 24.77,
      throughput: 0.28,
      completed: 20,
      total: 20,
    },
  ],

  // ----------------------------------------------------------
  // Table 4.2 — Fault Scenario (VM2, VM4, VM6 failed simultaneously)
  // ----------------------------------------------------------
  faultScenario: [
    {
      algo: "Broker Default",
      type: "baseline",
      makespan: 120.0,
      imbalance: 183.71,
      cpuTime: 649.86,
      avgExec: 32.49,
      completed: 20,
      dropped: 0,
      note: "Structural artefact of lazy assignment",
    },
    {
      algo: "FCFS",
      type: "heuristic",
      makespan: 37.89,
      imbalance: 11.25,
      cpuTime: 194.29,
      avgExec: 17.66,
      completed: 11,
      dropped: 9,
      note: "45% task loss",
    },
    {
      algo: "Min-Min",
      type: "heuristic",
      makespan: 40.62,
      imbalance: 32.89,
      cpuTime: 167.67,
      avgExec: 15.24,
      completed: 11,
      dropped: 9,
      note: "45% task loss",
    },
    {
      algo: "GA",
      type: "intelligent",
      makespan: 32.75,
      imbalance: 25.26,
      cpuTime: 247.03,
      avgExec: 19.0,
      completed: 13,
      dropped: 7,
      note: "35% task loss",
    },
    {
      algo: "Resubmission",
      type: "ft",
      makespan: 61.06,
      imbalance: 22.33,
      cpuTime: 448.72,
      avgExec: 22.44,
      completed: 20,
      dropped: 0,
      note: "FCFS-style reassignment",
    },
    {
      algo: "FT-GA",
      type: "ft",
      makespan: 71.01,
      imbalance: 43.22,
      cpuTime: 495.32,
      avgExec: 24.77,
      completed: 20,
      dropped: 0,
      note: "Greedy min-load recovery",
    },
    {
      algo: "Replication",
      type: "ft",
      makespan: 516.06,
      imbalance: 936.66,
      cpuTime: 1268.06,
      avgExec: 39.63,
      completed: 20,
      dropped: 0,
      note: "2× resource cost every run",
    },
  ],

  // ----------------------------------------------------------
  // Table 4.3 — Non-FT Statistical Validation (mean ± std, 30 runs)
  // ----------------------------------------------------------
  statsNonFT: [
    {
      algo: "Broker Default",
      makespan: 104.78,
      makespanStd: 14.76,
      imbalance: 159.71,
      imbalanceStd: 25.93,
      cpuTime: 603.7,
      cpuStd: 70.54,
      avgExec: 30.18,
      avgExecStd: 3.53,
      throughput: 0.19,
      throughputStd: 0.03,
      completed: 20.0,
      completedStd: 0.0,
    },
    {
      algo: "FCFS",
      makespan: 42.89,
      makespanStd: 8.04,
      imbalance: 23.52,
      imbalanceStd: 9.82,
      cpuTime: 220.12,
      cpuStd: 21.45,
      avgExec: 18.28,
      avgExecStd: 2.07,
      throughput: 0.29,
      throughputStd: 0.05,
      completed: 12.1,
      completedStd: 0.92,
    },
    {
      algo: "Min-Min",
      makespan: 40.03,
      makespanStd: 3.35,
      imbalance: 33.75,
      imbalanceStd: 5.47,
      cpuTime: 167.77,
      cpuStd: 17.6,
      avgExec: 15.25,
      avgExecStd: 1.6,
      throughput: 0.28,
      throughputStd: 0.02,
      completed: 11.0,
      completedStd: 0.0,
    },
    {
      algo: "GA",
      makespan: 33.73,
      makespanStd: 3.87,
      imbalance: 19.83,
      imbalanceStd: 7.35,
      cpuTime: 223.2,
      cpuStd: 20.88,
      avgExec: 18.62,
      avgExecStd: 1.83,
      throughput: 0.36,
      throughputStd: 0.05,
      completed: 12.03,
      completedStd: 0.96,
    },
  ],

  // ----------------------------------------------------------
  // Table 4.4 — FT Methods Statistical Validation (mean ± std, 30 runs)
  // ----------------------------------------------------------
  statsFT: [
    {
      algo: "Resubmission",
      makespan: 69.36,
      makespanStd: 9.11,
      imbalance: 40.24,
      imbalanceStd: 18.08,
      cpuTime: 451.05,
      cpuStd: 52.87,
      avgExec: 22.55,
      avgExecStd: 2.64,
      throughput: 0.29,
      throughputStd: 0.04,
      completed: 20.0,
      completedStd: 0.0,
    },
    {
      algo: "FT-GA",
      makespan: 58.75,
      makespanStd: 21.98,
      imbalance: 44.17,
      imbalanceStd: 22.85,
      cpuTime: 423.92,
      cpuStd: 109.61,
      avgExec: 21.2,
      avgExecStd: 5.48,
      throughput: 0.39,
      throughputStd: 0.15,
      completed: 20.0,
      completedStd: 0.0,
    },
    {
      algo: "Replication",
      makespan: 512.31,
      makespanStd: 47.28,
      imbalance: 946.99,
      imbalanceStd: 90.8,
      cpuTime: 1242.57,
      cpuStd: 117.89,
      avgExec: 38.63,
      avgExecStd: 4.18,
      throughput: 0.06,
      throughputStd: 0.01,
      completed: 32.23,
      completedStd: 1.19,
    },
  ],

  // ----------------------------------------------------------
  // Table 4.5 — Fault Sensitivity (30 runs each, p = 0.10 → 0.70)
  // ----------------------------------------------------------
  faultSensitivity: [
    {
      p: 0.1,
      vmsFailed: 0.6,
      resubmission: {
        makespan: 49.48,
        makespanStd: 19.5,
        recovery: 100.0,
        overhead: 47.6,
      },
      ftga: {
        makespan: 42.9,
        makespanStd: 14.3,
        recovery: 100.0,
        overhead: 27.9,
      },
      replication: {
        makespan: 512.31,
        makespanStd: 47.3,
        recovery: 99.8,
        overhead: 1425.3,
      },
    },
    {
      p: 0.25,
      vmsFailed: 1.7,
      resubmission: {
        makespan: 62.5,
        makespanStd: 20.6,
        recovery: 100.0,
        overhead: 86.5,
      },
      ftga: {
        makespan: 58.75,
        makespanStd: 22.0,
        recovery: 100.0,
        overhead: 74.8,
      },
      replication: {
        makespan: 512.31,
        makespanStd: 47.3,
        recovery: 99.0,
        overhead: 1425.3,
      },
    },
    {
      p: 0.4,
      vmsFailed: 2.6,
      resubmission: {
        makespan: 71.06,
        makespanStd: 19.1,
        recovery: 100.0,
        overhead: 112.6,
      },
      ftga: {
        makespan: 66.6,
        makespanStd: 21.4,
        recovery: 100.0,
        overhead: 98.1,
      },
      replication: {
        makespan: 512.31,
        makespanStd: 47.3,
        recovery: 98.0,
        overhead: 1425.3,
      },
    },
    {
      p: 0.55,
      vmsFailed: 3.7,
      resubmission: {
        makespan: 85.89,
        makespanStd: 21.9,
        recovery: 100.0,
        overhead: 156.8,
      },
      ftga: {
        makespan: 87.72,
        makespanStd: 28.7,
        recovery: 100.0,
        overhead: 162.5,
      },
      replication: {
        makespan: 512.31,
        makespanStd: 47.3,
        recovery: 95.8,
        overhead: 1425.3,
      },
    },
    {
      p: 0.7,
      vmsFailed: 5.0,
      resubmission: {
        makespan: 145.73,
        makespanStd: 109.9,
        recovery: 100.0,
        overhead: 334.1,
      },
      ftga: {
        makespan: 147.19,
        makespanStd: 109.4,
        recovery: 100.0,
        overhead: 337.3,
      },
      replication: {
        makespan: 512.31,
        makespanStd: 47.3,
        recovery: 92.2,
        overhead: 1425.3,
      },
    },
  ],

  // ----------------------------------------------------------
  // Scalability Analysis (Section 4.5)
  // ----------------------------------------------------------
  scalability: [
    {
      scale: "Small",
      tasks: 20,
      vms: 8,
      faultedVMs: 3,
      faultPct: 37.5,
      gaMakespan: 32.72,
      ftgaMakespan: 61.07,
      recoveredTasks: 8,
      gaOptTime: 569,
      overhead: 86.6,
    },
    {
      scale: "Medium",
      tasks: 100,
      vms: 20,
      faultedVMs: 6,
      faultPct: 30.0,
      gaMakespan: 67.48,
      ftgaMakespan: 85.43,
      recoveredTasks: 28,
      gaOptTime: 99,
      overhead: 26.6,
    },
    {
      scale: "Large",
      tasks: 500,
      vms: 50,
      faultedVMs: 19,
      faultPct: 38.0,
      gaMakespan: 185.16,
      ftgaMakespan: 199.25,
      recoveredTasks: 193,
      gaOptTime: 467,
      overhead: 7.6,
    },
  ],

  // ----------------------------------------------------------
  // Infrastructure Config (Section 3.1)
  // ----------------------------------------------------------
  vms: [
    { id: "VM0", type: "Small", mips: 2000, pes: 2, ram: 4096 },
    { id: "VM1", type: "Small", mips: 2000, pes: 2, ram: 4096 },
    { id: "VM2", type: "Small", mips: 2000, pes: 2, ram: 4096 },
    { id: "VM3", type: "Medium", mips: 5000, pes: 2, ram: 4096 },
    { id: "VM4", type: "Medium", mips: 5000, pes: 2, ram: 4096 },
    { id: "VM5", type: "Medium", mips: 5000, pes: 2, ram: 4096 },
    { id: "VM6", type: "Large", mips: 9000, pes: 2, ram: 4096 },
    { id: "VM7", type: "Large", mips: 9000, pes: 2, ram: 4096 },
  ],

  // ----------------------------------------------------------
  // GA Configuration (Section 3.2)
  // ----------------------------------------------------------
  gaConfig: {
    populationSize: 50,
    generations: 100,
    mutationRate: 0.05,
    alpha: 0.7,
    beta: 0.3,
    selection: "Tournament",
    crossover: "Single-point",
    elitism: true,
    convergenceGen: "60–80",
  },

  // ----------------------------------------------------------
  // Key findings for About / Summary page
  // ----------------------------------------------------------
  keyFindings: [
    { stat: "72.7%", label: "GA makespan improvement over Broker Default" },
    { stat: "47.2%", label: "GA makespan improvement over FCFS" },
    { stat: "21.4%", label: "GA makespan improvement over Min-Min" },
    {
      stat: "100%",
      label: "FT-GA task recovery rate across all fault levels (p=0.10–0.70)",
    },
    {
      stat: "15.3%",
      label: "FT-GA mean makespan improvement over Resubmission (30 runs)",
    },
    {
      stat: "2.93×",
      label: "Less CPU time than Replication (FT-GA vs Replication)",
    },
    {
      stat: "7.6%",
      label: "FT-GA overhead at large scale (500 tasks) — dilution effect",
    },
    {
      stat: "1425%",
      label: "Replication overhead — fixed cost regardless of fault rate",
    },
  ],
};
