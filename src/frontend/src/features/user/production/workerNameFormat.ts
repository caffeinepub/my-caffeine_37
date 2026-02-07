interface WorkEntry {
  names?: string[];
  workerNames?: string[];
  name?: string;
}

export function formatWorkerNames(entry: WorkEntry): string[] {
  if (Array.isArray(entry.names) && entry.names.length > 0) {
    return entry.names;
  }
  if (Array.isArray(entry.workerNames) && entry.workerNames.length > 0) {
    return entry.workerNames;
  }
  if (entry.name) {
    return [entry.name];
  }
  return ['Unknown worker'];
}
