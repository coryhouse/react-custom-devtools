import { useEffect, useRef, useState } from "react";
import { setupWorker, SetupWorkerApi } from "msw";
import { HttpSettings } from "../types/types";

/** Start Mock Service Worker with the provided config and return true when ready. */
export const useWorker = <TCustomSettings>(
  { startOptions, requestHandlers }: HttpSettings,
  config: TCustomSettings
) => {
  const configRef = useRef(config);
  const [isReady, setIsReady] = useState(false);

  // Store the config in a ref so the useEffect below that starts
  // the worker runs only once, yet reads the latest config values
  // as they change in the devtools.
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const worker = setupWorker(...requestHandlers(configRef));

    const startWorker = async (worker: SetupWorkerApi) => {
      await worker.start(startOptions);
      setIsReady(true);
    };

    startWorker(worker);
  }, []);

  return isReady;
};
