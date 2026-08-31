import type { Channel, ConsumeMessage } from 'amqplib';
import type { EnergyEvent } from '../amqp/energy-event';
import { ForwardService } from './forward.service';

describe('ForwardService', () => {
  let service: ForwardService;
  let channel: { ack: jest.Mock; nack: jest.Mock };
  let message: ConsumeMessage;
  let event: EnergyEvent;
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = fetchMock as unknown as typeof fetch;
    fetchMock.mockReset();

    const config = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'MASTER_URL') return 'http://master:3000';
        if (key === 'INTERNAL_TOKEN') return 'secret-token';
        throw new Error(`unexpected getOrThrow: ${key}`);
      }),
      get: jest.fn((key: string) => {
        if (key === 'REQUEST_TIMEOUT_MS') return 5_000;
        if (key === 'MAX_FORWARD_RETRIES') return 3;
        return undefined;
      }),
    };

    service = new ForwardService(config as never);
    channel = { ack: jest.fn(), nack: jest.fn() };
    message = { fields: { deliveryTag: 1 } } as unknown as ConsumeMessage;
    event = { idpk: 'idpk-1', type: 'demand-set', packageBody: {} } as EnergyEvent;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('envía el header de token interno al master', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 201 });

    await service.forward(event, channel as unknown as Channel, message);

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers['x-internal-token']).toBe('secret-token');
    expect(init.method).toBe('POST');
    expect(channel.ack).toHaveBeenCalledWith(message);
  });

  it('hace ack ante un 2xx', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 201 });

    await service.forward(event, channel as unknown as Channel, message);

    expect(channel.ack).toHaveBeenCalledWith(message);
    expect(channel.nack).not.toHaveBeenCalled();
  });

  it('descarta (nack requeue:false) ante un 4xx', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => '{"message":"bad"}',
    });

    await service.forward(event, channel as unknown as Channel, message);

    expect(channel.nack).toHaveBeenCalledWith(message, false, false);
    expect(channel.ack).not.toHaveBeenCalled();
  });

  it('reintenta y ackea tras un 5xx transitorio', async () => {
    fetchMock
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true, status: 201 });

    const promise = service.forward(event, channel as unknown as Channel, message);
    await jest.advanceTimersByTimeAsync(100_000);
    await promise;

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(channel.ack).toHaveBeenCalledWith(message);
    expect(channel.nack).not.toHaveBeenCalled();
  });

  it('reintenta tras un error de red y ackea', async () => {
    fetchMock
      .mockRejectedValueOnce(new Error('fetch failed'))
      .mockResolvedValueOnce({ ok: true, status: 201 });

    const promise = service.forward(event, channel as unknown as Channel, message);
    await jest.advanceTimersByTimeAsync(100_000);
    await promise;

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(channel.ack).toHaveBeenCalledWith(message);
  });

  it('hace requeue (no pierde el evento) tras agotar reintentos', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503 });

    const promise = service.forward(event, channel as unknown as Channel, message);
    await jest.advanceTimersByTimeAsync(100_000);
    await promise;

    // maxRetries = 3 → 1 intento + 3 reintentos = 4 llamadas.
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(channel.ack).not.toHaveBeenCalled();
    expect(channel.nack).toHaveBeenCalledWith(message, false, true);
  });
});
