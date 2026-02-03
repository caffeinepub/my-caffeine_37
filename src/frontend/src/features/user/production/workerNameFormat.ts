interface WorkEntry {
  names?: string[];
  name?: string;
}

export function formatWorkerNames(entry: WorkEntry): string[] {
  if (Array.isArray(entry.names)) {
    return entry.names.length > 0 ? entry.names : ['Unknown worker'];
  }
  if (entry.name) {
    return [entry.name];
  }
  return ['Unknown worker'];
}
