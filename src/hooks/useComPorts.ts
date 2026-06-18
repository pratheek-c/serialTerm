import { useState, useEffect, useCallback } from "react";
import type { ComPortInfo } from "../types";
import { getComPorts } from "../services/comPortService";

interface UseComPortsResult {
  ports: ComPortInfo[];
  activePorts: ComPortInfo[];
  inactivePorts: ComPortInfo[];
  loading: boolean;
  error: string;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  selectedPort: ComPortInfo | undefined;
  refresh: () => Promise<void>;
  lastRefresh: Date;
}

/**
 * Hook that manages COM port state — fetching, filtering, and selection.
 */
export function useComPorts(): UseComPortsResult {
  const [ports, setPorts] = useState<ComPortInfo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getComPorts();
      setPorts(result);
      setSelectedIndex((prev) => Math.min(prev, Math.max(0, result.length - 1)));
      setLastRefresh(new Date());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const activePorts = ports.filter((p) => p.status === "active");
  const inactivePorts = ports.filter((p) => p.status === "inactive");
  const selectedPort = ports[selectedIndex];

  return {
    ports,
    activePorts,
    inactivePorts,
    loading,
    error,
    selectedIndex,
    setSelectedIndex,
    selectedPort,
    refresh,
    lastRefresh,
  };
}
