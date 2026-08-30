/** Estructura mínima del evento esperado según el modelo de datos de la Etapa 2. */
export interface EnergyEvent {
  idpk: string;
  type: string;
  packageBody: {
    validUntil?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/** Parsea y valida el payload JSON de un mensaje de la cola. Lanza si no es un evento válido. */
export function parseEnergyEvent(content: Buffer): EnergyEvent {
  let raw: unknown;
  try {
    raw = JSON.parse(content.toString('utf8'));
  } catch {
    throw new Error('el mensaje no es un JSON válido');
  }

  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error('el mensaje no es un objeto JSON');
  }

  const event = raw as Partial<EnergyEvent>;

  if (typeof event.idpk !== 'string' || event.idpk.trim() === '') {
    throw new Error("falta el campo 'idpk' o no es un string");
  }
  if (typeof event.type !== 'string' || event.type.trim() === '') {
    throw new Error("falta el campo 'type' o no es un string");
  }
  if (
    typeof event.packageBody !== 'object' ||
    event.packageBody === null ||
    Array.isArray(event.packageBody)
  ) {
    throw new Error("falta el campo 'packageBody' o no es un objeto");
  }

  return event as EnergyEvent;
}
