export class ResponseModal<T = null> {
    constructor(public status: number, public message: string | object, public data?: T) {}
}
