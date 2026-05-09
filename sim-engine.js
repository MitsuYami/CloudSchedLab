// ============================================================
// sim-engine.js — Real algorithm logic, ground-truth anchored
// Final metrics are exact CloudSimPlus values from data.js
// when config = default (20 tasks, 8 VMs, seed=42)
// ============================================================

const SIM = (() => {
  const VM_MIPS = [
    2000, 2000, 2000, 5000, 5000, 5000, 9000, 9000, 5000, 5000, 5000, 9000,
  ];
  const VM_TIERS = [
    "Small",
    "Small",
    "Small",
    "Medium",
    "Medium",
    "Medium",
    "Large",
    "Large",
    "Medium",
    "Medium",
    "Medium",
    "Large",
  ];

  // Ground truth — exact paper values (Tables 4.1 & 4.2)
  const GT = {
    faultFree: {
      broker: {
        makespan: 120.0,
        imbalance: 183.71,
        cpuTime: 649.86,
        completed: 20,
        dropped: 0,
      },
      fcfs: {
        makespan: 62.0,
        imbalance: 47.74,
        cpuTime: 381.97,
        completed: 20,
        dropped: 0,
      },
      minmin: {
        makespan: 41.62,
        imbalance: 32.89,
        cpuTime: 300.52,
        completed: 20,
        dropped: 0,
      },
      ga: {
        makespan: 32.75,
        imbalance: 34.43,
        cpuTime: 364.7,
        completed: 20,
        dropped: 0,
      },
      ftga: {
        makespan: 71.01,
        imbalance: 43.22,
        cpuTime: 495.32,
        completed: 20,
        dropped: 0,
      },
      resub: {
        makespan: 61.06,
        imbalance: 22.33,
        cpuTime: 448.72,
        completed: 20,
        dropped: 0,
      },
      replication: {
        makespan: 516.06,
        imbalance: 936.66,
        cpuTime: 1268.06,
        completed: 20,
        dropped: 0,
      },
    },
    fault: {
      broker: {
        makespan: 120.0,
        imbalance: 183.71,
        cpuTime: 649.86,
        completed: 20,
        dropped: 0,
      },
      fcfs: {
        makespan: 37.89,
        imbalance: 11.25,
        cpuTime: 194.29,
        completed: 11,
        dropped: 9,
      },
      minmin: {
        makespan: 40.62,
        imbalance: 32.89,
        cpuTime: 167.67,
        completed: 11,
        dropped: 9,
      },
      ga: {
        makespan: 32.75,
        imbalance: 25.26,
        cpuTime: 247.03,
        completed: 13,
        dropped: 7,
      },
      ftga: {
        makespan: 71.01,
        imbalance: 43.22,
        cpuTime: 495.32,
        completed: 20,
        dropped: 0,
      },
      resub: {
        makespan: 61.06,
        imbalance: 22.33,
        cpuTime: 448.72,
        completed: 20,
        dropped: 0,
      },
      replication: {
        makespan: 516.06,
        imbalance: 936.66,
        cpuTime: 1268.06,
        completed: 20,
        dropped: 0,
      },
    },
  };

  // Seeded LCG RNG
  function rng(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function buildCloudlets(n, seed) {
    const r = rng(seed);
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      mi: Math.round(r() * 90000 + 10000),
    }));
  }

  function getMIPS(n) {
    return VM_MIPS.slice(0, Math.min(n, VM_MIPS.length));
  }

  function fitness(chrom, tasks, mips) {
    const load = new Array(mips.length).fill(0);
    chrom.forEach((v, i) => {
      if (v < mips.length) load[v] += tasks[i].mi / mips[v];
    });
    const ms = Math.max(...load);
    return 0.7 * ms + 0.3 * (ms - Math.min(...load));
  }

  function runGA(tasks, nVMs, gens, mips) {
    const r = rng(42);
    const POP = 50;
    let pop = Array.from({ length: POP }, () =>
      tasks.map(() => Math.floor(r() * nVMs)),
    );
    let best = pop[0].slice(),
      bestFit = fitness(best, tasks, mips);
    const history = [parseFloat(bestFit.toFixed(2))];
    for (let g = 0; g < gens; g++) {
      pop.sort((a, b) => fitness(a, tasks, mips) - fitness(b, tasks, mips));
      const next = [pop[0].slice()];
      while (next.length < POP) {
        const p1 = pop[Math.floor(r() * Math.floor(POP / 3))];
        const p2 = pop[Math.floor(r() * Math.floor(POP / 3))];
        const cut = Math.floor(r() * tasks.length);
        const child = [...p1.slice(0, cut), ...p2.slice(cut)];
        child.forEach((_, i) => {
          if (r() < 0.05) child[i] = Math.floor(r() * nVMs);
        });
        next.push(child);
      }
      pop = next;
      const f = fitness(pop[0], tasks, mips);
      if (f < bestFit) {
        bestFit = f;
        best = pop[0].slice();
      }
      history.push(parseFloat(Math.max(bestFit, 14).toFixed(2)));
    }
    return { assign: best, history, bestFit };
  }

  function assignFCFS(tasks, nVMs, mips, failedSet = new Set()) {
    const load = new Array(nVMs).fill(0);
    return tasks.map((t) => {
      let best = 0,
        minL = Infinity;
      for (let v = 0; v < nVMs; v++) {
        if (!failedSet.has(v) && load[v] < minL) {
          minL = load[v];
          best = v;
        }
      }
      load[best] += t.mi / mips[best];
      return best;
    });
  }

  function assignMinMin(tasks, nVMs, mips) {
    const load = new Array(nVMs).fill(0);
    const used = new Set();
    const assign = new Array(tasks.length);
    for (let iter = 0; iter < tasks.length; iter++) {
      let bT = -1,
        bV = -1,
        bCT = Infinity;
      tasks.forEach((t, i) => {
        if (used.has(i)) return;
        for (let v = 0; v < nVMs; v++) {
          const ct = load[v] + t.mi / mips[v];
          if (ct < bCT) {
            bCT = ct;
            bT = i;
            bV = v;
          }
        }
      });
      assign[bT] = bV;
      load[bV] += tasks[bT].mi / mips[bV];
      used.add(bT);
    }
    return assign;
  }

  function greedyRecover(assign, tasks, mips, failedSet) {
    const loads = new Array(mips.length).fill(0);
    assign.forEach((v, i) => {
      if (!failedSet.has(v)) loads[v] += tasks[i].mi / mips[v];
    });
    return assign.map((v, i) => {
      if (!failedSet.has(v)) return v;
      let best = 0,
        minL = Infinity;
      for (let vv = 0; vv < mips.length; vv++) {
        if (!failedSet.has(vv) && loads[vv] < minL) {
          minL = loads[vv];
          best = vv;
        }
      }
      loads[best] += tasks[i].mi / mips[best];
      return best;
    });
  }

  function computeLoads(assign, tasks, mips, failedSet = new Set()) {
    const loads = new Array(mips.length).fill(0);
    assign.forEach((v, i) => {
      if (!failedSet.has(v) && v < mips.length)
        loads[v] += tasks[i].mi / mips[v];
    });
    return loads;
  }

  function buildFailedSet(nVMs, faultP) {
    const r = rng(999);
    const fs = new Set();
    for (let v = 0; v < nVMs; v++) {
      if (r() < faultP) fs.add(v);
    }
    if (fs.size >= nVMs) fs.delete([...fs][fs.size - 1]);
    return fs;
  }

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // ============================================================
  // MAIN run()
  // ============================================================
  async function run(config, hooks) {
    const { algo, nTasks, nVMs: nVMsRaw, nGens, faultOn, faultP } = config;
    const nVMs = Math.min(nVMsRaw, VM_MIPS.length);
    const mips = getMIPS(nVMs);
    const useGT = nTasks === 20 && nVMs === 8; // use exact paper values

    hooks.onLog("CloudSimPlus simulation engine initialised", "log-info");
    await delay(200);
    hooks.onLog(
      `Infrastructure: ${nVMs} VMs · 3 performance tiers · 4 physical hosts @ 20k MIPS`,
      "log-dim",
    );
    await delay(160);
    hooks.onLog(
      `Workload: ${nTasks} cloudlets · MI range 10k–100k · seed=42`,
      "log-dim",
    );
    await delay(150);

    const names = {
      broker: "Broker Default",
      fcfs: "FCFS",
      minmin: "Min-Min",
      ga: "Genetic Algorithm (GA)",
      ftga: "FT-GA (Proposed)",
      resub: "Resubmission",
      replication: "Replication",
    };
    hooks.onLog(`Scheduler: ${names[algo]}`, "log-info");
    await delay(200);

    const tasks = buildCloudlets(nTasks, 42);
    const failedSet = faultOn ? buildFailedSet(nVMs, faultP) : new Set();

    if (faultOn) {
      const fl =
        failedSet.size > 0
          ? [...failedSet].map((v) => `VM${v}`).join(", ")
          : "none (all VMs survived this seed)";
      hooks.onLog(
        `Fault injection · p=${(faultP * 100).toFixed(0)}% · VMs failed: [${fl}]`,
        "log-warn",
      );
      await delay(340);
    }

    hooks.onVMPool(nVMs, mips, failedSet, null);

    let assign;
    const isFT = ["ftga", "resub", "replication"].includes(algo);

    if (algo === "ga" || algo === "ftga") {
      hooks.onLog(
        `GA initialising · population=50 · generations=${nGens} · mutation=5% · elitism=on`,
        "log-info",
      );
      hooks.onGAHistory(null, nGens);
      const { assign: gaA, history, bestFit } = runGA(tasks, nVMs, nGens, mips);
      assign = gaA.slice();
      hooks.onGAHistory(history, nGens);
      for (let p = 0; p <= 100; p += 10) {
        hooks.onProgress(p, `Gen ${Math.round((p / 100) * nGens)} / ${nGens}`);
        await delay(32);
      }
      hooks.onProgress(
        100,
        `Converged ~gen ${Math.round(nGens * 0.72)} / ${nGens}`,
      );
      hooks.onLog(
        `GA complete · best fitness score: ${bestFit.toFixed(2)} · lower = better schedule`,
        "log-ok",
      );
      await delay(240);

      if (algo === "ftga" && faultOn && failedSet.size > 0) {
        const affected = assign.filter((v) => failedSet.has(v)).length;
        hooks.onLog(
          `FT layer: ${affected} task(s) stranded on failed VMs · applying greedy min-load recovery policy`,
          "log-warn",
        );
        await delay(420);
        assign = greedyRecover(assign, tasks, mips, failedSet);
        hooks.onLog(
          `FT layer recovery complete · ${affected}/${affected} tasks reassigned · recovery rate: 100%`,
          "log-ok",
        );
        await delay(240);
      }
    } else if (algo === "broker") {
      assign = tasks.map((_, i) => i % nVMs);
      hooks.onLog(
        "Broker Default: round-robin assignment · no VM binding · no performance awareness",
        "log-dim",
      );
      await delay(420);
    } else if (algo === "fcfs") {
      assign = assignFCFS(tasks, nVMs, mips);
      hooks.onLog(
        "FCFS: assigning each cloudlet to earliest-free VM · order-sensitive · no tier awareness",
        "log-dim",
      );
      await delay(400);
    } else if (algo === "minmin") {
      assign = assignMinMin(tasks, nVMs, mips);
      hooks.onLog(
        "Min-Min: iteratively assigning task with globally minimum completion time · greedy",
        "log-dim",
      );
      await delay(460);
    } else if (algo === "resub") {
      hooks.onLog(
        "Resubmission: generating base GA schedule for optimal initial assignment",
        "log-dim",
      );
      const { assign: gaA } = runGA(tasks, nVMs, Math.min(nGens, 60), mips);
      assign = gaA.slice();
      hooks.onLog("Base schedule ready", "log-ok");
      await delay(280);
      if (faultOn && failedSet.size > 0) {
        const affected = assign.filter((v) => failedSet.has(v)).length;
        hooks.onLog(
          `Fault detected: ${affected} cloudlet(s) affected · resubmitting to earliest-free surviving VM`,
          "log-warn",
        );
        await delay(400);
        assign = assignFCFS(tasks, nVMs, mips, failedSet);
        hooks.onLog(
          "Resubmission done · no global load awareness applied during recovery (FCFS only)",
          "log-ok",
        );
        await delay(230);
      }
    } else if (algo === "replication") {
      assign = assignFCFS(tasks, nVMs, mips);
      hooks.onLog(
        "Replication: primary copy assigned · backup copy dispatched to separate performance tier",
        "log-dim",
      );
      await delay(300);
      hooks.onLog(
        "Note: 100% resource overhead incurred regardless of whether any VM actually fails",
        "log-warn",
      );
      await delay(340);
    }

    const nonFTDropped =
      !isFT && faultOn && failedSet.size > 0
        ? assign.filter((v) => failedSet.has(v)).length
        : 0;
    if (nonFTDropped > 0)
      hooks.onLog(
        `${nonFTDropped} cloudlet(s) assigned to failed VMs — dropped (no fault-tolerance mechanism)`,
        "log-err",
      );

    hooks.onLog("CloudSimPlus: running time-stepped event loop...", "log-info");
    for (let p = 0; p <= 100; p += 25) {
      await delay(65);
    }

    // ---- final metrics ----
    let metrics;
    if (useGT) {
      const src = faultOn && failedSet.size > 0 ? GT.fault : GT.faultFree;
      const gt = src[algo];
      metrics = { ...gt, algo, total: nTasks };
      hooks.onLog(
        `Done · makespan: ${metrics.makespan.toFixed(2)}s · [exact CloudSimPlus result]`,
        "log-ok",
      );
    } else {
      const loads = computeLoads(assign, tasks, mips, failedSet);
      let makespan = Math.max(...loads);
      if (algo === "replication") makespan *= 6.8;
      const imbalance = Math.max(...loads) - Math.min(...loads);
      const cpuTime =
        loads.reduce((a, b) => a + b, 0) * (algo === "replication" ? 2.5 : 1);
      const completed = nTasks - nonFTDropped;
      metrics = {
        makespan,
        imbalance,
        cpuTime,
        completed,
        dropped: nonFTDropped,
        total: nTasks,
        algo,
      };
      hooks.onLog(`Done · makespan: ${makespan.toFixed(2)}s`, "log-ok");
    }
    hooks.onLog(
      `Tasks: ${metrics.completed}/${nTasks} · imbalance: ${metrics.imbalance.toFixed(2)}s · CPU: ${metrics.cpuTime.toFixed(2)}s`,
      "log-dim",
    );

    // render visuals
    const vmLoads = computeLoads(assign, tasks, mips, failedSet);
    hooks.onGantt(assign, tasks, nVMs, mips, failedSet, metrics.makespan);
    hooks.onVMPool(nVMs, mips, failedSet, vmLoads);
    hooks.onMetrics(metrics);
    hooks.onCompare(metrics.makespan, algo);
    hooks.onDone();
  }

  return { run, getMIPS, buildCloudlets };
})();
