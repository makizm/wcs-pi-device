export class GpioWatcher {
    constructor(gpio: number)

    /** Start watching OUT pin for value changes */
    start(listener: (erro: Error, value: string) => void): void;

    /** Stop the watcher */
    stop(): void;
}
