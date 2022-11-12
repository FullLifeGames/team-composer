import { getCurrentInstance } from "vue";
import mitt from "mitt";
import type { EventType, Emitter } from "mitt";

export default function useEmitter(): Emitter<Record<EventType, unknown>> {
  const internalInstance = getCurrentInstance();
  if (internalInstance) {
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    return emitter;
  } else {
    return mitt();
  }
}
