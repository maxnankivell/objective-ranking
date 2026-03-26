import type { RankingData } from "../types/RankingData";

export type MergeJob = {
  left: RankingData[];
  right: RankingData[];
  leftPtr: number;
  rightPtr: number;
  merged: RankingData[];
};

export type SortState = {
  pendingJobs: MergeJob[];
  currentJob: MergeJob | null;
  completedGroups: RankingData[][];
  isDone: boolean;
};

export function createJobs(groups: RankingData[][]): {
  jobs: MergeJob[];
  passThrough: RankingData[][];
} {
  const jobs: MergeJob[] = [];
  const passThrough: RankingData[][] = [];
  for (let i = 0; i < groups.length; i += 2) {
    if (i + 1 < groups.length) {
      jobs.push({
        left: groups[i],
        right: groups[i + 1],
        leftPtr: 0,
        rightPtr: 0,
        merged: [],
      });
    } else {
      passThrough.push(groups[i]);
    }
  }
  return { jobs, passThrough };
}

export function initSortState(items: RankingData[]): SortState {
  if (items.length <= 1) {
    return {
      pendingJobs: [],
      currentJob: null,
      completedGroups: items.length === 1 ? [items] : [],
      isDone: true,
    };
  }
  const groups = items.map((item) => [item]);
  const { jobs, passThrough } = createJobs(groups);
  return {
    currentJob: jobs[0] ?? null,
    pendingJobs: jobs.slice(1),
    completedGroups: passThrough,
    isDone: false,
  };
}

export function advanceSortState(
  prev: SortState,
  choice: "left" | "right",
): SortState {
  if (!prev.currentJob) return prev;

  const job: MergeJob = {
    left: prev.currentJob.left,
    right: prev.currentJob.right,
    leftPtr: prev.currentJob.leftPtr,
    rightPtr: prev.currentJob.rightPtr,
    merged: [...prev.currentJob.merged],
  };

  if (choice === "left") {
    job.merged.push(job.left[job.leftPtr]);
    job.leftPtr++;
  } else {
    job.merged.push(job.right[job.rightPtr]);
    job.rightPtr++;
  }

  if (job.leftPtr >= job.left.length) {
    while (job.rightPtr < job.right.length) {
      job.merged.push(job.right[job.rightPtr]);
      job.rightPtr++;
    }
  } else if (job.rightPtr >= job.right.length) {
    while (job.leftPtr < job.left.length) {
      job.merged.push(job.left[job.leftPtr]);
      job.leftPtr++;
    }
  }

  const jobDone =
    job.leftPtr >= job.left.length && job.rightPtr >= job.right.length;

  if (!jobDone) {
    return { ...prev, currentJob: job };
  }

  const newCompleted = [...prev.completedGroups, job.merged];

  if (prev.pendingJobs.length > 0) {
    return {
      currentJob: prev.pendingJobs[0],
      pendingJobs: prev.pendingJobs.slice(1),
      completedGroups: newCompleted,
      isDone: false,
    };
  }

  if (newCompleted.length === 1) {
    return {
      currentJob: null,
      pendingJobs: [],
      completedGroups: newCompleted,
      isDone: true,
    };
  }

  const { jobs, passThrough } = createJobs(newCompleted);
  return {
    currentJob: jobs[0] ?? null,
    pendingJobs: jobs.slice(1),
    completedGroups: passThrough,
    isDone: false,
  };
}
